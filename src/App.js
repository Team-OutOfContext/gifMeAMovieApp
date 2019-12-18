import React, { Component } from "react";
import "./styles/style.css";
import MovieInput from "./components/MovieInput.js";
import MovieScreen from "./components/MovieScreen.js";
import LoadingScreen from "./components/LoadingScreen";

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
          <div>
            <div className="button-section">
              <button className="reset" onClick={this.resetState}>
                Watch another movie?
              </button>
            </div>

            <footer>
              <p>
                Made by <a href="https://andrealacson.com/">Andrea Lacson</a>,{" "}
                <a href="https://andrewknows.codes/">Andrew Rubesa</a>,{" "}
                <a href="https://vipinkirthane.com/">Vipin Kirthane</a>, and{" "}
                <a href="https://yiying.ca">Yiying Zou</a> 2019
              </p>
            </footer>
          </div>
        ) : null}

        {this.state.showLoadingScreen ? <LoadingScreen /> : null}
      </div>
    );
  }
}

export default App;
