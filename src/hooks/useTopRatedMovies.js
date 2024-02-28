import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addTopRatedMovies } from '../utils/movieSlice';
import { TMDB_API_OPTIONS } from '../utils/constants';
import { useSelector } from "react-redux";


const useTopRatedMovies = () => {
  // Fetch Data from TMDB API and update store
  const dispatch = useDispatch();

  const topRatedMovies = useSelector((state) => state.movies.topRatedMovies);

  const getTopRatedMovies = async () => {
    const data = await fetch('https://api.themoviedb.org/3/movie/top_rated?page=1', TMDB_API_OPTIONS);

    const json = await data.json();
    // console.log(json.results);
    dispatch(addTopRatedMovies(json.results))
  };

  useEffect(() => {
    !topRatedMovies && getTopRatedMovies();
  }, []);
}

export default useTopRatedMovies;