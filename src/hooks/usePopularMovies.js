import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addPopularMovies } from '../utils/movieSlice';
import { TMDB_API_OPTIONS } from '../utils/constants';
import { useSelector } from "react-redux";

const usePopularMovies = () => {
  // Fetch Data from TMDB API and update store
  const dispatch = useDispatch();

  const popularMovies = useSelector((state) => state.movies.popularMovies);

  const getPopularMovies = async () => {
    const data = await fetch('https://api.themoviedb.org/3/movie/popular?page=1', TMDB_API_OPTIONS);

    const json = await data.json();
    // console.log(json.results);
    dispatch(addPopularMovies(json.results))
  };

  useEffect(() => {
    !popularMovies && getPopularMovies();
  }, []);
}

export default usePopularMovies;