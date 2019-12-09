import React, { Component } from "react";

class MovieInput extends Component {
  render() {
    return (
      <div className="searchBar">
        <label htmlFor="userInput">Search a movie title</label>
        <input
          type="text"
          id="userInput"
          className="searchInput"
          placeholder="Search for a movie"
          value={this.state.userInput}
          onChange={e => {
            this.getUserInput(e);
            this.getMovieDetails();
          }}
        />
        <i className="fas fa-search searchIcon"></i>

        {this.state.errorMessage ? <p>Your movie doesn't exist!</p> : null}
      </div>
    );
  }
}

export default MovieInput;
