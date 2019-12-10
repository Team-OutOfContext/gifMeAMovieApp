import React, { Component } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

class MovieScreen extends Component {
  constructor() {
    super();
  }
  render() {
    const settings = {
      dots: true,
      infinite: true,
      slidesToShow: 1,
      slidesToScroll: 1,
      autoplay: true,
      speed: 500,
      autoplaySpeed: 500,
      cssEase: "linear"
    };
    return (
      <div class="results">
        <div class="wrapper">
          <div class="movie-details">
            <img
              src={this.props.movieImageUrl}
              alt={this.props.movieImageAltText}
            />

            <h3>Critic's Review</h3>
            <p>
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Cum
              excepturi, perferendis sed officiis voluptate, hic inventore
              sapiente!
            </p>
          </div>

          <div class="gif-results">
            <h2>You chose</h2>
            <h3 class="movie-title">{this.props.movieTitle}</h3>
            <Slider {...settings}>
              {this.props.gifDataArray.map((gif, i) => {
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
            </Slider>
          </div>
        </div>
      </div>
    );
  }
}

export default MovieScreen;
