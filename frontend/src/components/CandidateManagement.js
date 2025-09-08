import React, { useState, useEffect } from 'react';
import instance from './contract';
import { ThreeDots } from 'react-loader-spinner';

function CandidateManagement() {
  const [adminAccount, setAdminAccount] = useState('');
  const [candidateID, setCandidateID] = useState('');
  const [candidateName, setCandidateName] = useState('');
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        if (window.ethereum) {
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts.length > 0) {
            setAdminAccount(accounts[0]);

            const candidatesList = await instance.methods.getCandidateList().call();
            setCandidates(candidatesList);
          }
        }
      } catch (err) {
        setError('Failed to fetch candidates');
      }
    };

    fetchCandidates();
  }, []);

  const addCandidate = async () => {
    if (!candidateID || !candidateName) {
      setError('Candidate ID and Name are required');
      return;
    }

    try {
      const id = candidateID
      const name = candidateName

      setLoading(true);
      const gasEstimate = await instance.methods.addCandidate(id,name).estimateGas({ from: adminAccount });
      await instance.methods.addCandidate(id,name).send({ from: adminAccount, gas: gasEstimate });

      alert('Candidate added successfully!');
      setCandidateID('');
      setCandidateName('');

      const candidatesList = await instance.methods.getCandidateList().call();
      setCandidates(candidatesList);
    } catch (err) {
      setError('Failed to add candidate');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.adminDashboard}>
      <header style={styles.header}>
        <h1>Manage Candidates</h1>
      </header>
      {error && <p style={styles.errorMessage}>{error}</p>}
      <div style={styles.card}>
        <input
          type="text"
          value={candidateID}
          onChange={(e) => setCandidateID(e.target.value)}
          placeholder="Enter candidate ID"
          style={styles.input}
        />
        <input
          type="text"
          value={candidateName}
          onChange={(e) => setCandidateName(e.target.value)}
          placeholder="Enter candidate name"
          style={styles.input}
        />
        <button onClick={addCandidate} disabled={loading} style={styles.button}>
          {loading ? <ThreeDots color="#ffffff" height={20} width={20} /> : 'Add Candidate'}
        </button>
      </div>
      <div style={styles.card}>
        <h2>Candidates List</h2>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>ID</th>
              <th style={styles.th}>Name</th>
            </tr>
          </thead>
          <tbody>
            {candidates.map((candidate, index) => (
              <tr key={index} style={styles.tr}>
                <td style={styles.td}>{candidate.id}</td>
                <td style={styles.td}>{candidate.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const styles = {
  adminDashboard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    backgroundColor: '#f4f4f4',
    minHeight: '100vh',
  },
  header: {
    backgroundColor: '#007bff',
    color: '#fff',
    padding: '15px',
    borderRadius: '8px',
    textAlign: 'center',
    width: '100%',
    maxWidth: '600px',
    marginBottom: '20px',
  },
  errorMessage: {
    color: 'red',
    fontWeight: 'bold',
    marginBottom: '10px',
  },
  card: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    width: '100%',
    maxWidth: '600px',
    marginBottom: '20px',
    textAlign: 'center',
  },
  input: {
    width: '100%',
    padding: '10px',
    marginBottom: '10px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    fontSize: '16px',
  },
  button: {
    backgroundColor: '#28a745',
    color: '#fff',
    padding: '10px 15px',
    border: 'none',
    borderRadius: '5px',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'background 0.3s',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '10px',
  },
  th: {
    backgroundColor: '#007bff',
    color: '#fff',
    padding: '10px',
    textAlign: 'left',
  },
  tr: {
    borderBottom: '1px solid #ddd',
  },
  td: {
    padding: '10px',
  },
};

export default CandidateManagement;
