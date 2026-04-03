import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Auth.css';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('analyst');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    if (password.length < 6) {
      setError('Passphrase must be at least 6 characters');
      setIsSubmitting(false);
      return;
    }
    
    const result = await register(name, email, password, role);
    
    if (result.success) {
      navigate('/');
    } else {
      setError(result.message || 'Failed to register analyst profile');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Analyst Enrollment</h2>
          <p>Register a new operator profile for SOC platform access</p>
        </div>
        
        {error && <div className="auth-error">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Full Name (or Callsign)</label>
            <input 
              type="text" 
              id="name"
              className="auth-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              required 
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Official Email</label>
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

          <div className="form-group">
            <label htmlFor="role">Clearance Level</label>
            <select 
              id="role"
              className="auth-input"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="analyst">Level 1: Analyst</option>
              <option value="admin">Level 3: Administrator</option>
            </select>
          </div>
          
          <button type="submit" className="auth-btn" disabled={isSubmitting}>
            {isSubmitting ? 'Provisioning...' : 'Provision Identity'}
          </button>
        </form>
        
        <div className="auth-footer">
          Already cleared? <Link to="/login" className="auth-link">Return to Gateway</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
