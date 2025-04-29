import { useEffect, useState } from "react";
import axios from "axios";

export default function ScanPage() {
  const [hosts, setHosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scanningIp, setScanningIp] = useState(null);
  const [scanResults, setScanResults] = useState([]);
  const [selectedIp, setSelectedIp] = useState("");
  

  const handleScan = async (ip) => {
    if (!ip) {
      alert("IP inválida.");
      return;
    }
  
    setScanningIp(ip);
    try {
      const res = await axios.get(`http://localhost:8000/scan/${ip}`);
      setSelectedIp(ip);
      setScanResults(res.data.ports || []);
    } catch (err) {
      if (err.response?.status === 404) {
        alert("No se pudo escanear esta IP. El dispositivo no respondió.");
      } else if (err.response?.status === 422) {
        alert("IP inválida. No se pudo procesar.");
      } else {
        alert("Error al escanear el dispositivo.");
      }
      console.error("Error al escanear IP:", err);
    } finally {
      setScanningIp(null);
    }
  };
  

  useEffect(() => {
    const fetchHosts = async () => {
      try {
        const res = await axios.get("http://localhost:8000/discover");
        setHosts(res.data);
      } catch (err) {
        console.error("Error al escanear la red:", err);
        alert("No se pudo escanear la red.");
      } finally {
        setLoading(false);
      }
    };

    fetchHosts();
  }, []);

  return (
    <div>
      <h2>Dispositivos detectados</h2>
      {loading ? (
        <p>Escaneando red...</p>
      ) : hosts.length === 0 ? (
        <p>No se encontraron dispositivos activos.</p>
      ) : (
        <>
          <table>
            <thead>
              <tr>
                <th>IP</th>
                <th>Hostname</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {hosts
                .filter((host) => !host.ip.startsWith("127."))
                .map((host, index) => (
                  <tr key={index}>
                    <td>{host.ip}</td>
                    <td>{host.hostname || "-"}</td>
                    <td>{host.state}</td>
                    <td>
                      <button onClick={() => handleScan(host.ip)} disabled={scanningIp === host.ip}>
                        {scanningIp === host.ip ? "Escaneando..." : "Escanear"}
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          {scanResults.length > 0 ? (
            <div>
                <h3>Resultados de escaneo para {selectedIp}</h3>
                <table>
                <thead>
                    <tr>
                    <th>Puerto</th>
                    <th>Servicio</th>
                    <th>Estado</th>
                    <th>Producto</th>
                    </tr>
                </thead>
                <tbody>
                    {scanResults.map((result, index) => (
                    <tr key={index}>
                        <td>{result.port}</td>
                        <td>{result.service}</td>
                        <td>{result.state}</td>
                        <td>{result.product || "-"}</td>
                    </tr>
                    ))}
                </tbody>
                </table>
            </div>
           ) : (
            selectedIp && <p>No se detectaron puertos abiertos en {selectedIp}.</p>
            )}
        </>
      )}
    </div>
  );
}
