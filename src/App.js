import React, { Component } from "react";
import axios from "axios";
import "./App.css";

class App extends Component {
  constructor() {
    super();
    this.state = {
      userInput: "",
      autoSuggestions: false,
      movieSuggestions: [],
      apiKeyMovieDb: "38f9a8f5c677f0356adca226f357b762",
      apiKeyGiphy: "x51UFN0xOVPnehx6f4dJxLphvkXnx19U",
      movieYear: "",
      movieImageUrl: "",
      movieTitle: "",
      movieKeywords: [],
    };
  }

  //This function gets users search term as they type.
  getUserInput = e => {
    console.log("yay movies");
    console.log(e.target.value);
    this.setState({
      [e.target.id]: e.target.value
    });
  };

  // This function is for getting movie details from the user input
  getMovieDetails = () => {
    // To make sure the user types something within the character limit
    if (this.state.userInput.length > 0 && this.state.userInput.length <= 20) {
      console.log("getMovieDetails ran");
      // Make axios call to get movie details
      axios({
        url: `https://api.themoviedb.org/3/search/movie`,
        method: "GET",
        dataResponse: "json",
        params: {
          api_key: this.state.apiKeyMovieDb,
          query: this.state.userInput,
          include_adult: false
        }
      }).then(response => {
        console.log(this.state.userInput);
        console.log(response);
        console.log(response.data.results);
        // Setting the state to an array of movies and making the autosuggestion show up on the page
        this.setState({
          autoSuggestions: true,
          movieSuggestions: response.data.results
        });
      }); // end of .then
    }
  };

  // Function to get keywords for the user's movie choice
  getMovieKeywords = (movieId, movieTitle, movieYear, movieImageUrl) => {
    console.log(movieTitle, movieYear, movieImageUrl);

    // Save the user's movie choice to state
    this.setState({
      movieTitle: movieTitle,
      movieYear: movieYear,
      movieImageUrl: `https://image.tmdb.org/t/p/w500${movieImageUrl}`
    });

    // Axios call to get the keywords
    axios({
      url: `https://api.themoviedb.org/3/movie/${movieId}/keywords`,
      method: "GET",
      dataResponse: "json",
      params: {
        api_key: this.state.apiKeyMovieDb,
        movie_id: movieId
      }
    }).then(response => {
      console.log(response.data.keywords);
      this.setState({
        movieKeywords: response.data.keywords
      })
      this.getRandomKeywords();
    });
  };

  getRandomKeywords = () => {
    console.log(this.state.movieKeywords);

    // if (this.state.movieKeywords.length < 3){

    // } else {
    // }
    this.shuffleKeywordsArray()

    // let randomIndex = 
    // this.state.movieKeywords[randomIndex].name
  }

  shuffleKeywordsArray = () => {
    for (let i = this.state.movieKeywords.length - 1; i > 0; i--) {
      const newIndex = Math.floor(Math.random() * (i + 1));
      const currentKeyword = this.state.movieKeywords[i];
      const keywordToSwap = this.state.movieKeywords[newIndex];
      this.state.movieKeywords[i] = keywordToSwap;
      this.state.movieKeywords[newIndex] = currentKeyword;
    };

    console.log(this.state.movieKeywords);
  }

  getGifs = (keyword) => {
    // Axios call to get the keywords
    axios({
      url: `https://api.giphy.com/v1/gifs/search`,
      method: "GET",
      dataResponse: "json",
      params: {
        api_key: this.state.apiKeyGiphy,
        q: keyword,
      }
    }).then(response => {
      console.log(response);
    });
  }

  render() {
    return (
      <div>
        <h1>Woooo our movie site!</h1>

        <label htmlFor="userInput">Search a movie title</label>
        <input
          type="text"
          id="userInput"
          value={this.state.userInput}
          onChange={e => {
            this.getUserInput(e);
            this.getMovieDetails();
          }}
        />

        {this.state.autoSuggestions
          ? this.state.movieSuggestions.map(movieSuggestion => {
              const movieYear = movieSuggestion.release_date.slice(0, 4);
              return (
                <li
                  key={movieSuggestion.id}
                  onClick={() => {
                    this.getMovieKeywords(
                      movieSuggestion.id,
                      movieSuggestion.title,
                      movieYear,
                      movieSuggestion.poster_path
                    );
                  }}
                >
                  <p>
                    {movieSuggestion.title} ({movieYear})
                  </p>
                </li>
              );
            })
          : null}
      </div>
    );
  }
}

export default App;
