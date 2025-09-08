import React, { useState, useEffect } from 'react';
import instance from './contract';
import { ThreeDots } from 'react-loader-spinner';

function ElectionControl() {
  const [adminAccount, setAdminAccount] = useState('');
  const [isElectionStarted, setIsElectionStarted] = useState(true);
  const [isElectionEnded, setIsElectionEnded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {

    const fetchElectionStatus = async () => {
      try {
        if (window.ethereum) {
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });

          if (accounts.length > 0) {
            setAdminAccount(accounts[0]);
          }

          const started = await instance.methods.electionStarted().call();
          const ended = await instance.methods.electionEnded().call();
          console.log("Election Started:", started);
          console.log("Election Ended:", ended);

          setIsElectionStarted(started);
          setIsElectionEnded(ended);
        }
      } catch (err) {
        setError('Failed to fetch election status');
      }
    };

    fetchElectionStatus();
  }, []);

  const startElection = async () => {
    if (isElectionStarted || isElectionEnded) {
      alert('Election has already started or ended!');
      return;
    }

    setLoading(true);
    try {
      await instance.methods.startElection().send({ from: adminAccount });
      setIsElectionStarted(true);
      alert('Election started!');
    } catch (err) {
      setError('Failed to start election');
    }
    setLoading(false);
  };

  const endElection = async () => {
    if (!isElectionStarted || isElectionEnded) {
      alert('Election is either not started or already ended!');
      return;
    }

    setLoading(true);
    try {
      await instance.methods.endElection().send({ from: adminAccount });
      setIsElectionEnded(true);
      alert('Election ended!');
    } catch (err) {
      setError('Failed to end election');
    }
    setLoading(false);
  };

  return (
    <div style={styles.adminDashboard}>
      <header style={styles.dashboardHeader}>
        <h1 style={styles.heading}>Election Control</h1>
      </header>
      {error && <p style={styles.errorMessage}>{error}</p>}
      <div style={styles.card}>
        <button
          onClick={startElection}
          disabled={isElectionStarted || isElectionEnded || loading}
          style={{ 
            ...styles.actionButton, 
            backgroundColor: isElectionStarted || isElectionEnded ? '#ccc' : '#ff6b5f' 
          }}
        >
          {loading ? <ThreeDots color="#ffffff" height={20} width={20} /> : 'Start Election'}
        </button>
        <button
          onClick={endElection}
          disabled={!isElectionStarted || isElectionEnded || loading}
          style={{ 
            ...styles.actionButton, 
            backgroundColor: !isElectionStarted || isElectionEnded ? '#ccc' : '#ffb47b' 
          }}
        >
          {loading ? <ThreeDots color="#ffffff" height={20} width={20} /> : 'End Election'}
        </button>
      </div>
    </div>
  );
}

const styles = {
  adminDashboard: {
    fontFamily: 'Arial, sans-serif',
    color: '#333',
    padding: '20px',
    maxWidth: '900px',
    margin: '20px auto',
    borderRadius: '10px',
    animation: 'fadeIn 0.8s ease-in-out',
    background: '#ffffff',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  dashboardHeader: {
    textAlign: 'center',
    marginBottom: '20px',
  },
  heading: {
    color: '#ff6b5f',
    fontSize: '2.2em',
    fontWeight: 'bold',
  },
  errorMessage: {
    color: 'red',
    fontSize: '14px',
    marginBottom: '10px',
  },
  card: {
    padding: '20px',
    background: '#fff',
    borderRadius: '8px',
    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
    width: '100%',
    maxWidth: '400px',
  },
  actionButton: {
    padding: '12px 20px',
    borderRadius: '6px',
    color: 'white',
    fontWeight: 'bold',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.3s ease-in-out',
    boxShadow: '2px 2px 8px rgba(0, 0, 0, 0.1)',
  },
};

export default ElectionControl;
