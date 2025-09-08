import React, { useState, useEffect } from 'react';
import instance from './contract';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate,Link } from 'react-router-dom';

function VoterRegistration() {
  const [account, setAccount] = useState('');
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [voterId, setVoterId] = useState('');
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

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

  const registerVoter = async () => {
    if (!name || !age || !gender || !voterId || !email) {
      setError('All fields (name, email, age, gender, voterId) are required');
      return;
    }
  
    if (isNaN(age) || age < 18) {
      setError('Age must be a number and at least 18');
      return;
    }
  
    setLoading(true);
  
    try {
      // Send POST request to API to register user
      const request = await fetch("http://localhost:5000/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, age, gender }),
        mode: "cors",
      });
  
      if (request.ok) {
        // API call was successful, save the user
        const userData = await request.json();
        console.log("User saved to database:", userData);
  
        // Proceed with blockchain registration
        const tx = await instance.methods.registerVoter(name, age, gender, voterId).send({
          from: account,
          gas: 5000000,
        });
  
        const event = tx.events.VoterRegistered.returnValues;
        console.log("Voter Registered on Blockchain:", event);
  
        toast.success('Voter registered successfully!');
        navigate('/login');
        setName('');
        setAge('');
        setGender('');
        setEmail('');
        setVoterId('');
      } else {
        // Handle the error from the API
        const response = await request.json();
        setError(response.error || 'Failed to register voter');
      }
    } catch (err) {
      toast.error('Failed to register voter');
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
      <h1 style={{ fontSize: '2.5rem', marginBottom: '20px', color: '#333' }}>Voter Registration</h1>
      {error && <p style={{ color: 'red', fontSize: '1rem', marginBottom: '15px' }}>{error}</p>}

      <input
        type="text"
        placeholder="Enter Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
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
        type="number"
        placeholder="Enter Age"
        value={age}
        onChange={(e) => setAge(e.target.value)}
        style={inputStyle}
      />
      <select value={gender} onChange={(e) => setGender(e.target.value)} style={inputStyle}>
        <option value="">Select Gender</option>
        <option value="Male">Male</option>
        <option value="Female">Female</option>
        <option value="Other">Other</option>
      </select>
      <input
        type="text"
        placeholder="Enter Voter ID"
        value={voterId}
        onChange={(e) => setVoterId(e.target.value)}
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
        onClick={registerVoter}
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
        {loading ? 'Registering...' : 'Register Voter'}
      </button>

      <ToastContainer style={{ fontSize: '1rem' }} />
      <p className="text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-green-600 hover:text-green-500 font-medium">
                Login
              </Link>
            </p>
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

export default VoterRegistration;
