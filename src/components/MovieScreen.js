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
      <section className="results">
        <div className="top-title">
          <h5 className="now-playing-title">Now Playing</h5>
          <h3 className="movie-title">{this.props.movieTitle}</h3>
        </div>
        <div className="movie-screen">
          <div className="movie-poster">
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
        <div className="critics-review">
          <p>
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Cum
            excepturi, perferendis
          </p>
          <h6> - Critic's Review</h6>
        </div>
      </section>
    );
  }
}

export default MovieScreen;
