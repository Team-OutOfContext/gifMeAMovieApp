import React from "react";
import placeholderPoster from "../assets/poster-placeholder.png";

const MovieSuggestions = props => {
  return (
    <ul className="movie-results-part-one">
      {props.movieSuggestions.map(movieSuggestion => {
        let movieImageUrl = placeholderPoster; //placeholder img url
        // check for movie poster data
        if (movieSuggestion.poster_path !== null) {
          movieImageUrl = `https://image.tmdb.org/t/p/w500${movieSuggestion.poster_path}`;
        }
        let movieTitleHtml = "";
        let movieYear = "";
        if (
          movieSuggestion.release_date === undefined ||
          movieSuggestion.release_date === ""
        ) {
          movieTitleHtml = `${movieSuggestion.title}`;
        } else {
          movieYear = movieSuggestion.release_date.slice(0, 4);
          movieTitleHtml = `${movieSuggestion.title} (${movieYear})`;
        }

        return (
          <li
            className="movie-listing"
            key={movieSuggestion.id}
            tabIndex="0"
            onClick={() => {
              props.getMovieKeywords(
                movieSuggestion.id,
                movieSuggestion.title,
                movieYear,
                movieImageUrl
              );
            }}
          >
            <p>{movieTitleHtml}</p>
          </li>
        );
      })}
    </ul>
  );
};

export default MovieSuggestions;
