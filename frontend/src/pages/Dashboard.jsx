import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    navigate("/");
  };

  const goToScan = () => {
    navigate("/scan");
  };

  const goToHistory = () => {
    navigate("/history");
  };

  return (
    <div>
      <h2>Red Scanner Web</h2>
      <p>Seleccioná una opción:</p>

      <button onClick={goToScan}>Escanear red local</button><br /><br />
      <button onClick={goToHistory}>Ver historial de escaneos</button><br /><br />
      <button onClick={handleLogout}>Cerrar sesión</button>
    </div>
  );
}
