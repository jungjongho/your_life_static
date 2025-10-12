"""
FastAPI Application Entry Point
내 인생 통계 (My Life Stats) Backend
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.core.database import engine, Base

# Import models to ensure they are registered with SQLAlchemy
from app.models import view_count  # noqa: F401

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="My Life Stats API",
    description="생년월일 기반 인생 통계 계산 API",
    version="1.0.0"
)

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root() -> dict[str, str]:
    """Health check endpoint"""
    return {
        "message": "My Life Stats API is running",
        "version": "1.0.0",
        "status": "healthy"
    }


@app.get("/health")
async def health_check() -> dict[str, str]:
    """Health check for container orchestration"""
    return {"status": "healthy"}


# Router 등록
from app.routers import stats, view_count
app.include_router(stats.router, prefix="/api/v1/stats", tags=["stats"])
app.include_router(view_count.router, prefix="/api/v1/views", tags=["views"])
