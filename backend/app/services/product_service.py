from typing import List, Optional, Tuple
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, and_, or_
from sqlalchemy.orm import selectinload
from fastapi import HTTPException, status

from app.models.product import Product, Category, ProductImage
from app.schemas.product import ProductCreate, ProductUpdate, CategoryCreate

class ProductService:
    def __init__(self, db: AsyncSession):
        self.db = db
    
    async def create_category(self, category_data: CategoryCreate) -> Category:
        """Create a new category"""
        # Check if category already exists
        existing = await self.get_category_by_slug(category_data.slug)
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Category with this slug already exists"
            )
        
        db_category = Category(**category_data.model_dump())
        self.db.add(db_category)
        await self.db.commit()
        await self.db.refresh(db_category)
        return db_category
    
    async def get_categories(self) -> List[Category]:
        """Get all active categories"""
        result = await self.db.execute(
            select(Category).where(Category.is_active == True).order_by(Category.name)
        )
        return result.scalars().all()
    
    async def get_category_by_id(self, category_id: int) -> Optional[Category]:
        """Get category by ID"""
        result = await self.db.execute(
            select(Category).where(Category.id == category_id)
        )
        return result.scalar_one_or_none()
    
    async def get_category_by_slug(self, slug: str) -> Optional[Category]:
        """Get category by slug"""
        result = await self.db.execute(
            select(Category).where(Category.slug == slug)
        )
        return result.scalar_one_or_none()
    
    async def create_product(self, product_data: ProductCreate) -> Product:
        """Create a new product"""
        # Check if SKU already exists
        existing = await self.get_product_by_sku(product_data.sku)
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Product with this SKU already exists"
            )
        
        # Verify category exists
        category = await self.get_category_by_id(product_data.category_id)
        if not category:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Category not found"
            )
        
        # Create product
        product_dict = product_data.model_dump(exclude={'images', 'sizes', 'colors'})
        db_product = Product(**product_dict)
        
        self.db.add(db_product)
        await self.db.flush()  # Get the product ID
        
        # Add images
        for img_data in product_data.images:
            db_image = ProductImage(
                product_id=db_product.id,
                **img_data.model_dump()
            )
            self.db.add(db_image)
        
        await self.db.commit()
        await self.db.refresh(db_product)
        return db_product
    
    async def get_products(
        self, 
        skip: int = 0, 
        limit: int = 20,
        category_id: Optional[int] = None,
        search: Optional[str] = None,
        is_featured: Optional[bool] = None,
        min_price: Optional[float] = None,
        max_price: Optional[float] = None
    ) -> Tuple[List[Product], int]:
        """Get products with filtering and pagination"""
        query = select(Product).options(
            selectinload(Product.category),
            selectinload(Product.images)
        ).where(Product.is_active == True)
        
        # Apply filters
        if category_id:
            query = query.where(Product.category_id == category_id)
        
        if search:
            search_term = f"%{search}%"
            query = query.where(
                or_(
                    Product.name.ilike(search_term),
                    Product.description.ilike(search_term),
                    Product.brand.ilike(search_term)
                )
            )
        
        if is_featured is not None:
            query = query.where(Product.is_featured == is_featured)
        
        if min_price is not None:
            query = query.where(Product.price >= min_price)
        
        if max_price is not None:
            query = query.where(Product.price <= max_price)
        
        # Get total count
        count_query = select(func.count()).select_from(query.subquery())
        total_result = await self.db.execute(count_query)
        total = total_result.scalar()
        
        # Apply pagination and ordering
        query = query.order_by(Product.created_at.desc()).offset(skip).limit(limit)
        
        result = await self.db.execute(query)
        products = result.scalars().all()
        
        return products, total
    
    async def get_product_by_id(self, product_id: int) -> Optional[Product]:
        """Get product by ID with related data"""
        result = await self.db.execute(
            select(Product).options(
                selectinload(Product.category),
                selectinload(Product.images)
            ).where(Product.id == product_id)
        )
        return result.scalar_one_or_none()
    
    async def get_product_by_sku(self, sku: str) -> Optional[Product]:
        """Get product by SKU"""
        result = await self.db.execute(
            select(Product).where(Product.sku == sku)
        )
        return result.scalar_one_or_none()
    
    async def update_product(self, product_id: int, product_data: ProductUpdate) -> Optional[Product]:
        """Update product"""
        product = await self.get_product_by_id(product_id)
        if not product:
            return None
        
        # Update fields
        update_data = product_data.model_dump(exclude_unset=True, exclude={'sizes', 'colors'})
        for field, value in update_data.items():
            setattr(product, field, value)
        
        await self.db.commit()
        await self.db.refresh(product)
        return product
    
    async def delete_product(self, product_id: int) -> bool:
        """Delete product (soft delete)"""
        product = await self.get_product_by_id(product_id)
        if not product:
            return False
        
        product.is_active = False
        await self.db.commit()
        return True
    
    async def get_featured_products(self, limit: int = 8) -> List[Product]:
        """Get featured products"""
        result = await self.db.execute(
            select(Product).options(
                selectinload(Product.category),
                selectinload(Product.images)
            ).where(
                and_(Product.is_active == True, Product.is_featured == True)
            ).order_by(Product.created_at.desc()).limit(limit)
        )
        return result.scalars().all()