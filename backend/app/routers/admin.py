from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
import math

from app.database import get_db
from app.schemas.product import ProductCreate, ProductUpdate, ProductResponse, CategoryCreate, CategoryResponse
from app.schemas.order import OrderUpdate, OrderResponse, OrderListResponse
from app.services.product_service import ProductService
from app.services.order_service import OrderService
from app.auth.dependencies import get_current_admin_user
from app.models.user import User

router = APIRouter(prefix="/admin", tags=["admin"])

# Category Management
@router.post("/categories", response_model=CategoryResponse, status_code=status.HTTP_201_CREATED)
async def create_category(
    category_data: CategoryCreate,
    current_user: User = Depends(get_current_admin_user),
    db: AsyncSession = Depends(get_db)
):
    """Create new category (admin only)"""
    product_service = ProductService(db)
    category = await product_service.create_category(category_data)
    return category

# Product Management
@router.post("/products", response_model=ProductResponse, status_code=status.HTTP_201_CREATED)
async def create_product(
    product_data: ProductCreate,
    current_user: User = Depends(get_current_admin_user),
    db: AsyncSession = Depends(get_db)
):
    """Create new product (admin only)"""
    product_service = ProductService(db)
    product = await product_service.create_product(product_data)
    return product

@router.put("/products/{product_id}", response_model=ProductResponse)
async def update_product(
    product_id: int,
    product_data: ProductUpdate,
    current_user: User = Depends(get_current_admin_user),
    db: AsyncSession = Depends(get_db)
):
    """Update product (admin only)"""
    product_service = ProductService(db)
    product = await product_service.update_product(product_id, product_data)
    
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found"
        )
    
    return product

@router.delete("/products/{product_id}")
async def delete_product(
    product_id: int,
    current_user: User = Depends(get_current_admin_user),
    db: AsyncSession = Depends(get_db)
):
    """Delete product (admin only)"""
    product_service = ProductService(db)
    success = await product_service.delete_product(product_id)
    
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found"
        )
    
    return {"message": "Product deleted successfully"}

# Order Management
@router.get("/orders", response_model=OrderListResponse)
async def get_all_orders(
    page: int = Query(default=1, ge=1),
    per_page: int = Query(default=20, ge=1, le=100),
    status: Optional[str] = Query(default=None),
    current_user: User = Depends(get_current_admin_user),
    db: AsyncSession = Depends(get_db)
):
    """Get all orders (admin only)"""
    order_service = OrderService(db)
    
    skip = (page - 1) * per_page
    orders, total = await order_service.get_all_orders(
        skip=skip, limit=per_page, status=status
    )
    
    pages = math.ceil(total / per_page)
    
    return {
        "orders": orders,
        "total": total,
        "page": page,
        "per_page": per_page,
        "pages": pages
    }

@router.put("/orders/{order_id}", response_model=OrderResponse)
async def update_order(
    order_id: int,
    order_data: OrderUpdate,
    current_user: User = Depends(get_current_admin_user),
    db: AsyncSession = Depends(get_db)
):
    """Update order (admin only)"""
    order_service = OrderService(db)
    order = await order_service.update_order(order_id, order_data)
    
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found"
        )
    
    return order

@router.get("/orders/{order_id}", response_model=OrderResponse)
async def get_order_admin(
    order_id: int,
    current_user: User = Depends(get_current_admin_user),
    db: AsyncSession = Depends(get_db)
):
    """Get order by ID (admin only)"""
    order_service = OrderService(db)
    order = await order_service.get_order_by_id(order_id)
    
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found"
        )
    
    return order