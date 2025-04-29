from fastapi import APIRouter, HTTPException
from app.services.nmap_service import discover_hosts
import nmap

router = APIRouter()

@router.get("/discover")
def discover():
    return discover_hosts()


@router.get("/scan/{ip}")
def scan_ip(ip: str):
    scanner = nmap.PortScanner()
    try:
        scanner.scan(hosts=ip, arguments="-sV")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error ejecutando nmap: {str(e)}")

    if ip not in scanner.all_hosts():
        raise HTTPException(status_code=404, detail="El dispositivo no respondió o bloqueó el escaneo.")

    ports = []

    try:
        protocols = scanner[ip].all_protocols()
        if protocols:
            for proto in protocols:
                lport = scanner[ip][proto].keys()
                for port in lport:
                    ports.append({
                        "port": port,
                        "service": scanner[ip][proto][port]['name'],
                        "state": scanner[ip][proto][port]['state'],
                        "product": scanner[ip][proto][port].get('product', '')
                    })
    except Exception:
        ports = []

    return {
        "ports": ports
    }
