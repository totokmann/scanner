import { useNavigate } from "react-router-dom";
import "./LandingPage.css";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      <div className="overlay">
        <h1>Bienvenido a ScannerWeb</h1>
        <p>Detectá dispositivos conectados en tu red local, escaneá puertos y analizá vulnerabilidades con precisión técnica.</p>
        <div className="landing-buttons">
          <button onClick={() => navigate("/login")}>Iniciar Sesión</button>
          <button onClick={() => navigate("/register")}>Registrarse</button>
        </div>
      </div>
    </div>
  );
}