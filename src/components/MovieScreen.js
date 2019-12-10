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

            <div>
              {this.props.showGifs
                ? this.props.gifDataArray.map((gif, i) => {
                    let movieImageAltText = "";
                    // check if it's the movie poster from API or our placeholder img
                    const movieImageCheck = RegExp(/^(http)/);
                    if (movieImageCheck.test(this.props.movieImageUrl)) {
                      movieImageAltText = "Movie poster for";
                    } else {
                      movieImageAltText =
                        "Placeholder image for the movie poster for";
                    }
                  })
                : null}
            </div>

            <div className="movie-tagline">
              {this.props.movieKeywords.length === 3 ? (
                <p>
                  {`When a ${this.props.movieKeywords[0].name} and a
              ${this.props.movieKeywords[1].name} fall in love, ${this.props.movieKeywords[2].name} ensues`}
                </p>
              ) : null}
              {this.props.movieKeywords.length === 2 ? (
                <p>
                  {`When a ${this.props.movieKeywords[0].name} and a
              ${this.props.movieKeywords[1].name} fall in love`}
                </p>
              ) : null}
              {this.props.movieKeywords.length === 1 ? (
                <p>{`When a ${this.props.movieKeywords[0].name} and.`}</p>
              ) : null}
            </div>

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
