import React, { Component } from 'react';
import throttle from 'lodash.throttle';
import PropTypes from 'prop-types';

export default class ScrollAnimation extends Component {
  constructor(props) {
    super(props);
    this.serverSide = typeof window === 'undefined';
    this.listener = throttle(this.handleScroll.bind(this), 50);
    this.visibility = {
      onScreen: false,
      inViewport: false,
    };

    this.state = {
      classes: 'animated',
      style: {
        animationDuration: `${this.props.duration}s`,
        opacity: this.props.initiallyVisible ? 1 : 0,
        display: this.props.display ? this.props.display : 'block',
      },
    };

    if (!this.serverSide) {
      if (window && window.addEventListener) {
        window.addEventListener('scroll', this.listener);
      }
    }
  }

  getElementTop() {
    let yPos = 0;
    let elm = this.node;
    while (elm) {
      yPos += (elm.offsetTop + elm.clientTop);
      elm = elm.offsetParent;
    }
    return yPos;
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

  isAboveViewport(y) {
    return y < this.getViewportTop();
  }

  isBelowViewport(y) {
    return y > this.getViewportBottom();
  }

  inViewport(elementTop, elementBottom) {
    return this.isInViewport(elementTop) || this.isInViewport(elementBottom) ||
      (this.isAboveViewport(elementTop) && this.isBelowViewport(elementBottom));
  }

  onScreen(elementTop, elementBottom) {
    return !this.isAboveScreen(elementBottom) && !this.isBelowScreen(elementTop);
  }

  isAboveScreen(y) {
    return y < window.pageYOffset;
  }

  isBelowScreen(y) {
    return y > window.pageYOffset + window.innerHeight;
  }

  getVisibility() {
    const elementTop = this.getElementTop();
    const elementBottom = elementTop + this.node.clientHeight;
    return {
      inViewport: this.inViewport(elementTop, elementBottom),
      onScreen: this.onScreen(elementTop, elementBottom),
    };
  }

  componentDidMount() {
    if (!this.serverSide) {
      this.handleScroll();
    }
  }

  componentWillUnmount() {
    clearTimeout(this.delayedAnimationTimeout);
    clearTimeout(this.callbackTimeout);
    if (window && window.removeEventListener) {
      window.removeEventListener('scroll', this.listener);
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
          animationDuration: `${this.props.duration}s`,
          display: this.props.display,
        },
      });
      this.callbackTimeout = setTimeout(callback, this.props.duration * 1000);
    }, this.props.delay);
  }

  animateIn(callback) {
    this.animate(this.props.animateIn, () => {
      this.setState({
        style: {
          animationDuration: `${this.props.duration}s`,
          opacity: 1,
          display: this.props.display ? this.props.display : 'block',
        },
      });
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
        classes: 'animated',
        style: {
          animationDuration: `${this.props.duration}s`,
          opacity: 0,
          display: this.props.display,
        },
      });
      const vis = this.getVisibility();
      if (vis.inViewport && this.props.animateIn) {
        this.animateIn(this.props.afterAnimatedIn);
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
            classes: 'animated',
            style: {
              animationDuration: `${this.props.duration}s`,
              opacity: this.props.initiallyVisible ? 1 : 0,
              display: this.props.display,
            },
          });
        } else if (currentVis.inViewport && this.props.animateIn) {
          this.animateIn(this.props.afterAnimatedIn);
        } else if (currentVis.onScreen && this.visibility.inViewport && this.props.animateOut && this.state.style.opacity === 1) {
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
  animateOnce: false,
};

ScrollAnimation.propTypes = {
  animateIn: PropTypes.string,
  animateOut: PropTypes.string,
  offset: PropTypes.number,
  duration: PropTypes.number,
  delay: PropTypes.number,
  initiallyVisible: PropTypes.bool,
  animateOnce: PropTypes.bool,
  display: PropTypes.string,
};
