import React, { useState } from 'react';

function Alumni() {
  const [universityName, setUniversityName] = useState('');
  const [alumniData, setAlumniData] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    setError('');
    setAlumniData([]);
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5050/api/alumni', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ universityName }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch alumni information.');
      }

      const data = await response.json();
      setAlumniData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>Alumni Information</h1>
      <form onSubmit={handleSearch}>
        <label>
          University Name:
          <input
            type="text"
            value={universityName}
            onChange={(e) => setUniversityName(e.target.value)}
            required
          />
        </label>
        <button type="submit" disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>
      {error && <p className="error">{error}</p>}
      <div id="results">
        {alumniData.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>LinkedIn Profile</th>
                <th>University</th>
              </tr>
            </thead>
            <tbody>
              {alumniData.map((alumni, index) => (
                <tr key={index}>
                  <td>{alumni.name}</td>
                  <td>
                    <a href={alumni.linkedin_link} target="_blank" rel="noopener noreferrer">
                      View LinkedIn Profile
                    </a>
                  </td>
                  <td>{alumni.university_name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          !loading && <p>No results found.</p>
        )}
      </div>
    </div>
  );
}

export default Alumni;
