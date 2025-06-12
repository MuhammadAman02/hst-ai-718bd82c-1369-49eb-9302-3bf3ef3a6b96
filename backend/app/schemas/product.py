from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from decimal import Decimal

class CategoryBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    description: Optional[str] = None
    slug: str = Field(..., min_length=1, max_length=100)

class CategoryCreate(CategoryBase):
    pass

class CategoryResponse(CategoryBase):
    id: int
    is_active: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

class ProductImageBase(BaseModel):
    image_url: str = Field(..., max_length=500)
    alt_text: Optional[str] = Field(None, max_length=255)
    is_main: bool = False
    sort_order: int = 0

class ProductImageCreate(ProductImageBase):
    pass

class ProductImageResponse(ProductImageBase):
    id: int
    product_id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

class ProductBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    description: str = Field(..., min_length=1)
    price: Decimal = Field(..., gt=0, decimal_places=2)
    original_price: Optional[Decimal] = Field(None, gt=0, decimal_places=2)
    sku: str = Field(..., min_length=1, max_length=100)
    category_id: int
    brand: str = Field(default="Nike", max_length=100)
    is_featured: bool = False
    stock_quantity: int = Field(default=0, ge=0)
    weight: Optional[Decimal] = Field(None, gt=0, decimal_places=2)
    sizes: List[str] = Field(default_factory=list)
    colors: List[str] = Field(default_factory=list)

class ProductCreate(ProductBase):
    images: List[ProductImageCreate] = Field(default_factory=list)

class ProductUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = Field(None, min_length=1)
    price: Optional[Decimal] = Field(None, gt=0, decimal_places=2)
    original_price: Optional[Decimal] = Field(None, gt=0, decimal_places=2)
    category_id: Optional[int] = None
    brand: Optional[str] = Field(None, max_length=100)
    is_featured: Optional[bool] = None
    stock_quantity: Optional[int] = Field(None, ge=0)
    weight: Optional[Decimal] = Field(None, gt=0, decimal_places=2)
    sizes: Optional[List[str]] = None
    colors: Optional[List[str]] = None

class ProductResponse(ProductBase):
    id: int
    is_active: bool
    created_at: datetime
    updated_at: Optional[datetime] = None
    category: CategoryResponse
    images: List[ProductImageResponse] = Field(default_factory=list)
    main_image: Optional[str] = None
    is_on_sale: bool
    discount_percentage: int
    
    class Config:
        from_attributes = True

class ProductListResponse(BaseModel):
    products: List[ProductResponse]
    total: int
    page: int
    per_page: int
    pages: int