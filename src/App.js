import React, { Component } from "react";
import axios from "axios";
import "./App.css";

class App extends Component {
  constructor() {
    super();
    this.state = {
      userInput: "",
      autocompleteWorking: false,
      movieSuggestions: [],
      apiKeyMovieDb: "38f9a8f5c677f0356adca226f357b762",
      movieYear: "",
      movieImageUrl: "",
      movieTitle: ""
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

  getMovieDetails = () => {
    if (this.state.userInput.length > 0) {
      console.log("getMovieDetails ran");
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

        this.setState({
          autocompleteWorking: true,
          movieSuggestions: response.data.results
        });
      }); // end of .then
    }
  };

  getMovieKeywords = (movieId, movieTitle, movieYear, movieImageUrl) => {
    console.log(movieTitle, movieYear, movieImageUrl);
    this.setState({
      movieTitle: movieTitle,
      movieYear: movieYear,
      movieImageUrl: `https://image.tmdb.org/t/p/w500${movieImageUrl}`
    });
    axios({
      url: `https://api.themoviedb.org/3/movie/${movieId}/keywords`,
      method: "GET",
      dataResponse: "json",
      params: {
        api_key: this.state.apiKeyMovieDb,
        movie_id: movieId
      }
    }).then(response => {
      console.log(response);
    });
  };

  render() {
    return (
      <div>
        <h1>Woooo our movie site!</h1>
        <input
          type="text"
          id="userInput"
          value={this.state.userInput}
          onChange={e => {
            this.getUserInput(e);
            this.getMovieDetails();
          }}
        />
        <button type="submit">Search Movie</button>
        {this.state.autocompleteWorking
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
