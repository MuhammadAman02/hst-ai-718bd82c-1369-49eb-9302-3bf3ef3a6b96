from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_
from sqlalchemy.orm import selectinload
from fastapi import HTTPException, status

from app.models.order import Cart, CartItem
from app.models.product import Product
from app.schemas.order import CartItemCreate, CartItemUpdate

class CartService:
    def __init__(self, db: AsyncSession):
        self.db = db
    
    async def get_or_create_cart(self, user_id: int) -> Cart:
        """Get or create cart for user"""
        result = await self.db.execute(
            select(Cart).options(
                selectinload(Cart.items).selectinload(CartItem.product)
            ).where(Cart.user_id == user_id)
        )
        cart = result.scalar_one_or_none()
        
        if not cart:
            cart = Cart(user_id=user_id)
            self.db.add(cart)
            await self.db.commit()
            await self.db.refresh(cart)
        
        return cart
    
    async def add_item_to_cart(self, user_id: int, item_data: CartItemCreate) -> CartItem:
        """Add item to cart"""
        cart = await self.get_or_create_cart(user_id)
        
        # Verify product exists and is active
        product_result = await self.db.execute(
            select(Product).where(
                and_(Product.id == item_data.product_id, Product.is_active == True)
            )
        )
        product = product_result.scalar_one_or_none()
        if not product:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Product not found"
            )
        
        # Check if item already exists in cart
        existing_item_result = await self.db.execute(
            select(CartItem).where(
                and_(
                    CartItem.cart_id == cart.id,
                    CartItem.product_id == item_data.product_id,
                    CartItem.size == item_data.size,
                    CartItem.color == item_data.color
                )
            )
        )
        existing_item = existing_item_result.scalar_one_or_none()
        
        if existing_item:
            # Update quantity
            existing_item.quantity += item_data.quantity
            await self.db.commit()
            await self.db.refresh(existing_item)
            return existing_item
        else:
            # Create new cart item
            cart_item = CartItem(
                cart_id=cart.id,
                **item_data.model_dump()
            )
            self.db.add(cart_item)
            await self.db.commit()
            await self.db.refresh(cart_item)
            return cart_item
    
    async def update_cart_item(self, user_id: int, item_id: int, item_data: CartItemUpdate) -> Optional[CartItem]:
        """Update cart item quantity"""
        cart = await self.get_or_create_cart(user_id)
        
        result = await self.db.execute(
            select(CartItem).where(
                and_(CartItem.id == item_id, CartItem.cart_id == cart.id)
            )
        )
        cart_item = result.scalar_one_or_none()
        
        if not cart_item:
            return None
        
        cart_item.quantity = item_data.quantity
        await self.db.commit()
        await self.db.refresh(cart_item)
        return cart_item
    
    async def remove_cart_item(self, user_id: int, item_id: int) -> bool:
        """Remove item from cart"""
        cart = await self.get_or_create_cart(user_id)
        
        result = await self.db.execute(
            select(CartItem).where(
                and_(CartItem.id == item_id, CartItem.cart_id == cart.id)
            )
        )
        cart_item = result.scalar_one_or_none()
        
        if not cart_item:
            return False
        
        await self.db.delete(cart_item)
        await self.db.commit()
        return True
    
    async def clear_cart(self, user_id: int) -> bool:
        """Clear all items from cart"""
        cart = await self.get_or_create_cart(user_id)
        
        # Delete all cart items
        await self.db.execute(
            select(CartItem).where(CartItem.cart_id == cart.id)
        )
        
        for item in cart.items:
            await self.db.delete(item)
        
        await self.db.commit()
        return True
    
    async def get_cart(self, user_id: int) -> Cart:
        """Get cart with items"""
        return await self.get_or_create_cart(user_id)