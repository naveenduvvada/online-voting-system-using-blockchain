// src/components/Home.js

import React,{useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';
import instance from './contract';

const Home = () => {

  const [candidates, setCandidates] = useState([]);
    const [electionEnded, setElectionEnded] = useState(false);
    const [error, setError] = useState('');
  
    useEffect(() => {
      const fetchResults = async () => {
        try {
          const candidatesList = await instance.methods.getCandidateList().call();
          const isElectionEnded = await instance.methods.electionEnded().call();
          console.log(isElectionEnded)
  
          setCandidates(candidatesList);
          setElectionEnded(isElectionEnded);
        } catch (err) {
          setError('Failed to load results');
          console.error(err);
        }
      };
  
      fetchResults();
    }, []);
  const navigate = useNavigate();
 return(
    <div className="home-container">
      <h1 className="home-heading">Election Voting System</h1>
      <div className="home-cards-container">
        <div className="home-card" onClick={() =>{navigate("/admin/candidates")}}>
          <h2 className="home-card-title">Admin</h2>
          <p className="home-card-description">Manage Candidates and Election Settings</p>
        </div>
        <div className="home-card"  onClick={() =>{navigate("/voter-registration")}}>
          <h2 className="home-card-title">Voters</h2>
          <p className="home-card-description">Check Voting Status and Results</p>
        </div>
      </div><br/><br/>


      <div className="result">
      <header className="result-header">
        <h1>Election Results</h1>
      </header>

      {error && <p className="error-message">{error}</p>}

      <div className="results-container">
        {electionEnded ? (
          candidates.length === 0 ? (
            <p>No candidates found</p>
          ) : (
            candidates.map((candidate, index) => (
              <div key={index} className="result-card">
                <h3>{candidate.name}</h3>
                <p><strong>ID:</strong> {candidate.id}</p>
                <p><strong>Votes:</strong> {candidate.voteCount.toString()}</p>
              </div>
            ))
          )
        ) : (
          <p>The election is still ongoing. Results will be available once it ends.</p>
        )}
      </div>
    </div>
    </div>
  );

}
export default Home;