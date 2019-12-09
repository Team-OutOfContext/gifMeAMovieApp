import React from "react";

const MovieScreen = props => {
  return (
    <div class="results">
      <div class="wrapper">
        <div class="movie-details">
          <img src={props.movieImageUrl} alt={props.movieImageAltText} />

          <h3>Critic's Review</h3>
          <p>
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Cum
            excepturi, perferendis sed officiis voluptate, hic inventore
            sapiente!
          </p>
        </div>

        <div class="gif-results">
          <h2>You chose</h2>
          <h3 class="movie-title">{props.movieTitle}</h3>
          <ul className="carousel" data-flickity='{"autoPlay":true}'>
            {props.gifDataArray.map((gif, i) => {
              return (
                <li key={i} className="carousel-cell">
                  <img
                    className="carousel-cell-image"
                    src={gif.images.original.webp}
                    alt={gif.title}
                  />
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MovieScreen;
