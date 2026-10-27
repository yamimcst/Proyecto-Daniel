import { useState } from 'react'
import imagen from './assets/imagenTest.png'
import { FaEye, FaEyeSlash } from "react-icons/fa";
import './Login.css'
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    //console.log({ email, password });
    navigate("/dashboard");
    // backend
  };

  return (
    <div className="login-container">
      <div className="login-left">
        {/* <div className="logo">Software Borcelle</div> */}
        <img src={imagen} alt="Ilustración" />
      </div>

      <div className="login-right">
        <form onSubmit={handleSubmit}>
          <h1>¡Bienvenido de nuevo!</h1>

          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <div className="password-field">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          <button type="submit" className="btn-login">
            Iniciar sesión
          </button>

          <a href="#">Recordar contraseña</a>
          <a href="#">¿Todavía no tienes una cuenta? Regístrate</a>
        </form>
      </div>
    </div>
  );
}
