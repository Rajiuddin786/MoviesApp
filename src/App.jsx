import Search from './components/Search'
import Spiner from './components/Spiner'
import MovieCard from './components/MovieCard';
import { updateSearchCount,getTrendingMovies } from './appwrite.js';

import React, { useState,useEffect } from 'react'
import { useDebounce } from 'react-use'

const API_BASE_URL="https://api.themoviedb.org/3";
const API_KEY=import.meta.env.VITE_TMDB_API_KEY;

const App = () => {
  const [searchTerm, setSearchTerm] = useState('')

  const [errorMessage,setErrorMessage]=useState('');

  const [moviesList,setMoviesList]=useState([]);

  const [loading,setLoading]=useState(true);

  const [debounceSearchTerm,setDebounceSearchTerm]=useState('');

  const [trendingMovies,setTrendingMovies]=useState([]);

  useDebounce(
    ()=>{
      setDebounceSearchTerm(searchTerm);
    },800,[searchTerm])

  const fetchMovies = async (query='') =>{
    setLoading(true);
    setErrorMessage('');
    try{
      const endPoint = query ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}&api_key=${API_KEY}` :
      `${API_BASE_URL}/discover/movie?sort_by=popularity.desc&api_key=${API_KEY}`;

      const response = await fetch(endPoint);
      if(!response.ok){
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if(data.Response === 'False'){
        setErrorMessage(data.Error||'Failed to fetch movies.');
        setMoviesList([]);
        return;
      }
      setMoviesList(data.results||[]);

      if(query && data.results.length > 0){
        await updateSearchCount(query, data.results[0]);
      }
    }catch(error){
      console.error("Error fetching movies:", error); 
      setErrorMessage("Failed to fetch movies. Please try again later.");
    }finally{
      setLoading(false);
    }
  }

  const loadTrendingMovies = async () => {
    try{
      const movies=await getTrendingMovies();
      setTrendingMovies(movies);
    }catch(error){
      console.error("Error fetching trending movies:", error);
    }
  };

  useEffect(() => {
    fetchMovies(debounceSearchTerm);
  },[debounceSearchTerm]);

  useEffect(() =>{
    loadTrendingMovies();
  },[])


  return (
    <main>
      <div className='pattern' />

      <div className='wrapper'>
        <header>
          <img src='./hero-img.png' alt='hero-banner' />
          <h1>Find <span className='text-gradient'>Movies</span> You'll Enjoy Without Hassel</h1>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>
          {trendingMovies.length > 0 && (
            <section className='trending'>
              <h2>Trending Movies</h2>
              <ul>
                {trendingMovies.map((movie,index) => (
                  <li key={movie.id}>
                    <p>{index+1}</p>
                    <img src={movie.poster_url} alt={movie.title} />
                  </li>
                ))}
              </ul>
            </section>
          )}
          <section className='all-movies'>
            <h2>All Movies</h2>
            {loading ? (
              <Spiner/>
            ):errorMessage ? (
              <p className='text-white'>{errorMessage}</p>
            ):(
              <ul>
                {moviesList.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} />
                  ))}
              </ul>)}
          </section>
      </div>
    </main>
  )
}

export default App