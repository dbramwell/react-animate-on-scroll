import React, { Component } from "react";
import throttle from "lodash.throttle";
import PropTypes from "prop-types";

export default class ScrollAnimation extends Component {

  constructor(props) {
    super(props);
    this.serverSide = typeof window === "undefined";
    this.listener = throttle(this.handleScroll.bind(this), 50);
    this.visibility = {
      onScreen: false,
      inViewport: false
    };

    this.state = {
      classes: "animated",
      style: {
        animationDuration: `${this.props.duration}s`,
        opacity: this.props.initiallyVisible ? 1 : 0
      }
    };
  }

  getElementTop(elm) {
    var yPos = 0;
    while (elm && elm.offsetTop !== undefined && elm.clientTop !== undefined) {
      yPos += (elm.offsetTop + elm.clientTop);
      elm = elm.offsetParent;
    }
    return yPos;
  }

  getScrollPos() {
    if (this.scrollableParent.pageYOffset !== undefined) {
      return this.scrollableParent.pageYOffset;
    }
    return this.scrollableParent.scrollTop;
  }

  getScrollableParentHeight() {
    if (this.scrollableParent.innerHeight !== undefined) {
      return this.scrollableParent.innerHeight;
    }
    return this.scrollableParent.clientHeight;
  }

  getViewportTop() {
    return this.getScrollPos() + this.props.offset;
  }

  getViewportBottom() {
    return this.getScrollPos() + this.getScrollableParentHeight() - this.props.offset;
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
    return y < this.getScrollPos();
  }

  isBelowScreen(y) {
    return y > this.getScrollPos() + this.getScrollableParentHeight();
  }

  getVisibility() {
    const elementTop = this.getElementTop(this.node) - this.getElementTop(this.scrollableParent);
    const elementBottom = elementTop + this.node.clientHeight;
    return {
      inViewport: this.inViewport(elementTop, elementBottom),
      onScreen: this.onScreen(elementTop, elementBottom)
    };
  }

  componentDidMount() {
    if(!this.serverSide) {
      const parentSelector = this.props.scrollableParentSelector
      this.scrollableParent = parentSelector ? document.querySelector(parentSelector) : window;
      if (this.scrollableParent && this.scrollableParent.addEventListener) {
        this.scrollableParent.addEventListener("scroll", this.listener);
      } else {
        console.warn(`Cannot find element by locator: ${this.props.scrollableParentSelector}`);
      }
      if (this.props.animatePreScroll) {
        this.handleScroll();
      }
    }
  }

  componentWillUnmount() {
    clearTimeout(this.delayedAnimationTimeout);
    clearTimeout(this.callbackTimeout);
    this.listener.cancel();
    if (window && window.removeEventListener) {
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
      if (window.requestAnimationFrame) {
        window.requestAnimationFrame(() => {
          this.setState({
            classes: `animated ${animation}`,
            style: {
              animationDuration: `${this.props.duration}s`
            }
          });
        });
      } else {
        this.setState({
          classes: `animated ${animation}`,
          style: {
            animationDuration: `${this.props.duration}s`
          }
        });
      }
      this.callbackTimeout = setTimeout(callback, this.props.duration * 1000);
    }, this.props.delay);
  }

  animateIn(callback) {
    this.animate(this.props.animateIn, () => {
      if (!this.props.animateOnce) {
        this.setState({
          style: {
            animationDuration: `${this.props.duration}s`,
            opacity: 1
          }
        });
        this.animating = false;
      }
      const vis = this.getVisibility();
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
          opacity: 0
        }
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
            classes: "animated",
            style: {
              animationDuration: `${this.props.duration}s`,
              opacity: this.props.initiallyVisible ? 1 : 0
            }
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
    var classes = this.props.className ? `${this.props.className} ${this.state.classes}` : this.state.classes;
    return (
      <div ref={(node) => { this.node = node; }} className={classes} style={Object.assign({}, this.state.style, this.props.style)}>
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
  animatePreScroll: true
};

ScrollAnimation.propTypes = {
  animateIn: PropTypes.string,
  animateOut: PropTypes.string,
  offset: PropTypes.number,
  duration: PropTypes.number,
  delay: PropTypes.number,
  initiallyVisible: PropTypes.bool,
  animateOnce: PropTypes.bool,
  style: PropTypes.object,
  scrollableParentSelector: PropTypes.string,
  className: PropTypes.string,
  animatePreScroll: PropTypes.bool
};
