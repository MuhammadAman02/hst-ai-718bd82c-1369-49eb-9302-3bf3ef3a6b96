from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
import math

from app.database import get_db
from app.schemas.order import OrderCreate, OrderResponse, OrderListResponse
from app.services.order_service import OrderService
from app.auth.dependencies import get_current_active_user
from app.models.user import User

router = APIRouter(prefix="/orders", tags=["orders"])

@router.post("/", response_model=OrderResponse, status_code=status.HTTP_201_CREATED)
async def create_order(
    order_data: OrderCreate,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """Create order from cart"""
    order_service = OrderService(db)
    order = await order_service.create_order_from_cart(current_user.id, order_data)
    return order

@router.get("/", response_model=OrderListResponse)
async def get_user_orders(
    page: int = Query(default=1, ge=1),
    per_page: int = Query(default=10, ge=1, le=50),
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """Get user's orders"""
    order_service = OrderService(db)
    
    skip = (page - 1) * per_page
    orders, total = await order_service.get_user_orders(
        current_user.id, skip=skip, limit=per_page
    )
    
    pages = math.ceil(total / per_page)
    
    return {
        "orders": orders,
        "total": total,
        "page": page,
        "per_page": per_page,
        "pages": pages
    }

@router.get("/{order_id}", response_model=OrderResponse)
async def get_order(
    order_id: int,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """Get order by ID"""
    order_service = OrderService(db)
    order = await order_service.get_order_by_id(order_id, current_user.id)
    
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found"
        )
    
    return order

@router.get("/number/{order_number}", response_model=OrderResponse)
async def get_order_by_number(
    order_number: str,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """Get order by order number"""
    order_service = OrderService(db)
    order = await order_service.get_order_by_number(order_number, current_user.id)
    
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found"
        )
    
    return order