import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { TMDB_API_OPTIONS } from '../utils/constants';
import { addTrailerVideo } from "../utils/movieSlice";
import { useSelector } from "react-redux";

const useMovieTrailer = (movieId) => {

    const dispatch = useDispatch();

    const movieTrailer = useSelector((state) => state.movies.trailerVideo);

    // fetch trailer video
    const getMovieVideos = async () => {
        const response = await fetch(
            `https://api.themoviedb.org/3/movie/${movieId}/videos?language=en-US`,
            TMDB_API_OPTIONS
        );
        const data = await response.json();

        const filterData = data.results.filter((video) => video.type === 'Trailer');
        const trailer = filterData.length ? filterData[0] : data.results[0];

        dispatch(addTrailerVideo(trailer));
    };

    useEffect(() => {
        !movieTrailer && getMovieVideos();
    }, []);
}

export default useMovieTrailer;

