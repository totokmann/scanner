import { useEffect, useState } from "react";
import axios from "axios";

export default function HistoryPage() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axios.get("http://localhost:8000/history");
        setHistory(res.data);
      } catch (err) {
        console.error("Error al obtener historial:", err);
        alert("No se pudo cargar el historial.");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  return (
    <div>
      <h2>Historial de escaneos</h2>
      {loading ? (
        <p>Cargando historial...</p>
      ) : history.length === 0 ? (
        <p>No hay escaneos guardados aún.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>IP</th>
              <th>Puerto</th>
              <th>Servicio</th>
              <th>Estado</th>
              <th>Producto</th>
              <th>Fecha de escaneo</th>
            </tr>
          </thead>
          <tbody>
            {history.map((scan, index) => (
              <tr key={index}>
                <td>{scan.ip}</td>
                <td>{scan.port}</td>
                <td>{scan.service}</td>
                <td>{scan.state}</td>
                <td>{scan.product || "-"}</td>
                <td>{scan.scanned_at}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
