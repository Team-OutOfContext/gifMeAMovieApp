import React, { Component } from "react";
import "./styles/style.css";
import MovieInput from "./components/MovieInput.js";
import MovieScreen from "./components/MovieScreen.js";

class App extends Component {
  constructor() {
    super();
    this.state = {
      userInput: "",
      movieTitle: "",
      movieYear: "",
      movieImageUrl: "",
      movieKeywords: [],
      movieImageAltText: "",
      gifDataArray: [],
      showGifs: false,
      showLoadingScreen: false,
      errorMessage: false,
      autoSuggestions: false,
      showButton: false,
      noGifs: false,
      showMovieInputComp: true
    };
  }

  passMovieInfo = (
    movieTitle,
    movieImageUrl,
    movieImageAltText,
    gifDataArray,
    movieKeywords
  ) => {
    this.setState({
      movieTitle: movieTitle,
      movieImageUrl: movieImageUrl,
      movieImageAltText: movieImageAltText,
      gifDataArray: gifDataArray,
      movieKeywords: movieKeywords,
      showLoadingScreen: false,
      showGifs: true,
      showButton: true,
      showMovieInputComp: false
    });
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
            Sorry, this movie is not currently playing at our theatre! Please
            try searching a different movie.
          </p>
        ) : null}

        {this.state.showButton ? (
          <div className="button-section">
            <button className="reset" onClick={this.resetState}>
              Watch another movie?
            </button>
          </div>
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
