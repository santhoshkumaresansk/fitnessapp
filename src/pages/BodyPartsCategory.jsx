import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../styles/Categories.css';

const BodyPartsCategory = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const apiKey = process.env.REACT_APP_RAPID_API_KEY || '';
  const apiHost = 'exercisedb.p.rapidapi.com';
  const categoryTypes = {
    back: 'bodyPart',
    cardio: 'bodyPart',
    chest: 'bodyPart',
    dumbbell: 'equipment', // Ensure it's correctly mapped to "equipment"
  };
  
  

  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchData = async () => {
    setLoading(true);
    setError('');
  
    const normalizedId = id.toLowerCase();
    const categoryType = categoryTypes[normalizedId] || 'bodyPart';
    const apiUrl = `https://exercisedb.p.rapidapi.com/exercises/${categoryType}/${normalizedId}?limit=50`;
  
    try {
      const response = await axios.get(apiUrl, {
        headers: {
          'X-RapidAPI-Key': apiKey,
          'X-RapidAPI-Host': apiHost,
        },
      });
  
      setExercises(response.data);
    } catch (err) {
      console.error('API Error:', err);
      setError('Failed to fetch exercises. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  

  useEffect(() => {
    if (!apiKey) {
      setError('API key is missing. Add it to your .env file.');
    } else {
      fetchData();
    }
  }, [id]);

  return (
    <div className='category-exercises-page'>
      <h1>Category: <span>{id}</span></h1>

      {loading && <p>Loading exercises...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div className='exercises'>
        {exercises.length > 0 ? (
          exercises.map((exercise) => (
            <div
              className='exercise'
              key={exercise.id}
              onClick={() => navigate(`/exercise/${exercise.id}`)}
            >
              <img src={exercise.gifUrl} alt={exercise.name} />
              <h3>{exercise.name}</h3>
              <ul>
                <li>Target: {exercise.target}</li>
                {exercise.secondaryMuscles.slice(0, 2).map((muscle) => (
                  <li key={muscle}>Secondary: {muscle}</li>
                ))}
              </ul>
            </div>
          ))
        ) : (
          !loading && <p>No exercises found for this category.</p>
        )}
      </div>
    </div>
  );
};

export default BodyPartsCategory;
