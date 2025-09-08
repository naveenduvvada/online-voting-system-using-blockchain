import React, { useState, useEffect } from 'react';
import instance from './contract';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

function VoterLogin() {
  const [account, setAccount] = useState('');
  const [voterId, setVoterId] = useState('');
  const [voterName, setVoterName] = useState('');
  const[email,setEmail] = useState("");
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Connect to MetaMask and get the user account
  useEffect(() => {
    const initWeb3 = async () => {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        } else {
          throw new Error('No accounts found');
        }
      } catch (err) {
        setError('Failed to connect to MetaMask');
        console.error(err);
      }
    };

    initWeb3();
  }, []);

  const loginVoter = async () => {
    if (!voterId) {
      setError('Voter ID is required');
      return;
    }

    localStorage.setItem("email", email);
    setLoading(true);
    try {
      const voterName = await instance.methods.loginVoter(voterId).call({ from: account });
      console.log(voterName);
      setVoterName(voterName);
      localStorage.setItem("name",voterName)
      toast.success(`Welcome, ${voterName}!`);
      navigate('/voters');
    } catch (err) {
      toast.error('Login failed: Invalid Voter ID or Not Registered');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f4f7fc',
        padding: '20px',
      }}
    >
      <h1 style={{ fontSize: '2.5rem', marginBottom: '20px', color: '#333' }}>Voter Login</h1>
      {error && <p style={{ color: 'red', fontSize: '1rem', marginBottom: '15px' }}>{error}</p>}

      <input
        type="text"
        placeholder="Enter Voter ID"
        value={voterId}
        onChange={(e) => setVoterId(e.target.value)}
        style={inputStyle}
      />
      <input
        type="mail"
        placeholder="Enter Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={inputStyle}
      />
      <input
        type="text"
        value={account}
        readOnly
        style={{
          ...inputStyle,
          backgroundColor: '#e9ecef',
          color: '#6c757d',
          cursor: 'not-allowed',
        }}
      />

      <button
        onClick={loginVoter}
        disabled={loading}
        style={{
          width: '100%',
          maxWidth: '400px',
          padding: '12px 16px',
          backgroundColor: loading ? '#b0c4de' : '#007BFF',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          fontSize: '1rem',
          cursor: loading ? 'not-allowed' : 'pointer',
        }}
      >
        {loading ? 'Logging in...' : 'Login'}
      </button>

      {voterName && (
        <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#e6f7ff', borderRadius: '8px' }}>
          <h3 style={{ color: '#007BFF' }}>Logged in as</h3>
          <p><strong>Name:</strong> {voterName}</p>
          <p><strong>Address:</strong> {account}</p>
        </div>
      )}

      <ToastContainer style={{ fontSize: '1rem' }} />
    </div>
  );
}

const inputStyle = {
  width: '100%',
  maxWidth: '400px',
  padding: '12px 16px',
  marginBottom: '15px',
  border: '1px solid #ccc',
  borderRadius: '8px',
  fontSize: '1rem',
};

export default VoterLogin;
