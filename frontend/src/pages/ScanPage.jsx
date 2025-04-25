import { useEffect, useState } from "react";
import axios from "axios";

export default function ScanPage() {
  const [hosts, setHosts] = useState([]);
  const [loading, setLoading] = useState(true);

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
        <table>
          <thead>
            <tr>
              <th>IP</th>
              <th>Hostname</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {hosts.map((host, index) => (
              <tr key={index}>
                <td>{host.ip}</td>
                <td>{host.hostname || "-"}</td>
                <td>{host.state}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
