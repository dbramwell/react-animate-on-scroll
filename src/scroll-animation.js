import React, { Component } from "react";
import throttle from "lodash.throttle";
import PropTypes from "prop-types";

export default class ScrollAnimation extends Component {

  constructor(props) {
    super(props);
    this.serverSide = typeof window === "undefined" ? true : false;
    this.listener = throttle(this.handleScroll.bind(this), 50);
    this.visibility = {
      onScreen: false,
      inViewport: false
    };

    this.state = {
      classes: "animated",
      style: {
        animationDuration: `${this.props.duration}s`,
        visibility: this.props.initiallyVisible ? "" : "hidden"
      }
    };

    if(!this.serverSide){
      if (window && window.addEventListener) {
        window.addEventListener("scroll", this.listener);
      }
    }
  }

  getElementTop() {
    return this.node.getBoundingClientRect().top + window.pageYOffset;
  }

  getElementBottom() {
    return this.node.getBoundingClientRect().bottom + window.pageYOffset;
  }

  getViewportTop() {
    return window.pageYOffset + this.props.offset;
  }

  getViewportBottom() {
    return window.pageYOffset + window.innerHeight - this.props.offset;
  }

  isInViewport(y) {
    return y >= this.getViewportTop() && y <= this.getViewportBottom();
  }

  isTopInViewport() {
    return this.isInViewport(this.getElementTop());
  }

  isBottomInViewport() {
    return this.isInViewport(this.getElementBottom());
  }

  isAboveViewport(y) {
    return y < this.getViewportTop();
  }

  isBelowViewport(y) {
    return y > this.getViewportBottom();
  }

  isTopAboveViewport() {
    return this.isAboveViewport(this.getElementTop());
  }

  isBottomBelowViewport() {
    return this.isBelowViewport(this.getElementBottom());
  }

  inViewport() {
    return this.isTopInViewport() || this.isBottomInViewport() ||
      (this.isTopAboveViewport() && this.isBottomBelowViewport());
  }

  onScreen() {
    return !this.isAboveScreen() && !this.isBelowScreen();
  }

  isAboveScreen() {
    return this.getElementBottom() < window.pageYOffset;
  }

  isBelowScreen() {
    return this.getElementTop() > window.pageYOffset + window.innerHeight;
  }

  getVisibility() {
    return {
      inViewport: this.inViewport(),
      onScreen: this.onScreen()
    };
  }

  componentDidMount() {
    if(!this.serverSide) {
      this.handleScroll();
    }
  }

  componentWillUnmount() {
    clearTimeout(this.delayedAnimationTimeout);
    clearTimeout(this.callbackTimeout);
    if (window && window.addEventListener) {
      window.removeEventListener("scroll", this.listener);
    }
  }

  visibilityHasChanged(previousVis, currentVis) {
    return previousVis.inViewport !== currentVis.inViewport ||
      previousVis.onScreen !== currentVis.onScreen;
  }

  animate(animation, callback) {
    this.delayedAnimationTimeout = setTimeout(() => {
      this.animating = true;
      this.setState({
        classes: `animated ${animation}`,
        style: {
          animationDuration: `${this.props.duration}s`
        }
      });
      this.callbackTimeout = setTimeout(callback, this.props.duration * 1000);
    }, this.props.delay);
  }

  animateIn(callback) {
    this.animate(this.props.animateIn, () => {
      const vis = this.getVisibility();
      this.animating = false;
      if (callback) {
        callback(vis);
      }
    });
  }

  animateOut(callback) {
    this.animate(this.props.animateOut, () => {
      this.setState({
        classes: "animated",
        style: {
          animationDuration: `${this.props.duration}s`,
          visibility: this.props.initiallyVisible ? "" : "hidden"
        }
      });
      const vis = this.getVisibility();
      if (vis.inViewport) {
        this.animateIn();
      } else {
        this.animating = false;
      }

      if (callback) {
        callback(vis);
      }
    });
  }

  handleScroll() {
    if (!this.animating) {
      const currentVis = this.getVisibility();
      if (this.visibilityHasChanged(this.visibility, currentVis)) {
        clearTimeout(this.delayedAnimationTimeout);
        if (!currentVis.onScreen) {
          this.setState({
            classes: "animated",
            style: {
              animationDuration: `${this.props.duration}s`,
              visibility: this.props.initiallyVisible ? "" : "hidden"
            }
          });
        } else if (currentVis.inViewport && this.props.animateIn) {
          this.animateIn(this.props.afterAnimatedIn);
        } else if (currentVis.onScreen && this.visibility.inViewport && this.props.animateOut) {
          this.animateOut(this.props.afterAnimatedOut);
        }
        this.visibility = currentVis;
      }
    }
  }

  render() {
    return (
      <div ref={(node) => { this.node = node; }} className={this.state.classes} style={this.state.style}>
        {this.props.children}
      </div>
    );
  }
}

ScrollAnimation.defaultProps = {
  offset: 150,
  duration: 1,
  initiallyVisible: false,
  delay: 0,
  animateOnce: false
};

ScrollAnimation.propTypes = {
  animateIn: PropTypes.string,
  animateOut: PropTypes.string,
  offset: PropTypes.number,
  duration: PropTypes.number,
  delay: PropTypes.number,
  initiallyVisible: PropTypes.bool,
  animateOnce: PropTypes.bool
};
