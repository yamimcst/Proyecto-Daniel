import { useState } from "react";
import {
  FaUserPlus,
  FaUsers,
  FaSignOutAlt,
  FaSearch,
  FaTrash,
} from "react-icons/fa";
import "./Dashboard.css";
import { useNavigate } from "react-router-dom";

const clientesIniciales = [
  { id: 1, nombre: "Cliente 1", cuentas: 2, email: "cliente1@correo.com" },
  { id: 2, nombre: "Cliente 2", cuentas: 1, email: "cliente2@correo.com" },
  { id: 3, nombre: "Cliente 3", cuentas: 3, email: "cliente3@correo.com" },
];

export default function Dashboard() {
  const [clientes, setClientes] = useState(clientesIniciales);
  const [form, setForm] = useState({ nombre: "", cuentas: "", email: "" });
  const [busqueda, setBusqueda] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    setClientes([
      ...clientes,
      { id: Date.now(), ...form, cuentas: Number(form.cuentas) },
    ]);
    setForm({ nombre: "", cuentas: "", email: "" });
  };

  const eliminar = (id) => setClientes(clientes.filter((c) => c.id !== id));

  const filtrados = clientes.filter((c) =>
    c.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="dashboard">
      {/* Menú lateral */}
      <aside className="sidebar">
        <div className="sidebar-logo">New Software</div>
        <nav>
          <a href="#registro">
            <FaUserPlus /> Registro de nuevo cliente
          </a>
          <a href="#clientes">
            <FaUsers /> Mis clientes
          </a>
        </nav>
        <button className="logout" onClick={() => navigate("/")}>
          <FaSignOutAlt /> Cerrar sesión
        </button>
      </aside>

      {/* Contenido */}
      <main className="content">
        <header className="topbar">
          <h1>Panel de clientes</h1>
          <span>Hola, bienvenido 👋</span>
        </header>

        {/* Registro */}
        <section className="card" id="registro">
          <h2>Registrar cliente</h2>
          <form onSubmit={handleSubmit} className="form-grid">
            <label>
              Nombre
              <input
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
                placeholder="Nombre completo"
                required
              />
            </label>
            <label>
              No. de cuentas
              <input
                name="cuentas"
                type="number"
                min="0"
                value={form.cuentas}
                onChange={handleChange}
                placeholder="0"
                required
              />
            </label>
            <label>
              Email
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="correo@ejemplo.com"
                required
              />
            </label>
            <button type="submit" className="btn-primary">
              Registrar cliente
            </button>
          </form>
        </section>

        {/* Lista */}
        <section className="card" id="clientes">
          <div className="card-header">
            <h2>Mis clientes ({filtrados.length})</h2>
            <div className="search">
              <FaSearch />
              <input
                placeholder="Buscar cliente..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
            </div>
          </div>

          {filtrados.length === 0 ? (
            <p className="empty">No se encontraron clientes.</p>
          ) : (
            <ul className="client-list">
              {filtrados.map((c) => (
                <li key={c.id}>
                  <div className="avatar">{c.nombre.charAt(0).toUpperCase()}</div>
                  <div className="client-info">
                    <strong>{c.nombre}</strong>
                    <span>{c.email}</span>
                  </div>
                  <span className="badge">
                    {c.cuentas} {c.cuentas === 1 ? "cuenta" : "cuentas"}
                  </span>
                  <button
                    className="btn-delete"
                    onClick={() => eliminar(c.id)}
                    title="Eliminar"
                  >
                    <FaTrash />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}
