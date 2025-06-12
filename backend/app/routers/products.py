from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.schemas.product import ProductResponse, ProductListResponse, CategoryResponse
from app.services.product_service import ProductService
import math

router = APIRouter(prefix="/products", tags=["products"])

@router.get("/categories", response_model=list[CategoryResponse])
async def get_categories(db: AsyncSession = Depends(get_db)):
    """Get all categories"""
    product_service = ProductService(db)
    categories = await product_service.get_categories()
    return categories

@router.get("/featured", response_model=list[ProductResponse])
async def get_featured_products(
    limit: int = Query(default=8, ge=1, le=20),
    db: AsyncSession = Depends(get_db)
):
    """Get featured products"""
    product_service = ProductService(db)
    products = await product_service.get_featured_products(limit=limit)
    return products

@router.get("/", response_model=ProductListResponse)
async def get_products(
    page: int = Query(default=1, ge=1),
    per_page: int = Query(default=20, ge=1, le=100),
    category_id: Optional[int] = Query(default=None),
    search: Optional[str] = Query(default=None),
    is_featured: Optional[bool] = Query(default=None),
    min_price: Optional[float] = Query(default=None, ge=0),
    max_price: Optional[float] = Query(default=None, ge=0),
    db: AsyncSession = Depends(get_db)
):
    """Get products with filtering and pagination"""
    product_service = ProductService(db)
    
    skip = (page - 1) * per_page
    products, total = await product_service.get_products(
        skip=skip,
        limit=per_page,
        category_id=category_id,
        search=search,
        is_featured=is_featured,
        min_price=min_price,
        max_price=max_price
    )
    
    pages = math.ceil(total / per_page)
    
    return {
        "products": products,
        "total": total,
        "page": page,
        "per_page": per_page,
        "pages": pages
    }

@router.get("/{product_id}", response_model=ProductResponse)
async def get_product(
    product_id: int,
    db: AsyncSession = Depends(get_db)
):
    """Get product by ID"""
    product_service = ProductService(db)
    product = await product_service.get_product_by_id(product_id)
    
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found"
        )
    
    return product