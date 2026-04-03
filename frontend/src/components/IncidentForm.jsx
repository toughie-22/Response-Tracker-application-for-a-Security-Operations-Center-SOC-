import { useState } from 'react';
import axios from 'axios';

const IncidentForm = ({ onClose, onIncidentAdded }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState('medium');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        'http://localhost:5000/api/incidents',
        { title, description, severity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      onIncidentAdded(res.data.data);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create incident');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="incident-form">
        <div className="form-header">
          <h2>Log New Security Incident</h2>
        </div>
        
        {error && <div className="auth-error">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Incident Signature / Title</label>
            <input
              type="text"
              id="title"
              className="auth-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Unauthorized SSH Access on Prod DB"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="severity">Threat Severity Level</label>
            <select
              id="severity"
              className="auth-input"
              value={severity}
              onChange={(e) => setSeverity(e.target.value)}
            >
              <option value="low">Low (Notice)</option>
              <option value="medium">Medium (Warning)</option>
              <option value="high">High (Alert)</option>
              <option value="critical">Critical (Emergency)</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="description">Threat Analysis / Overview</label>
            <textarea
              id="description"
              className="auth-input"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide a detailed description of the payload or observed behavior..."
              rows="5"
              required
            ></textarea>
          </div>

          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={onClose} disabled={isSubmitting}>
              Cancel Scan
            </button>
            <button type="submit" className="submit-btn" disabled={isSubmitting}>
              {isSubmitting ? 'Logging...' : 'Commit Incident Log'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default IncidentForm;
