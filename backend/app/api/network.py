from fastapi import APIRouter, HTTPException, Depends, Path
from app.services.nmap_service import discover_hosts
import nmap
from app.core.database import SessionLocal
from app.models.scan import Scan
from sqlalchemy.ext.asyncio import AsyncSession

router = APIRouter()

@router.get("/discover")
def discover():
    return discover_hosts()


@router.get("/scan/{ip:path}")
async def scan_ip(ip: str, db: AsyncSession = Depends(get_async_session)):
    scanner = nmap.PortScanner()
    try:
        scanner.scan(hosts=ip, arguments="-sV")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error ejecutando nmap: {str(e)}")

    if ip not in scanner.all_hosts():
        raise HTTPException(status_code=404, detail="El dispositivo no respondió.")

    ports = []
    try:
        protocols = scanner[ip].all_protocols()
        if protocols:
            for proto in protocols:
                lport = scanner[ip][proto].keys()
                for port in lport:
                    port_info = {
                        "port": port,
                        "service": scanner[ip][proto][port]['name'],
                        "state": scanner[ip][proto][port]['state'],
                        "product": scanner[ip][proto][port].get('product', '')
                    }
                    ports.append(port_info)
                    
                    new_scan = Scan(
                        ip=ip,
                        port=port_info["port"],
                        service=port_info["service"],
                        state=port_info["state"],
                        product=port_info["product"],
                    )
                    db.add(new_scan)
        await db.commit()
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=500, detail=f"Error guardando escaneo: {str(e)}")

    return {
        "ports": ports
    }
