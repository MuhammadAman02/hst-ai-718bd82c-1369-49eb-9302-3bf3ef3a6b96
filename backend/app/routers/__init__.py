# Routers package
from .auth import router as auth_router
from .products import router as products_router
from .orders import router as orders_router
from .cart import router as cart_router
from .admin import router as admin_router

__all__ = [
    "auth_router",
    "products_router", 
    "orders_router",
    "cart_router",
    "admin_router"
]