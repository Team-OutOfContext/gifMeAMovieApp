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
      speed: 2000,
      autoplaySpeed: 500,
      cssEase: "linear"
    };
    return (
      <div className="results">
        <div className="top-title">
          <h5 className="now-playing-title">Now Playing</h5>
          <h3 className="movie-title">{this.props.movieTitle}</h3>
        </div>
        <div className="wrapper movie-screen-wrap">
          <div className="movie-details">
            <img
              src={this.props.movieImageUrl}
              alt={this.props.movieImageAltText}
            />
          </div>

          <div className="gif-results">
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
        <div className="critics-review wrapper">
          <div>
            <p>
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Cum
              excepturi, perferendis
            </p>
          </div>
          <h6> - Critic's Review</h6>
        </div>
      </div>
    );
  }
}

export default MovieScreen;
