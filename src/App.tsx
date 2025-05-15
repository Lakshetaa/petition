import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import PetitionDetailPage from './pages/PetitionDetailPage';
import CreatePetitionPage from './pages/CreatePetitionPage';
import EditPetitionPage from './pages/EditPetitionPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import NotFoundPage from './pages/NotFoundPage';

// Protected route component
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600"></div>
    </div>;
  }
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  return children;
};

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/petition/:id" element={<PetitionDetailPage />} />
      
      <Route 
        path="/create-petition" 
        element={
          <ProtectedRoute>
            <CreatePetitionPage />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/edit-petition/:id" 
        element={
          <ProtectedRoute>
            <EditPetitionPage />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/profile" 
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        } 
      />
      
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;