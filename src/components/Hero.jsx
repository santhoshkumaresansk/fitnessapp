import React, { useEffect, useState } from 'react';
import '../styles/Hero.css';

const Hero = () => {
  const [exercises, setExercises] = useState([]);

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const response = await fetch('https://exercisedb.p.rapidapi.com/exercises', {
          method: 'GET',
          headers: {
            'X-RapidAPI-Key': '5446e39212msha2500288583dacep1e4548jsn2321b56f79dd',
            'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com'
          }
        });
        if (!response.ok) throw new Error('Failed to fetch exercises');
        const data = await response.json();
        setExercises(data.slice(0, 5)); // Get only first 5 exercises
        console.log('Fetched Exercises:', data);
      } catch (error) {
        console.error('Error fetching exercises:', error.message);
      }
    };

    fetchExercises();
  }, []);

  return (
    <div className='hero-container' id='hero'>
      <div className="hero-text">
        <span>
          <div className="hero-line" />
          <h5>SB Fitness</h5>
        </span>
        <h2>Unleash the Inner <b>Fitness</b> Wizard: Morph Your Bod, <b>Upgrade</b> Your Life Quest!</h2>
        <a href="#search"><button>View more</button></a>
      </div>

      {/* Exercise list */}
      <div className="exercise-list">
        {exercises.length > 0 ? (
          exercises.map((exercise, index) => (
            <p key={index}>{exercise.name}</p>
          ))
        ) : (
          <p>Loading exercises...</p>
        )}
      </div>
    </div>
  );
}

export default Hero;
