import { Link, useNavigate } from 'react-router-dom';

function Header({ isAuthenticated, user, onLogout }) {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };
  
  return (
    <header className="header">
      <div className="logo">
        <Link to="/">Todo App</Link>
      </div>
      <nav className="nav">
        {isAuthenticated ? (
          <div className="user-nav">
            <span className="welcome">Welcome, {user?.name || 'User'}</span>
            <button className="logout-btn" onClick={handleLogout}>Logout</button>
          </div>
        ) : (
          <div className="auth-nav">
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/signup" className="nav-link">Sign Up</Link>
          </div>
        )}
      </nav>
    </header>
  );
}

export default Header;