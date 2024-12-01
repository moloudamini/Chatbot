from fastapi import APIRouter

router = APIRouter(
    prefix="/api",
    tags=["health"],
)

@router.get("/health", summary="Health Check")
async def health_check():
    return {"status": "ok"}
