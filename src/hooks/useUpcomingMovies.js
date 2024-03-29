import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addUpcomingMovies } from '../utils/movieSlice';
import { TMDB_API_OPTIONS } from '../utils/constants';
import { useSelector } from "react-redux";


const useUpcomingMovies = () => {
  // Fetch Data from TMDB API and update store
  const dispatch = useDispatch();

  const upcomingMovies = useSelector((state) => state.movies.upcomingMovies);
  const getUpcomingMovies = async () => {
    const data = await fetch('https://api.themoviedb.org/3/movie/upcoming?page=1', TMDB_API_OPTIONS);

    const json = await data.json();
    // console.log(json.results);
    dispatch(addUpcomingMovies(json.results))
  };

  useEffect(() => {
    !upcomingMovies && getUpcomingMovies();
  }, []);
}

export default useUpcomingMovies;