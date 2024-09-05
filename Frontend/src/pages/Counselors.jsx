import React, { useState } from 'react';

const Counselors = () => {
  const [address, setAddress] = useState('');
  const [counselors, setCounselors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    setAddress(e.target.value);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:5050/api/counselors', { // Point to Express.js backend
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ address }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch counselors');
      }

      const data = await response.json();
      setCounselors(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Find Career Counselors</h2>
      <input 
        type="text" 
        value={address} 
        onChange={handleInputChange} 
        placeholder="Enter your full address" 
        disabled={loading} 
      />
      <button onClick={handleSubmit} disabled={loading}>
        {loading ? 'Searching...' : 'Search'}
      </button>

      {error && <p className="error-message">{error}</p>}
      {counselors.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Website</th>
              <th>Google Maps</th>
            </tr>
          </thead>
          <tbody>
            {counselors.map((counselor, index) => (
              <tr key={index}>
                <td>{counselor.title}</td>
                <td><a href={counselor.url} target="_blank" rel="noopener noreferrer">Visit Website</a></td>
                <td><a href={counselor.maps_link} target="_blank" rel="noopener noreferrer">View on Google Maps</a></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Counselors;
