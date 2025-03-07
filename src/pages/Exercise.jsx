import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../styles/Exercise.css';

const Exercise = () => {
  const { id } = useParams();
  const [exercise, setExercise] = useState(null);
  const [relatedVideos, setRelatedVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchData(id);
    }
  }, [id]);

  const fetchData = async (id) => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `https://exercisedb.p.rapidapi.com/exercises/exercise/${id}`,
        {
          headers: {
            'X-RapidAPI-Key': process.env.REACT_APP_RAPID_API_KEY,
            'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com',
          },
        }
      );
      setExercise(data);
      fetchRelatedVideos(data.name);
    } catch (error) {
      console.error('Error fetching exercise data:', error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedVideos = async (name) => {
    try {
      const response = await axios.get(
        'https://youtube-search-and-download.p.rapidapi.com/search',
        {
          params: { query: name, hl: 'en', type: 'v' },
          headers: {
            'X-RapidAPI-Key': process.env.REACT_APP_RAPID_API_KEY,
            'X-RapidAPI-Host': 'youtube-search-and-download.p.rapidapi.com',
          },
        }
      );
      console.log('YouTube API full response:', response);
  
      const data = response.data;
      if (data.contents) {
        setRelatedVideos(data.contents);
      } else {
        console.warn('Unexpected response structure:', data);
        setRelatedVideos([]);
      }
    } catch (error) {
      console.error('Error fetching videos:', error.response?.data || error.message);
      setRelatedVideos([]);
    }
  };
  console.log('RapidAPI Key:', process.env.REACT_APP_RAPID_API_KEY);


  return (
    <div className="exercise-page">
      {exercise && (
        <div className="exercise-container">
          <div className="exercise-image">
            <img src={exercise.gifUrl} alt={exercise.name} />
          </div>

          <div className="exercise-data">
            <h3>{exercise.name}</h3>
            <p><strong>Target:</strong> {exercise.target}</p>
            <p><strong>Equipment:</strong> {exercise.equipment}</p>
            <h4>Secondary Muscles:</h4>
            <ul>
              {exercise.secondaryMuscles.map((muscle, index) => (
                <li key={index}>{muscle}</li>
              ))}
            </ul>

            <h3>Instructions</h3>
            <ul>
              {exercise.instructions.map((instruction, index) => (
                <li key={index}>{instruction}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <div className="related-videos-container">
        <h3>Related Videos on YouTube</h3>
        {relatedVideos.length > 0 ? (
          <div className="related-videos">
            {relatedVideos.slice(0, 15).map((video, index) => {
              const vid = video?.video || {};
              return (
                <div
                  className="related-video"
                  key={index}
                  onClick={() =>
                    window.open(`https://www.youtube.com/watch?v=${vid.videoId}`, '_blank')
                  }
                >
                  <img src={vid.thumbnails?.[0]?.url} alt={vid.title || 'No title'} />
                  <h4>{vid.title?.slice(0, 40) || 'No title'}...</h4>
                  <p>{vid.channelName || 'Unknown channel'}</p>
                  <p>{vid.viewCountText || 'No views'}</p>
                </div>
              );
            })}
          </div>
        ) : (
          <p>No related videos found.</p>
        )}
      </div>
    </div>
  );
};

export default Exercise;
