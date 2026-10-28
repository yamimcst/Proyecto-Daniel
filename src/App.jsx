import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from './Login';
import Dashboard from './Dashboard';
import ClienteDetalle from './ClienteDetalle';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/cliente/:id" element={<ClienteDetalle />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
