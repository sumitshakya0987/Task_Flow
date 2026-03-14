import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import TeamView from './pages/TeamView';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route element={<Layout />}>
             <Route path="/" element={<Dashboard />} />
             <Route path="/teams/:teamId" element={<TeamView />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
