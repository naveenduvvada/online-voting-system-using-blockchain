import React from 'react';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import './AdminDashboard.css';
import CandidateManagement from './CandidateManagement';
import ElectionControl from './ElectionControl';

function Dashboard() {
  const {id} = useParams()
  return (
    <>
     <div className="admin-dashboard">
      <header className="dashboard-header">
        <h1>Admin Dashboard</h1>
      </header>
      <nav className="admin-nav">
        <Link to="/admin/candidates" className="nav-link">Manage Candidates</Link>
        <Link to="/admin/election-control" className="nav-link">Election Control</Link>
        <Link to="/" className="nav-link">Logout</Link>
      </nav>
    </div>
     <div>
        { id === "candidates" ? <CandidateManagement/> :<ElectionControl/>}
    </div>
    </>
   
  );
}

export default Dashboard;
