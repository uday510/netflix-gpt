import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addNowPlayingMovies } from '../utils/movieSlice';
import { TMDB_API_OPTIONS } from '../utils/constants';
import { useSelector } from "react-redux";

const useNowPlayingMovies = () => {
  // Fetch Data from TMDB API and update store
  const dispatch = useDispatch();

  const nowPlayingMovies = useSelector((state) => state.movies.nowPlayingMovies);
  const getNowPlayingMovies = async () => {
    const data = await fetch('https://api.themoviedb.org/3/movie/now_playing?page=1', TMDB_API_OPTIONS);

    const json = await data.json();
    console.log(json);
    console.log(json.results);
    dispatch(addNowPlayingMovies(json.results))
  };

  useEffect(() => {
    !nowPlayingMovies && getNowPlayingMovies();
  }, []);
}

export default useNowPlayingMovies;