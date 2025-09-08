import React, { useState, useEffect } from 'react';
import instance from './contract';
import './Voters.css';
import { ThreeDots } from 'react-loader-spinner';
import { Navigate, useNavigate } from 'react-router-dom';

function Voters() {
  const [account, setAccount] = useState('');
  const [candidates, setCandidates] = useState([]);
  const [electionStarted, setElectionStarted] = useState(false);
  const [electionEnded, setElectionEnded] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(null); // Tracks loading state per candidate
  const [email, setEmail] = useState(''); // Assume email is stored here
  const [otp, setOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [otpVerified, setOtpVerified] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const initWeb3AndContract = async () => {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts && accounts.length > 0) {
          setAccount(accounts[0]);
        } else {
          throw new Error('No accounts found');
        }

        const candidatesList = await instance.methods.getCandidateList().call();
        setCandidates(candidatesList);

        const isElectionStarted = await instance.methods.electionStarted().call();
        const isElectionEnded = await instance.methods.electionEnded().call();
        const voterInfo = await instance.methods.voters(accounts[0]).call();
        const email = localStorage.getItem("email")

        setEmail(email)
        
        setElectionStarted(isElectionStarted);
        setElectionEnded(isElectionEnded);
        setHasVoted(voterInfo.hasVoted);
      } catch (err) {
        setError('Failed to load data');
        console.error(err);
      }
    };

    initWeb3AndContract();
  }, []);

  const sendOtpToEmail = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/sendOtp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        const data = await response.json();
        setGeneratedOtp(data.otp); // Store the OTP
        alert('OTP sent to your email!');
      } else {
        setError('Failed to send OTP');
      }
    } catch (err) {
      setError('Failed to send OTP');
      console.error(err);
    }
  };

  const verifyOtp = () => {
    if (otp === generatedOtp) {
      setOtpVerified(true);
      return true;
    } else {
      alert('Incorrect OTP. Please try again.');
      return false;
    }
  };

  const vote = async (candidateId) => {
    if (hasVoted) return;

    // Send OTP to the user's email before casting the vote
    sendOtpToEmail();

    // Prompt the user to enter the OTP
    const enteredOtp = prompt('Please enter the OTP sent to your email:');
    setOtp(enteredOtp);

    // Verify OTP
    if (verifyOtp()) {
      setLoading(candidateId);
      try {
        const gasEstimate = await instance.methods.vote(candidateId).estimateGas({ from: account });
        await instance.methods.vote(candidateId).send({ from: account, gas: gasEstimate });

        alert('Vote cast successfully!');
        setHasVoted(true);
        window.location.reload();
      } catch (err) {
        setError('Failed to cast vote');
        console.error(err);
      } finally {
        setLoading(null);
      }
    } else {
      setError('Invalid OTP');
    }
  };

  return (
    <div className="voters">
      <header className="voters-header">
        <h1>Election Voter Dashboard</h1>
        <button onClick={() => { navigate("/") }}>Logout</button>
      </header>

      {error && <p className="error-message">{error}</p>}

      <div className="candidates-container">
        {electionStarted && !electionEnded ? (
          candidates.length === 0 ? (
            <p>No candidates found</p>
          ) : (
            candidates.map((candidate, index) => (
              <div key={index} className="candidate-card">
                <h3>{candidate.name}</h3>
                <p><strong>ID:</strong> {candidate.id}</p>
                <button
                  onClick={() => vote(candidate.id)}
                  disabled={hasVoted || loading === candidate.id}
                  className="vote-button"
                >
                  {loading === candidate.id ? (
                    <ThreeDots color="#ffffff" height={20} width={20} />
                  ) : (
                    hasVoted ? 'Voted' : 'Vote'
                  )}
                </button>
              </div>
            ))
          )
        ) : (
          <p>{electionEnded ? 'Election has ended' : 'Election has not started'}</p>
        )}
      </div>
    </div>
  );
}

export default Voters;
