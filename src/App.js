import React, { Component } from "react";
import "./styles/style.css";
import MovieInput from "./components/MovieInput.js";
import MovieScreen from "./components/MovieScreen.js";

class App extends Component {
  constructor() {
    super();
    this.state = {
      userInput:"",
      movieTitle: "",
      movieYear: "",
      movieImageUrl: "",
      movieKeywords: [],
      movieImageAltText:"",
      gifDataArray: [],
      showGifs: false,
      showLoadingScreen: false,
      errorMessage: false,
      autoSuggestions: false,
      showButton: false,
      noGifs: false,
      showMovieInputComp: true,
    };
  }
  
  passMovieInfo = (movieTitle, movieImageUrl, gifDataArray, movieKeywords) => {
  //This function gets users search term as they type.
  getUserInput = e => {
    this.setState({
      [e.target.id]: e.target.value
    });
  };

  // This function is for getting movie details from the user input
  getMovieDetails = () => {
    // use regex to check for non-space characters
    const regexCheck = RegExp(/\w/g);
    console.log(this.state.userInput.length);
    console.log(regexCheck.test(this.state.userInput));
    // axios call is only made once there are alphanumeric characters
    if (regexCheck.test(this.state.userInput)) {
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
      })
        .then(response => {
          // no movies returned (empty array)
          if (response.data.results.length === 0) {
            this.setState({
              errorMessage: true
            });
          } else {
            // Setting the state to an array of movies and making the autosuggestion show up on the page
            const movieSuggestions = response.data.results.slice(0, 10);
            this.setState({
              movieSuggestions: movieSuggestions,
              autoSuggestions: true
            });
          }
        }) // end of .then
        .catch(error => {
          this.setState({
            errorMessage: true
          });
          console.log(error);
        });
    }
  };
    
    this.setState({
      movieTitle: movieTitle,
      movieImageUrl: movieImageUrl,
      gifDataArray: gifDataArray,
      movieKeywords: movieKeywords,
      showLoadingScreen: false,
      showGifs: true,
      showButton: true,
      showMovieInputComp: false,
    });
  }

  prepMoviePosterData = () => {
    // check if it's the movie poster from API or our placeholder img
    const movieImageCheck = RegExp(/^(http)/);
    if (movieImageCheck.test(this.state.movieImageUrl)) {
      console.log(movieImageCheck.test(this.state.movieImageUrl));
      this.setState({
        movieImageAltText: "Movie poster for"
      });
    } else {
      console.log(movieImageCheck.test(this.state.movieImageUrl));
      this.setState({
        movieImageAltText: "Placeholder image for the movie poster for"
      });
    }
  };

  // Reset everything to search a new movie (called on button press)
  resetState = () => {
    this.setState({
      userInput: "",
      movieTitle: "",
      movieYear: "",
      movieImageUrl: "",
      movieImageAltText: "",
      movieKeywords: [],
      gifDataArray: [],
      showButton: false,
      noGifs: false,
      errorMessage: false,
      showMovieInputComp: true,
      showGifs: false
    });
  };

  render() {
    return (
      <div className="App">
        <section className="movie-input-section">
          <div className="wrapper">
            {this.state.showMovieInputComp ? (
              <MovieInput passMovieInfoProps={this.passMovieInfo} />
            ) : null}

            {this.state.showGifs ? (
              <MovieScreen
                movieTitle={this.state.movieTitle}
                movieImageUrl={this.state.movieImageUrl}
                movieImageAltText={this.state.movieImageAltText}
                gifDataArray={this.state.gifDataArray}
                showGifs={this.state.showGifs}
                movieKeywords={this.state.movieKeywords}
              />
            ) : null}

            {this.state.noGifs ? (
              <p>
                Sorry, this movie is not currently playing at our theatre!
                Please try searching a different movie.
              </p>
            ) : null}

            {this.state.showButton ? (
              <button onClick={this.resetState}>Watch another movie?</button>
            ) : null}
            <h1>Gif Me A Movie</h1>
            <h2>A theatre for those who don't have time</h2>

            <MovieInput
              userInputProp={this.state.userInput}
              getUserInputProp={this.getUserInput}
              getMovieDetailsProp={this.getMovieDetails}
              errorMessageProp={this.state.errorMessage}
            />

            <div className="movie-seats"></div>

            <div className="search-bar">
              {/* MovieSuggestions should be inside MovieInput component so we don't repeat the search-bar div */}

              {this.state.autoSuggestions ? (
                <MovieSuggestions
                  movieSuggestions={this.state.movieSuggestions}
                  getMovieKeywords={this.getMovieKeywords}
                />
              ) : null}
            </div>
          </div>
        </section>

        {this.state.showGifs ? (
          <MovieScreen
            movieTitle={this.state.movieTitle}
            movieImageUrl={this.state.movieImageUrl}
            movieImageAltText={this.state.movieImageAltText}
            gifDataArray={this.state.gifDataArray}
          />
        ) : null}

        {this.state.noGifs ? (
          <p>
            Sorry, this movie is not currently playing at our theatre! Please
            try searching a different movie.
          </p>
        ) : null}

        <div className="movie-tagline">
          {this.state.movieKeywords.length === 3 ? (
            <p>
              {`When a ${this.state.movieKeywords[0].name} and a
              ${this.state.movieKeywords[1].name} fall in love, ${this.state.movieKeywords[2].name} ensues`}
            </p>
          ) : null}
          {this.state.movieKeywords.length === 2 ? (
            <p>
              {`When a ${this.state.movieKeywords[0].name} and a
              ${this.state.movieKeywords[1].name} fall in love`}
            </p>
          ) : null}
          {this.state.movieKeywords.length === 1 ? (
            <p>{`When a ${this.state.movieKeywords[0].name} and.`}</p>
          ) : null}
        </div>

        {this.state.showButton ? (
          <button onClick={this.resetState}>Watch another movie?</button>
        ) : null}

        {this.state.showLoadingScreen ? (
          <div className="loading-screen">
            <p>Getting the results...</p>
          </div>
        ) : null}
      </div>
    );
  }
}

export default App;
