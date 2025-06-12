from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from decimal import Decimal
from app.models.order import OrderStatus, PaymentStatus

class CartItemBase(BaseModel):
    product_id: int
    quantity: int = Field(..., gt=0)
    size: str = Field(..., min_length=1, max_length=10)
    color: str = Field(..., min_length=1, max_length=50)

class CartItemCreate(CartItemBase):
    pass

class CartItemUpdate(BaseModel):
    quantity: int = Field(..., gt=0)

class CartItemResponse(CartItemBase):
    id: int
    cart_id: int
    unit_price: Decimal
    total_price: Decimal
    added_at: datetime
    
    class Config:
        from_attributes = True

class CartResponse(BaseModel):
    id: int
    user_id: int
    items: List[CartItemResponse] = Field(default_factory=list)
    total_items: int
    total_amount: Decimal
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

class OrderItemResponse(BaseModel):
    id: int
    product_id: int
    quantity: int
    size: str
    color: str
    unit_price: Decimal
    total_price: Decimal
    
    class Config:
        from_attributes = True

class OrderBase(BaseModel):
    shipping_first_name: str = Field(..., min_length=1, max_length=100)
    shipping_last_name: str = Field(..., min_length=1, max_length=100)
    shipping_address: str = Field(..., min_length=1)
    shipping_city: str = Field(..., min_length=1, max_length=100)
    shipping_state: str = Field(..., min_length=1, max_length=100)
    shipping_zip_code: str = Field(..., min_length=1, max_length=20)
    shipping_country: str = Field(..., min_length=1, max_length=100)
    shipping_phone: Optional[str] = Field(None, max_length=20)
    payment_method: Optional[str] = Field(None, max_length=50)
    notes: Optional[str] = None

class OrderCreate(OrderBase):
    pass

class OrderUpdate(BaseModel):
    status: Optional[OrderStatus] = None
    payment_status: Optional[PaymentStatus] = None
    tracking_number: Optional[str] = Field(None, max_length=100)
    notes: Optional[str] = None

class OrderResponse(OrderBase):
    id: int
    user_id: int
    order_number: str
    status: OrderStatus
    payment_status: PaymentStatus
    subtotal: Decimal
    tax_amount: Decimal
    shipping_amount: Decimal
    discount_amount: Decimal
    total_amount: Decimal
    payment_transaction_id: Optional[str] = None
    tracking_number: Optional[str] = None
    items: List[OrderItemResponse] = Field(default_factory=list)
    created_at: datetime
    updated_at: Optional[datetime] = None
    shipped_at: Optional[datetime] = None
    delivered_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

class OrderListResponse(BaseModel):
    orders: List[OrderResponse]
    total: int
    page: int
    per_page: int
    pages: int