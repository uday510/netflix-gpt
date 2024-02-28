import React, { useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import lang from '../utils/languageConstants';
import openai from '../utils/openai';
import { TMDB_API_OPTIONS } from '../utils/constants';
import { addGptMovieResult } from '../utils/gptSlice';
import Spinner from './Spinner'; // Import your Spinner component
import '../index.css';

const GptSearchBar = () => {
  const langKey = useSelector((store) => store.config.lang);
  const dispatch = useDispatch();
  const searchText = useRef(null);

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);

  const handleGptSearchClick = async () => {
    try {
      setLoading(true);
      setErr(null);

      const gptQuery =
        " Act as a Movie Recommendation System and suggest some movies for the query "
        + searchText.current.value +
        ". only give me names of 5 movies. comma separated like the example result given ahead. Example Result : Gadar, Sholay, DDLJ, K3G, Koi Mil Gaya";

      const gptResponse = await openai.chat.completions.create({
        messages: [{ role: 'user', content: gptQuery }],
        model: 'gpt-3.5-turbo',
      });

      // For each movie in movies, fetch the movie details from TMDB API
      const searchMovieTMDB = async (movie) => {
        const response = await fetch(
          "https://api.themoviedb.org/3/search/movie?query="
          + movie
          + "&include_adult=false&language=en-US&page=1",
          TMDB_API_OPTIONS
        );
        const data = await response.json();

        return data.results;
      }

      if (!gptResponse.choices) {
        setErr('No response from GPT');
        return;
      }

      const movies = gptResponse?.choices?.[0]?.message?.content?.split(',');

      if (!movies || movies.length === 0) {
        setErr('No movies found in the response');
        return;
      }

      const movieDetails = await Promise.all(movies.map((movie) => searchMovieTMDB(movie.trim())));

      dispatch(addGptMovieResult({ movieNames: movies, movieResults: movieDetails }));
    } catch (error) {
      setErr('An error occurred during processing');
    } finally {
      setLoading(false);
    }
  }

  return (
      <div className='pt-[35%] md:pt-[10%] flex justify-center'>
      <form className='w-full md:w-1/2 bg-black grid grid-cols-12' onSubmit={(e) => e.preventDefault()}>
        <input
          ref={searchText}
          type='text'
          className='p-4 m-4 col-span-9'
          placeholder={lang[langKey].gptSearchPlaceholder}
        />
        <button
          className='col-span-3 m-4 py-2 px-4 bg-red-700 text-white rounded-lg '
          onClick={handleGptSearchClick}
        >
          {lang[langKey].search}
        </button>
      </form>
      {loading && <Spinner />}
      {err && <p>{err}</p>}
    </div>
  );
}

export default GptSearchBar;
