import React, { useState } from 'react';

const Quiz = () => {
  const [userInfo, setUserInfo] = useState({
    name: '',
    profession: '',
    interests: '',
    hobbies: '',
    experience: '',
    dob: '',
  });
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserInfo((prevInfo) => ({
      ...prevInfo,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:5050/api/quiz/generate-questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...userInfo,
          interests: userInfo.interests.split(','),
          hobbies: userInfo.hobbies.split(','),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate questions');
      }

      const data = await response.json();
      setQuestions(data.questions);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (index, value) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };

  return (
    <div>
      <h2>Career Quiz</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          value={userInfo.name}
          onChange={handleChange}
          placeholder="Enter your full name"
          required
        />
        <input
          type="text"
          name="profession"
          value={userInfo.profession}
          onChange={handleChange}
          placeholder="Enter your profession"
          required
        />
        <input
          type="text"
          name="interests"
          value={userInfo.interests}
          onChange={handleChange}
          placeholder="Enter your interests (comma-separated)"
          required
        />
        <input
          type="text"
          name="hobbies"
          value={userInfo.hobbies}
          onChange={handleChange}
          placeholder="Enter your hobbies (comma-separated)"
          required
        />
        <input
          type="text"
          name="experience"
          value={userInfo.experience}
          onChange={handleChange}
          placeholder="Enter your experience"
          required
        />
        <input
          type="date"
          name="dob"
          value={userInfo.dob}
          onChange={handleChange}
          placeholder="Enter your date of birth"
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Generating...' : 'Start Quiz'}
        </button>
      </form>

      {error && <p className="error-message">{error}</p>}
      {questions.length > 0 && (
        <div>
          <h3>Answer the following questions:</h3>
          {questions.map((question, index) => (
            <div key={index}>
              <p>{question}</p>
              <input
                type="text"
                value={answers[index] || ''}
                onChange={(e) => handleAnswerChange(index, e.target.value)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Quiz;
