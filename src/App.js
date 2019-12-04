import React, { Component } from "react";
import axios from "axios";
import "./App.css";

class App extends Component {
  constructor() {
    super();
    this.state = {
      userInput: ""
    };
  }

  componentDidMount() {
    this.getMovieDetails(this.state.userInput);
  }

  getMovieDetails = userInput => {
    setTimeout(() => {
      axios({
        url: `https://api.themoviedb.org/3/search/movie`,
        method: "GET",
        dataResponse: "json",
        params: {
          api_key: `38f9a8f5c677f0356adca226f357b762`,
          query: userInput,
          include_adult: false
        }
      }).then(response => {
        console.log(response);
      });
    }, 2000);
  };

  //This function gets users search term as they type.
  getUserInput = e => {
    console.log("yay movies");
    console.log(e.target.id);
    console.log(e.target.value);
    this.setState({
      return { [e.target.id]: e.target.value }
    }),
      () => {
        console.log(this.getMovieDetails(this.state.userInput));
      };
  };

  render() {
    return (
      <div>
        <h1>Woooo our movie site!</h1>
        <input
          type="text"
          id="userInput"
          value={this.state.userInput}
          onChange={this.getUserInput}
        />
        <button type="submit">Search Movie</button>
      </div>
    );
  }
}

export default App;
