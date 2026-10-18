import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Portfolio from './pages/Portfolio';
import Login from './pages/Login';
import AdminDashboard from './admin/AdminDashboard';
import PrivateRoute from './components/PrivateRoute';

export default function App() {
  return (
    <BrowserRouter>
      <ToastContainer theme="dark" position="top-right" />
      <Routes>
        <Route path="/" element={<Portfolio />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin/*" element={<PrivateRoute><AdminDashboard /></PrivateRoute>} />
      </Routes>
    </BrowserRouter>
  );
}
