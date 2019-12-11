import React, { Component } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

class MovieScreen extends Component {
  constructor() {
    super();
    this.state = {
      movieImageAltText: ""
    };
  }
  render() {
    const settings = {
      dots: true,
      infinite: true,
      slidesToShow: 1,
      slidesToScroll: 1,
      autoplay: true,
      speed: 2000,
      autoplaySpeed: 1200,
      cssEase: "linear"
    };
    return (
      <section className="results wrapper">
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
          {this.props.movieKeywords.length === 3 ? (
            <p>
              When <strong>{this.props.movieKeywords[0].name}</strong> and
              <strong> {this.props.movieKeywords[1].name}</strong> fall in love,{" "}
              <strong>{this.props.movieKeywords[2].name}</strong> ensues.
            </p>
          ) : null}
          {this.props.movieKeywords.length === 2 ? (
            <p>
              When <strong>{this.props.movieKeywords[0].name}</strong> and
              <strong> {this.props.movieKeywords[1].name}</strong> fall in love.
            </p>
          ) : null}
          {this.props.movieKeywords.length === 1 ? (
            <p>
              When <strong>{this.props.movieKeywords[0].name}</strong> ensues.
            </p>
          ) : null}
          {this.props.movieKeywords.length === 0 ? (
            <p>Critics say this movie is an indescribable experience.</p>
          ) : null}
        </div>
      </section>
    );
  }
}

export default MovieScreen;
