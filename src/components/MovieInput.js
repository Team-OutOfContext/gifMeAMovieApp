import React, { Component } from "react";
import axios from "axios";
import MovieSuggestions from "./MovieSuggestions";

class MovieInput extends Component {
  constructor() {
    super();
    this.state = {
      apiKeyMovieDb: "38f9a8f5c677f0356adca226f357b762",
      apiKeyGiphy: "x51UFN0xOVPnehx6f4dJxLphvkXnx19U",
      userInput: "",
      movieSuggestions: ["hi"],
      movieTitle: "",
      movieYear: "",
      movieImageUrl: "",
      movieKeywords: [],
      gifDataArray: [],
      showGifs: false,
      showLoadingScreen: false,
      errorMessage: false,
      autoSuggestions: false,
      showButton: false,
      noGifs: false
    };
  }

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
            console.log(this.state.movieSuggestions);
            this.setState({
              movieSuggestions: response.data.results,
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

  // Function to get keywords for the user's movie choice
  getMovieKeywords = (movieId, movieTitle, movieYear, movieImageUrl) => {
    // Save the user's movie choice to state
    this.setState({
      movieTitle: movieTitle,
      movieYear: movieYear,
      movieImageUrl: movieImageUrl,
      showLoadingScreen: true
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
        this.filterKeywords();
        //INSERT FUNCTION TO SET UP MOVIE POSTER FOR RESULTS
      }) // end of .then
      .catch(error => {
        // if there's an error getting keywords, just get 3 random gifs
        this.makeGiphyApiCalls(3);
      });
  };

  // function to filter for unsearchable keywords
  // (Movie API has some weird keywords like "aftercreditsstinger" for post credit scenes that result in nothing/errors from Giphy =__=)
  filterKeywords = () => {
    const keywordCheck = RegExp(/(stinger)$/);
    const filteredKeywords = this.state.movieKeywords.filter(
      keyword => !keywordCheck.test(keyword.name)
    );
    this.setState({
      movieKeywords: filteredKeywords
    });
    this.prepGiphyApiCalls();
  };

  // function to determine how many keyword-based API calls & random API calls we need
  // if there's 3 or more keywords, shuffle the keyword array for random 3 keywords to use for Giphy API call
  // if less than 3 keywords, we make API calls for the # of random gifs needed to make up 3 gifs total
  prepGiphyApiCalls = () => {
    if (this.state.movieKeywords.length >= 3) {
      this.shuffleKeywordsArray();
    } else if (this.state.movieKeywords.length === 2) {
      this.makeGiphyApiCalls(1);
    } else if (this.state.movieKeywords.length === 1) {
      this.makeGiphyApiCalls(2);
    } else {
      this.makeGiphyApiCalls(3);
    }
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
    this.makeGiphyApiCalls(0);
    console.log(this.state.movieKeywords[0].name);
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

  // function for this.state.movieKgetting a random gif if there are no keywords (API only returns 1 gif)
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

        this.setState(
          {
            showLoadingScreen: false,
            gifDataArray: gifDataArray,
            showGifs: true,
            showButton: true
          },
          () => {
            this.props.passMovieInfoProps(
              this.state.movieTitle,
              this.state.movieImageUrl,
              this.state.gifDataArray,
              this.state.movieKeywords
            );
          }
        );
        console.log(gifDataArray);
      }) // end of .then
      .catch(error => {
        console.log(error);
        // NEED TO PRINT THIS TO PAGE
        console.log(
          "Sorry, this movie is not currently playing at our theatre! Please try another movie."
        );
        this.setState({
          showLoadingScreen: false,
          noGifs: true,
          showButton: true
        });
      });
  };


  render() {
    return (
      <div>
        <h1>GIF ME A MOVIE!</h1>
        <h3>
          A movie theatre for those who don't have time
        </h3>
        <div className="search-bar">
          <label htmlFor="userInput">Search a movie title</label>
          <input
            type="text"
            id="userInput"
            className="search-input"
            placeholder="Search for a movie"
            value={this.state.userInput}
            onChange={e => {
              this.getUserInput(e);
              this.getMovieDetails();
            }}
          />
          <i className="fas fa-search search-icon"></i>

          {this.props.errorMessageProp ? (
            <p>Your movie doesn't exist!</p>
          ) : null}

          <div className="wrapper">
            <div className="search-bar">
              <div className="movie-results" id="mainContent">
                {this.state.autoSuggestions ? (
                  <MovieSuggestions
                    movieSuggestions={this.state.movieSuggestions}
                    getMovieKeywords={this.getMovieKeywords}
                    passMovieInfoProps={this.passMovieInfo}
                  />
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default MovieInput;
