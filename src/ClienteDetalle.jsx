import { useState } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { FaArrowLeft, FaDownload } from "react-icons/fa";
import "./ClienteDetalle.css";

// Datos de ejemplo
const movimientosDe = (n) => [
  { fecha: "2026-10-01", concepto: "Depósito inicial", monto: 5000 * n },
  { fecha: "2026-10-05", concepto: "Pago de servicios", monto: -850 },
  { fecha: "2026-10-10", concepto: "Transferencia recibida", monto: 2300 },
  { fecha: "2026-10-14", concepto: "Compra", monto: -1200 },
  { fecha: "2026-10-20", concepto: "Depósito", monto: 1500 },
];

const dinero = (n) =>
  n.toLocaleString("es-MX", { style: "currency", currency: "MXN" });

export default function ClienteDetalle() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { state } = useLocation();
  const cliente = state?.cliente ?? {
    id,
    nombre: `Cliente ${id}`,
    cuentas: 3,
  };

  const hoy = new Date().toISOString().slice(0, 10);
  const [fecha, setFecha] = useState(hoy);
  const [cuenta, setCuenta] = useState(1);
  const [reporte, setReporte] = useState("saldo");

  const cuentas = Array.from({ length: cliente.cuentas }, (_, i) => i + 1);

  const filtrar = (n) => movimientosDe(n).filter((m) => m.fecha <= fecha);
  const saldoDe = (n) => filtrar(n).reduce((s, m) => s + m.monto, 0);

  // Datos del reporte actual
  const movs = filtrar(cuenta);
  const ingresos = movs.filter((m) => m.monto > 0).reduce((s, m) => s + m.monto, 0);
  const egresos = movs.filter((m) => m.monto < 0).reduce((s, m) => s + m.monto, 0);

  const descargar = () => {
    let filas;
    if (reporte === "saldo") {
      filas = [
        ["Fecha", "Concepto", "Monto"],
        ...movs.map((m) => [m.fecha, m.concepto, m.monto]),
      ];
    } else {
      filas = [
        ["Cuenta", "Saldo"],
        ...cuentas.map((n) => [`Cuenta ${n}`, saldoDe(n)]),
      ];
    }
    const csv = filas.map((f) => f.join(",")).join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${cliente.nombre}-${reporte}-${fecha}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="detalle">
      {/* Encabezado */}
      <header className="detalle-top">
        <div className="detalle-title">
          <button className="btn-back" onClick={() => navigate("/dashboard")}>
            <FaArrowLeft /> Volver
          </button>
          <h1>{cliente.nombre}</h1>
        </div>
        <label className="fecha">
          Fecha
          <input
            type="date"
            value={fecha}
            max={hoy}
            onChange={(e) => setFecha(e.target.value)}
          />
        </label>
      </header>

      {/* Pestañas */}
      <div className="tabs-row">
        <div className="tabs">
          {cuentas.map((n) => (
            <button
              key={n}
              className={cuenta === n && reporte === "saldo" ? "tab active" : "tab"}
              onClick={() => {
                setCuenta(n);
                setReporte("saldo");
              }}
            >
              Cuenta {n}
            </button>
          ))}
        </div>
        <div className="tabs">
          <button
            className={reporte === "saldo" ? "tab alt active" : "tab alt"}
            onClick={() => setReporte("saldo")}
          >
            Reporte de saldo
          </button>
          <button
            className={reporte === "general" ? "tab alt active" : "tab alt"}
            onClick={() => setReporte("general")}
          >
            Reporte general de cuentas
          </button>
        </div>
      </div>

      {/* Reporte */}
      <section className="reporte">
        {reporte === "saldo" ? (
          <>
            <h2>Reporte de saldo — Cuenta {cuenta}</h2>
            <div className="resumen">
              <div className="stat">
                <span>Saldo</span>
                <strong>{dinero(saldoDe(cuenta))}</strong>
              </div>
              <div className="stat">
                <span>Ingresos</span>
                <strong className="pos">{dinero(ingresos)}</strong>
              </div>
              <div className="stat">
                <span>Egresos</span>
                <strong className="neg">{dinero(egresos)}</strong>
              </div>
            </div>

            <table>
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Concepto</th>
                  <th className="right">Monto</th>
                </tr>
              </thead>
              <tbody>
                {movs.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="empty">
                      Sin movimientos a esta fecha.
                    </td>
                  </tr>
                ) : (
                  movs.map((m, i) => (
                    <tr key={i}>
                      <td>{m.fecha}</td>
                      <td>{m.concepto}</td>
                      <td className={m.monto > 0 ? "right pos" : "right neg"}>
                        {dinero(m.monto)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </>
        ) : (
          <>
            <h2>Reporte general de cuentas</h2>
            <table>
              <thead>
                <tr>
                  <th>Cuenta</th>
                  <th className="right">Saldo al {fecha}</th>
                </tr>
              </thead>
              <tbody>
                {cuentas.map((n) => (
                  <tr key={n}>
                    <td>Cuenta {n}</td>
                    <td className="right">{dinero(saldoDe(n))}</td>
                  </tr>
                ))}
                <tr className="total">
                  <td>Total</td>
                  <td className="right">
                    {dinero(cuentas.reduce((s, n) => s + saldoDe(n), 0))}
                  </td>
                </tr>
              </tbody>
            </table>
          </>
        )}
      </section>

      <button className="btn-descargar" onClick={descargar}>
        <FaDownload /> Descargar
      </button>
    </div>
  );
}