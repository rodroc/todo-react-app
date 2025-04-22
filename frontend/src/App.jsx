import { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import TaskListPage from './pages/TaskListPage'
import TaskFormPage from './pages/TaskFormPage'
import './App.css'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    // Check if user is logged in from localStorage
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      setIsAuthenticated(true);
      setUser(JSON.parse(userData));
    }
  }, []);
  
  const handleLogin = (userData, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setIsAuthenticated(true);
    setUser(userData);
  };
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <div className="app">
      <Header isAuthenticated={isAuthenticated} user={user} onLogout={handleLogout} />
      <main className="content">
        <Routes>
          <Route 
            path="/" 
            element={isAuthenticated ? <TaskListPage /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/login" 
            element={!isAuthenticated ? <LoginPage onLogin={handleLogin} /> : <Navigate to="/" />} 
          />
          <Route 
            path="/signup" 
            element={!isAuthenticated ? <SignupPage /> : <Navigate to="/" />} 
          />
          <Route 
            path="/tasks/new" 
            element={isAuthenticated ? <TaskFormPage /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/tasks/:id" 
            element={isAuthenticated ? <TaskFormPage /> : <Navigate to="/login" />} 
          />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App