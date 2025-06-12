from typing import List, Optional, Tuple
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, and_
from sqlalchemy.orm import selectinload
from fastapi import HTTPException, status
from datetime import datetime
import uuid

from app.models.order import Order, OrderItem, Cart, CartItem
from app.models.user import User
from app.schemas.order import OrderCreate, OrderUpdate

class OrderService:
    def __init__(self, db: AsyncSession):
        self.db = db
    
    def _generate_order_number(self) -> str:
        """Generate unique order number"""
        timestamp = datetime.now().strftime("%Y%m%d")
        unique_id = str(uuid.uuid4())[:8].upper()
        return f"NK{timestamp}{unique_id}"
    
    async def create_order_from_cart(self, user_id: int, order_data: OrderCreate) -> Order:
        """Create order from user's cart"""
        # Get user's cart
        cart_result = await self.db.execute(
            select(Cart).options(
                selectinload(Cart.items).selectinload(CartItem.product)
            ).where(Cart.user_id == user_id)
        )
        cart = cart_result.scalar_one_or_none()
        
        if not cart or not cart.items:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Cart is empty"
            )
        
        # Calculate totals
        subtotal = sum(item.total_price for item in cart.items)
        tax_amount = subtotal * 0.08  # 8% tax
        shipping_amount = 10.00 if subtotal < 100 else 0  # Free shipping over $100
        total_amount = subtotal + tax_amount + shipping_amount
        
        # Create order
        order = Order(
            user_id=user_id,
            order_number=self._generate_order_number(),
            subtotal=subtotal,
            tax_amount=tax_amount,
            shipping_amount=shipping_amount,
            total_amount=total_amount,
            **order_data.model_dump()
        )
        
        self.db.add(order)
        await self.db.flush()  # Get order ID
        
        # Create order items from cart items
        for cart_item in cart.items:
            order_item = OrderItem(
                order_id=order.id,
                product_id=cart_item.product_id,
                quantity=cart_item.quantity,
                size=cart_item.size,
                color=cart_item.color,
                unit_price=cart_item.unit_price,
                total_price=cart_item.total_price
            )
            self.db.add(order_item)
        
        # Clear cart
        for cart_item in cart.items:
            await self.db.delete(cart_item)
        
        await self.db.commit()
        await self.db.refresh(order)
        return order
    
    async def get_order_by_id(self, order_id: int, user_id: Optional[int] = None) -> Optional[Order]:
        """Get order by ID"""
        query = select(Order).options(
            selectinload(Order.items).selectinload(OrderItem.product),
            selectinload(Order.user)
        ).where(Order.id == order_id)
        
        if user_id:
            query = query.where(Order.user_id == user_id)
        
        result = await self.db.execute(query)
        return result.scalar_one_or_none()
    
    async def get_order_by_number(self, order_number: str, user_id: Optional[int] = None) -> Optional[Order]:
        """Get order by order number"""
        query = select(Order).options(
            selectinload(Order.items).selectinload(OrderItem.product),
            selectinload(Order.user)
        ).where(Order.order_number == order_number)
        
        if user_id:
            query = query.where(Order.user_id == user_id)
        
        result = await self.db.execute(query)
        return result.scalar_one_or_none()
    
    async def get_user_orders(
        self, 
        user_id: int, 
        skip: int = 0, 
        limit: int = 20
    ) -> Tuple[List[Order], int]:
        """Get user's orders with pagination"""
        # Get total count
        count_result = await self.db.execute(
            select(func.count()).select_from(Order).where(Order.user_id == user_id)
        )
        total = count_result.scalar()
        
        # Get orders
        result = await self.db.execute(
            select(Order).options(
                selectinload(Order.items).selectinload(OrderItem.product)
            ).where(Order.user_id == user_id)
            .order_by(Order.created_at.desc())
            .offset(skip)
            .limit(limit)
        )
        orders = result.scalars().all()
        
        return orders, total
    
    async def get_all_orders(
        self, 
        skip: int = 0, 
        limit: int = 20,
        status: Optional[str] = None
    ) -> Tuple[List[Order], int]:
        """Get all orders (admin only)"""
        query = select(Order).options(
            selectinload(Order.items).selectinload(OrderItem.product),
            selectinload(Order.user)
        )
        
        if status:
            query = query.where(Order.status == status)
        
        # Get total count
        count_query = select(func.count()).select_from(query.subquery())
        count_result = await self.db.execute(count_query)
        total = count_result.scalar()
        
        # Get orders with pagination
        query = query.order_by(Order.created_at.desc()).offset(skip).limit(limit)
        result = await self.db.execute(query)
        orders = result.scalars().all()
        
        return orders, total
    
    async def update_order(self, order_id: int, order_data: OrderUpdate) -> Optional[Order]:
        """Update order (admin only)"""
        order = await self.get_order_by_id(order_id)
        if not order:
            return None
        
        # Update fields
        update_data = order_data.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(order, field, value)
        
        # Set timestamps based on status changes
        if order_data.status:
            if order_data.status == "shipped" and not order.shipped_at:
                order.shipped_at = datetime.utcnow()
            elif order_data.status == "delivered" and not order.delivered_at:
                order.delivered_at = datetime.utcnow()
        
        await self.db.commit()
        await self.db.refresh(order)
        return order