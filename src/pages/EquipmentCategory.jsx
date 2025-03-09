import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../styles/Categories.css';

const EquipmentCategory = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchData = async (id) => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(
        `https://exercisedb.p.rapidapi.com/exercises/equipment/${id}`,
        {
          params: { limit: '50' },
          headers: {
            'X-RapidAPI-Key': process.env.REACT_APP_RAPID_API_KEY,
            'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com',
          },
        }
      );
      setExercises(response.data);
    } catch (err) {
      setError('Failed to fetch exercises. Please try again.');
      console.error('API Error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchData(id);
    }
  }, [id]);



  return (
    <div className='category-exercises-page'>
      <h1>
        Category: <span>{id}</span>
      </h1>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div className='exercises'>
        {exercises.map((exercise, index) => (
          <div
            className='exercise'
            key={exercise.id || index}
            onClick={() => navigate(`/exercise/${exercise.id}`)}
          >
            <img src={exercise.gifUrl} alt={exercise.name} />
            <h3>{exercise.name}</h3>
            <ul>
              <li>{exercise.target}</li>
              {exercise.secondaryMuscles.slice(0, 2).map((muscle) => (
                <li key={muscle}>{muscle}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EquipmentCategory;
