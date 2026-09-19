from fastapi import FastAPI, status
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
from app.database import db
from app.routes.investigation import router as investigation_router
from app.routes.assistant import router as assistant_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    db.connect()
    yield
    # Shutdown
    db.close()

app = FastAPI(title="TraceVeritas API", lifespan=lifespan)

app.include_router(investigation_router)
app.include_router(assistant_router)

@app.get("/health")
def health_check():
    if db.driver:
        try:
            db.driver.verify_connectivity()
            return {"status": "healthy", "database": "connected"}
        except Exception as e:
            return JSONResponse(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                content={"status": "unhealthy", "database": "disconnected", "detail": "Connection verification failed"}
            )
    else:
        return JSONResponse(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            content={"status": "unhealthy", "database": "disconnected", "detail": "Driver not initialized"}
        )
