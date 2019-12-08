import React, { Component } from "react";
import axios from "axios";
import "./App.css";

class App extends Component {
  constructor() {
    super();
    this.state = {
      apiKeyMovieDb: "38f9a8f5c677f0356adca226f357b762",
      apiKeyGiphy: "x51UFN0xOVPnehx6f4dJxLphvkXnx19U",
      userInput: "",
      inputCounter: 0,
      autoSuggestions: false,
      movieSuggestions: [],
      movieTitle: "",
      movieYear: "",
      movieImageUrl: "",
      movieKeywords: [],
      gifDataArray: [],
      showGifs: false,
      noGifs: false,
      showButton: false,
      errorMessage: false
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
    // use regex to check for non-space characters
    const regexCheck = RegExp(/\w/g);
    console.log(this.state.userInput.length);
    console.log(regexCheck.test(this.state.userInput));
    // axios call is only made once there are alphanumeric characters
    if (regexCheck.test(this.state.userInput) && this.state.inputCounter < 38) {
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
            this.setState({
              autoSuggestions: true,
              movieSuggestions: response.data.results
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

  // Function to get keywords for the user's movie choice
  getMovieKeywords = (movieId, movieTitle, movieYear, movieImageUrl) => {
    // Save the user's movie choice to state
    this.setState({
      movieTitle: movieTitle,
      movieYear: movieYear,
      movieImageUrl: movieImageUrl
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
        console.log(response.data.keywords, "get movie keywords axios call");
        this.setState({
          movieKeywords: response.data.keywords,
          userInput: "",
          autoSuggestions: false
        });
        // if there's 3 or more keywords, shuffle the keyword array for random 3 keywords to use for Giphy API call
        // if less than 3 keywords, we make API calls for the # of random gifs needed to make up 3 gifs total
        if (response.data.keywords.length >= 3) {
          this.shuffleKeywordsArray();
        } else if (response.data.keywords.length === 2) {
          this.makeGiphyApiCalls(1);
        } else if (response.data.keywords.length === 1) {
          this.makeGiphyApiCalls(2);
        } else {
          this.makeGiphyApiCalls(3);
        }
      }) // end of .then
      .catch(error => {
        // if there's an error getting keywords, just get 3 random gifs
        this.makeGiphyApiCalls(3);
      });
  };

  // function for getting a random gif if there are no keywords (API only returns 1 gif)
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

  // function to make the right Giphy API calls, then update to state
  makeGiphyApiCalls = randomGifNum => {
    const gifPromises = [];
    this.state.movieKeywords.forEach(keyword => {
      gifPromises.push(this.getKeywordGifs(keyword.name));
    });
    // making calls for x amount of random gifs needed if lacking keywords
    for (let i = 0; i < randomGifNum; i++) {
      gifPromises.push(this.getRandomGifs());
    }
    this.prepGifData(gifPromises);
  };

  prepGifData = gifPromises => {
    // wait for API responses to come back
    axios
      .all(gifPromises)
      .then(gifPromiseReturns => {
        const gifDataArray = [];
        gifPromiseReturns.forEach(gifPromiseReturn => {
          let gifData = "";
          if (Array.isArray(gifPromiseReturn.data.data) === true) {
            console.log(gifPromiseReturn.data.data);
            const randomNumber = Math.floor(
              Math.random() * gifPromiseReturn.data.data.length
            );
            gifData = gifPromiseReturn.data.data[randomNumber];
          } else {
            gifData = gifPromiseReturn.data.data;
          }
          // Randomly selecting a gif from the response data
          gifDataArray.push(gifData);
        });

        this.setState({
          gifDataArray: gifDataArray,
          showGifs: true,
          showButton: true,
          inputCounter: 0
        });
        console.log(gifDataArray);
      }) // end of .then
      .catch(error => {
        // NEED TO PRINT THIS TO PAGE
        console.log(
          "Sorry, this movie is not currently playing at our theatre! Please try another movie."
        );
        this.setState({
          noGifs: true,
          showButton: true
        });
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
      movieKeywords: slicedKeywords
    });
    console.log(newKeywordsArray);
    console.log("shuffled keywords");
    this.makeGiphyApiCalls(0);
  };

  // Axios call to get gifs related to the keyword
  getKeywordGifs = keyword => {
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

  // Reset everything to search a new movie (called on button press)
  resetState = () => {
    // possibly reset inputCounter, userInput, etc. here too if we make the search bar disappear after the user has selected a movie
    this.setState({
      userInput: "",
      inputCounter: 0,
      movieTitle: "",
      movieYear: "",
      movieImageUrl: "",
      movieKeywords: [],
      gifDataArray: [],
      showButton: false,
      noGifs: false,
      errorMessage: false
    });
  };

  render() {
    console.log("page render");
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

        <ul>
          {this.state.autoSuggestions
            ? this.state.movieSuggestions.map(movieSuggestion => {
                let moviePosterUrl = ""; //placeholder img url
                // check for movie poster data
                if (movieSuggestion.poster_path !== undefined) {
                  moviePosterUrl = `https://image.tmdb.org/t/p/w500${movieSuggestion.poster_path}`;
                }
                // check for release date data
                if (
                  movieSuggestion.release_date === undefined ||
                  movieSuggestion.release_date === ""
                ) {
                  // if there's no release date
                  const movieYear = ""; // no release date so it's an empty string
                  return (
                    <li
                      key={movieSuggestion.id}
                      onClick={() => {
                        this.getMovieKeywords(
                          movieSuggestion.id,
                          movieSuggestion.title,
                          movieYear,
                          moviePosterUrl
                        );
                      }}
                    >
                      <p>{movieSuggestion.title}</p>
                    </li>
                  );
                } else {
                  // if there is a release date
                  const movieYear = movieSuggestion.release_date.slice(0, 4);
                  return (
                    <li
                      key={movieSuggestion.id}
                      onClick={() => {
                        this.getMovieKeywords(
                          movieSuggestion.id,
                          movieSuggestion.title,
                          movieYear,
                          moviePosterUrl
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
        </ul>
        <ul>
          {this.state.showGifs
            ? this.state.gifDataArray.map((gif, i) => {
                console.log(gif);
                return (
                  <li key={i}>
                    <p>Hello!</p>
                    <img src={gif.images.original.webp} alt={gif.title} />
                    <img
                      src={this.state.movieImageUrl}
                      alt={`Movie poster for "${this.state.movieTitle}"`}
                    />
                    {/* THIS MOVIE POSTER ALT TEXT ISN'T GOOD B/C IT'LL STILL SHOW FOR PLACEHOLDER IMAGE */}
                  </li>
                );
              })
            : null}
        </ul>
        {this.state.noGifs ? (
          <p>
            Sorry, this movie is not currently playing at our theatre! Please
            try searching a different movie.
          </p>
        ) : null}
        {this.state.showButton ? (
          <button onClick={this.resetState}>Watch another movie?</button>
        ) : null}
      </div>
    );
  }
}

export default App;
