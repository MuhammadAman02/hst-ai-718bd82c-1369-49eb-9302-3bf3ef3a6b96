from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import DeclarativeBase
from app.config import settings
import redis.asyncio as redis

# SQLAlchemy setup
class Base(DeclarativeBase):
    pass

# Create async engine
engine = create_async_engine(
    settings.database_url,
    echo=settings.debug,
    future=True
)

# Create async session factory
AsyncSessionLocal = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False
)

# Redis setup
redis_client = redis.from_url(settings.redis_url, decode_responses=True)

# Dependency to get database session
async def get_db():
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()

# Dependency to get redis client
async def get_redis():
    return redis_client

# Database initialization
async def init_db():
    """Initialize database tables"""
    async with engine.begin() as conn:
        # Import all models to ensure they are registered
        from app.models import user, product, order
        await conn.run_sync(Base.metadata.create_all)

async def close_db():
    """Close database connections"""
    await engine.dispose()
    await redis_client.close()