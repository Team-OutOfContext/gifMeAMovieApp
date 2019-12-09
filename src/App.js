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
      keywordsForGiphy: [],
      gifDataArray: [],
      showGifs: false,
      inputCounter: 0,
      errorMessage: false,
      showButton: false
    };
  }

  //This function gets users search term as they type.
  getUserInput = e => {
    let counter = this.state.inputCounter;
    counter++;
    this.setState({
      [e.target.id]: e.target.value,
      inputCounter: counter
    });
  };

  // This function is for getting movie details from the user input
  getMovieDetails = () => {
    // To make sure the user types something within the character limit
    if (this.state.userInput.length > 0 && this.state.inputCounter < 35) {
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
          console.log(response);
          if (response.data.results.length === 0) {
            this.setState({
              errorMessage: true
            });
          }
          // Setting the state to an array of movies and making the autosuggestion show up on the page
          this.setState({
            autoSuggestions: true,
            movieSuggestions: response.data.results
          });
        }) // end of .then
        .catch(error => {
          this.setState({
            errorMessage: true
          });
          console.log(error);
        });
    }
  };

  // Function to get keywords for the user's movie choice
  getMovieKeywords = (movieId, movieTitle, movieYear, movieImageUrl) => {
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
    })
      .then(response => {
        console.log(response);
        console.log(response.data.keywords, "get movie keywords axios call");

        if (response.data.keywords.length >= 3) {
          // 3 or more keywords
          this.setState({
            movieKeywords: response.data.keywords,
            userInput: "",
            autoSuggestions: false
          });
          this.getKeywordsForGiphy();
        } else if (response.data.keywords.length === 2) {
          // only 2 keywords - random search
        } else if (response.data.keywords.length === 1) {
          // only 1 keyword - random search
        } else {
          // if there's no keywords
          // search random gifs
          const gifDataArray = [];
          const gifPromises = [];
          for (let i = 0; i < 3; i++) {
            gifPromises.push(this.getRandomGifs());
          }
          axios.all(gifPromises).then(gifPromiseReturns => {
            gifPromiseReturns.forEach(gifPromiseReturn => {
              console.log(gifPromiseReturn.data.data);
              gifDataArray.push(gifPromiseReturn.data.data);
            });
            this.setState({
              gifDataArray: gifDataArray,
              showGifs: true,
              showButton: true,
              inputCounter: 0
            });
          });
        }
      })
      .catch(error => {
        this.setState({
          errorMessage: true
        });
        console.log(error);
      });
  };

  // function for getting random gifs if there are no keywords
  getRandomGifs = () => {
    return axios({
      url: `https://api.giphy.com/v1/gifs/random`,
      method: "GET",
      dataResponse: "json",
      params: {
        api_key: this.state.apiKeyGiphy,
        rating: "pg"
      }
    });
  };

  getKeywordsForGiphy = () => {
    this.shuffleKeywordsArray();

    const gifDataArray = [];
    const gifPromises = [];
    this.state.keywordsForGiphy.forEach(keyword => {
      return gifPromises.push(this.getGifs(keyword.name));
    });

    axios.all(gifPromises).then(gifPromiseReturns => {
      gifPromiseReturns.forEach(gifPromiseReturn => {
        // Randomly selecting a gif from the response data
        const randomNumber = Math.floor(
          Math.random() * gifPromiseReturn.data.data.length
        );
        const gifData = gifPromiseReturn.data.data[randomNumber];
        gifDataArray.push(gifData);
      });
      this.setState({
        gifDataArray: gifDataArray,
        showGifs: true,
        showButton: true,
        inputCounter: 0
      });
      console.log(gifDataArray);
    });
  };

  //Function to shuffle keywords from return from Moviedb. Then, grabbing the first three keywords and setting them to state (keywordForGiphy state).
  shuffleKeywordsArray = () => {
    const newKeywordsArray = [...this.state.movieKeywords];
    //Fisher-Yates algorithm for shuffling the array.
    for (let i = newKeywordsArray.length - 1; i > 0; i--) {
      const newIndex = Math.floor(Math.random() * (i + 1));
      const currentKeyword = newKeywordsArray[i];
      const keywordToSwap = newKeywordsArray[newIndex];
      newKeywordsArray[i] = keywordToSwap;
      newKeywordsArray[newIndex] = currentKeyword;
    }
    //Slicing the keyword return to pull only the first three random keywords to use as our giphy call search.
    const slicedKeywords = newKeywordsArray.slice(0, 3);
    this.setState({
      keywordsForGiphy: slicedKeywords
    });
    console.log(newKeywordsArray);
    console.log("shuffled keywords");
    console.log(this.state.keywordsForGiphy[0].name);
  };

  getGifs = keyword => {
    // Axios call to get the keywords
    return axios({
      url: `https://api.giphy.com/v1/gifs/search`,
      method: "GET",
      dataResponse: "json",
      params: {
        api_key: this.state.apiKeyGiphy,
        q: keyword
      }
    });
  };

  render() {
    const test = this.state.keywordsForGiphy;
    console.log(this.state.gifDataArray);
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
        {this.state.errorMessage ? <p>Your movie doesn't exist!</p> : null}

        {this.state.autoSuggestions
          ? this.state.movieSuggestions.map(movieSuggestion => {
              // movieSuggestion.release_date === "" ||
              if (
                movieSuggestion.release_date === undefined ||
                movieSuggestion.release_date === ""
              ) {
                const movieYear = ""; // no release date so it's an empty string
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
                    <p>{movieSuggestion.title}</p>
                  </li>
                );
              } else {
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
              }
            })
          : null}
        <ul>
          {this.state.showGifs
            ? this.state.gifDataArray.map((gif, i) => {
                console.log(gif);
                return (
                  <li key={i}>
                    <p>Hello!</p>
                    <img src={gif.images.original.url} alt="gif" />
                  </li>
                );
              })
            : null}
        </ul>
        {this.state.keywordsForGiphy ? (
          <p>This is a test of {this.state.keywordsForGiphy[0].name}</p>
        ) : null}

        {this.state.showButton ? <button>Watch another movie?</button> : null}
      </div>
    );
  }
}

export default App;
