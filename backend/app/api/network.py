from fastapi import APIRouter
from app.services.nmap_service import discover_hosts

router = APIRouter()

@router.get("/discover")
def discover():
    return discover_hosts()
