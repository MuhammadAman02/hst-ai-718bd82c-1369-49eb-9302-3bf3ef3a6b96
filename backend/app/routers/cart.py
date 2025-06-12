from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.schemas.order import CartResponse, CartItemCreate, CartItemUpdate, CartItemResponse
from app.services.cart_service import CartService
from app.auth.dependencies import get_current_active_user
from app.models.user import User

router = APIRouter(prefix="/cart", tags=["cart"])

@router.get("/", response_model=CartResponse)
async def get_cart(
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """Get user's cart"""
    cart_service = CartService(db)
    cart = await cart_service.get_cart(current_user.id)
    return cart

@router.post("/items", response_model=CartItemResponse, status_code=status.HTTP_201_CREATED)
async def add_item_to_cart(
    item_data: CartItemCreate,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """Add item to cart"""
    cart_service = CartService(db)
    cart_item = await cart_service.add_item_to_cart(current_user.id, item_data)
    return cart_item

@router.put("/items/{item_id}", response_model=CartItemResponse)
async def update_cart_item(
    item_id: int,
    item_data: CartItemUpdate,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """Update cart item quantity"""
    cart_service = CartService(db)
    cart_item = await cart_service.update_cart_item(current_user.id, item_id, item_data)
    
    if not cart_item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cart item not found"
        )
    
    return cart_item

@router.delete("/items/{item_id}")
async def remove_cart_item(
    item_id: int,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """Remove item from cart"""
    cart_service = CartService(db)
    success = await cart_service.remove_cart_item(current_user.id, item_id)
    
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cart item not found"
        )
    
    return {"message": "Item removed from cart"}

@router.delete("/")
async def clear_cart(
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """Clear all items from cart"""
    cart_service = CartService(db)
    await cart_service.clear_cart(current_user.id)
    return {"message": "Cart cleared"}