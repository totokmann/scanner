import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Dashboard() {
  const navigate = useNavigate();
  const [hosts, setHosts] = useState([]);
  const [loading, setLoading] = useState(true);


  const handleLogout = () => {
    localStorage.removeItem("access_token");
    navigate("/");
  };

  useEffect(() => {
    const fetchHosts = async () => {
      try {
        const res = await axios.get("http://localhost:8000/discover");
        setHosts(res.data);
      } catch (err) {
        console.error("Error al obtener hosts:", err);
        alert("No se pudo escanear la red.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchHosts();
  }, []);

  return (
    <div>
      <h2>Dashboard</h2>
      <button onClick={handleLogout}>Cerrar sesión</button>
      <hr />

      <h3>Dispositivos conectados:</h3>
      {loading ? (
        <p>Escaneando red...</p>
      ) : hosts.length === 0 ? (
        <p>No se encontraron dispositivos.</p>
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
