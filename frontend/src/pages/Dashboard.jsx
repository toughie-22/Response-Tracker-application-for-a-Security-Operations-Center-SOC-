import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import IncidentForm from '../components/IncidentForm';
import axios from 'axios';
import './Dashboard.css';

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    fetchIncidents();
  }, []);

  const fetchIncidents = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/incidents', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIncidents(res.data.data);
    } catch (error) {
      console.error("Error fetching incidents", error);
    } finally {
      setLoading(false);
    }
  };

  const handleIncidentAdded = (newIncident) => {
    fetchIncidents(); // Refresh full list
  };

  const handleStatusChange = async (id, newStatus) => {
    setUpdatingId(id);
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:5000/api/incidents/${id}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Update local state smoothly
      setIncidents(incidents.map(inc => 
        inc._id === id ? { ...inc, status: newStatus } : inc
      ));
    } catch (error) {
      alert("Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("CONFIRM DELETION: Are you sure you want to permanently erase this incident log?")) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/incidents/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIncidents(incidents.filter(inc => inc._id !== id));
    } catch (error) {
      alert(error.response?.data?.message || "Failed to delete. You might not have Admin privileges.");
    }
  };

  const getInitials = (name) => {
    if (!name) return 'SO';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  // Analytics Logic
  const openCritical = incidents.filter(i => i.severity === 'critical' && i.status !== 'closed' && i.status !== 'mitigated').length;
  const activeIncidents = incidents.filter(i => i.status === 'open' || i.status === 'investigating').length;
  const mitigatedIncidents = incidents.filter(i => i.status === 'mitigated' || i.status === 'closed').length;

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="dashboard-title">
          <h1>SOC Incident Observer</h1>
          <p>Global threat tracking and analysis dashboard.</p>
        </div>
        <div className="user-profile">
          <span className="user-role-badge">Clearance: {user?.role || 'analyst'}</span>
          <div className="reporter-avatar" style={{width: '36px', height: '36px', fontSize: '1rem'}}>
            {getInitials(user?.name)}
          </div>
          <button onClick={logout} className="logout-btn">
            Disconnect Terminal
          </button>
        </div>
      </header>

      {/* Analytics Summary */}
      <div className="analytics-grid">
        <div className="analytic-card">
          <div className="analytic-value warning-text">{activeIncidents}</div>
          <div className="analytic-label">Active Threats</div>
        </div>
        <div className="analytic-card">
          <div className="analytic-value danger-text">{openCritical}</div>
          <div className="analytic-label">Critical Alerts</div>
        </div>
        <div className="analytic-card">
          <div className="analytic-value success-text">{mitigatedIncidents}</div>
          <div className="analytic-label">Mitigated / Closed</div>
        </div>
      </div>

      <div className="dashboard-controls">
        <button className="action-btn" onClick={() => setShowForm(true)}>
          + Log New Threat Event
        </button>
      </div>

      {showForm && (
        <IncidentForm 
          onClose={() => setShowForm(false)} 
          onIncidentAdded={handleIncidentAdded} 
        />
      )}

      {loading ? (
        <div className="empty-state">
          <h3>Scanning Network Logs...</h3>
        </div>
      ) : incidents.length === 0 ? (
        <div className="empty-state">
          <h3>Network Secure</h3>
          <p>No active incidents or threat signatures detected on the environment.</p>
        </div>
      ) : (
        <div className="incidents-grid">
          {incidents.map((incident) => (
            <div key={incident._id} className="incident-card" style={{ opacity: updatingId === incident._id ? 0.5 : 1 }}>
              <div className="incident-card-header">
                <div>
                  <h3 className="incident-title">{incident.title}</h3>
                  <div className={`incident-status status-${incident.status}`}>
                    <div className="status-dot"></div>
                    {/* Status Dropdown */}
                    <select 
                      className="status-dropdown" 
                      value={incident.status}
                      onChange={(e) => handleStatusChange(incident._id, e.target.value)}
                      disabled={updatingId === incident._id}
                    >
                      <option value="open">Open</option>
                      <option value="investigating">Investigating</option>
                      <option value="mitigated">Mitigated</option>
                      <option value="closed">Closed</option>
                    </select>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
                  <span className={`badge severity-${incident.severity}`}>
                    {incident.severity}
                  </span>
                  {user?.role === 'admin' && (
                    <button className="icon-btn delete" onClick={() => handleDelete(incident._id)} title="Erase Record">
                      ✕
                    </button>
                  )}
                </div>
              </div>
              
              <div className="incident-desc">
                {incident.description}
              </div>
              
              <div className="incident-footer">
                <div className="reporter">
                  <div className="reporter-avatar">
                    {getInitials(incident.createdBy?.name)}
                  </div>
                  <span>{incident.createdBy?.name || 'Unknown Operator'}</span>
                </div>
                <span>
                  Logged: {new Date(incident.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
