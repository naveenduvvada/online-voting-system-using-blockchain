import React, { useState, useEffect } from 'react';
import instance from './contract';
import './Result.css';

function Result() {
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

  return (
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
  );
}

export default Result;
