from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.models.scan import Scan
from app.core.database import get_async_session 

router = APIRouter()

@router.get("/history")
async def get_scan_history(db: AsyncSession = Depends(get_async_session)):
    result = await db.execute(select(Scan).order_by(Scan.scanned_at.desc()))
    scans = result.scalars().all()

    return [
        {
            "ip": scan.ip,
            "port": scan.port,
            "service": scan.service,
            "state": scan.state,
            "product": scan.product,
            "scanned_at": scan.scanned_at.strftime("%Y-%m-%d %H:%M:%S"),
        }
        for scan in scans
    ]
