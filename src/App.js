import React, { Component } from "react";
import axios from "axios";
import "./App.css";

class App extends Component {
  constructor() {
    super();
    this.state = {
      userInput: "",
      autocompleteWorking: false,
      movieSuggestions: []
    };
  }

  getMovieDetails = () => {
    if (this.state.userInput.length > 0) {
      console.log("getMovieDetails ran");
      axios({
        url: `https://api.themoviedb.org/3/search/movie`,
        method: "GET",
        dataResponse: "json",
        params: {
          api_key: `38f9a8f5c677f0356adca226f357b762`,
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

  //This function gets users search term as they type.
  getUserInput = e => {
    console.log("yay movies");
    console.log(e.target.value);
    this.setState({
      [e.target.id]: e.target.value
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
          ? this.state.movieSuggestions.map((movieSuggestion, i) => {
              const movieYear = movieSuggestion.release_date.slice(0, 4);
              return (
                <li key={i}>
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
