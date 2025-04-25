import nmap
import socket
import fcntl
import struct
import netifaces as ni

def get_all_local_subnets():
    subnets = []
    for iface in ni.interfaces():
        try:
            addr = ni.ifaddresses(iface)[ni.AF_INET][0]['addr']
            subnet = addr.rsplit('.', 1)[0] + ".0/24"
            subnets.append(subnet)
        except (KeyError, IndexError):
            continue
    return subnets

def discover_hosts():
    scanner = nmap.PortScanner()
    all_hosts = []

    for net in get_all_local_subnets():
        scanner.scan(hosts=net, arguments="-sn")
        for host in scanner.all_hosts():
            all_hosts.append({
                "ip": host,
                "hostname": scanner[host].hostname(),
                "state": scanner[host].state()
            })

    return all_hosts

