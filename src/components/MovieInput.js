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
          value={this.props.userInputProp}
          onChange={e => {
            this.props.getUserInputProp(e);
            this.props.getMovieDetailsProp();
          }}
        />
        <i className="fas fa-search searchIcon"></i>

        {this.props.errorMessageProp ? <p>Your movie doesn't exist!</p> : null}
      </div>
    );
  }
}

export default MovieInput;
