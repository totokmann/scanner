import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    navigate("/");
  };

  useEffect(() => {
    // Acá en el futuro podríamos cargar IPs activas desde el backend
  }, []);

  return (
    <div>
      <h2>Dashboard</h2>
      <p>Bienvenido al panel principal.</p>
      <button onClick={handleLogout}>Cerrar sesión</button>

      <hr />

      <h3>Dispositivos conectados:</h3>
      <p>(Acá vamos a mostrar las IPs activas)</p>

      <h3>Historial de escaneos:</h3>
      <p>(Y acá los escaneos pasados)</p>
    </div>
  );
}
