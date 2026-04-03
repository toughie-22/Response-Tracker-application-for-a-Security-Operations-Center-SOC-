import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Auth.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    const result = await login(email, password);
    
    if (result.success) {
      navigate('/');
    } else {
      setError(result.message || 'Failed to authenticate');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>SOC Gateway</h2>
          <p>Sign in to access incident response dashboard</p>
        </div>
        
        {error && <div className="auth-error">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Analyst Email</label>
            <input 
              type="email" 
              id="email"
              className="auth-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="analyst@soc.local"
              required 
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Passphrase</label>
            <input 
              type="password" 
              id="password"
              className="auth-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••"
              required 
            />
          </div>
          
          <button type="submit" className="auth-btn" disabled={isSubmitting}>
            {isSubmitting ? 'Authenticating...' : 'Secure Login'}
          </button>
        </form>
        
        <div className="auth-footer">
          Unregistered operator? <Link to="/register" className="auth-link">Request Access</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
