import React, { Component } from 'react';
import throttle from 'lodash.throttle';
import '../lib/animate.min.css';
import PropTypes from 'prop-types';

export default class ScrollAnimation extends Component {
  static posTop() {
    if (typeof window.pageYOffset !== 'undefined') {
      return window.pageYOffset;
    } else if (document.documentElement.scrollTop) {
      return document.documentElement.scrollTop;
    } else if (document.body.scrollTop) {
      return document.body.scrollTop;
    }
    return 0;
  }

  constructor(props) {
    super(props);
    const initialHide = this.props.initiallyVisible ? '' : 'hidden';
    this.state = {
      classes: "animated",
      style: {'animationDuration': this.props.duration + 's', visibility: initialHide},
      lastVisibility: {partially: false, completely: false}
    };
    if (window && window.addEventListener) {
      window.addEventListener('scroll', throttle(this.preHandleScroll.bind(this), 200));
    }
    this.getClasses = this.getClasses.bind(this);
  }

  componentDidMount() {
    this.preHandleScroll();
  }

  componentWillUnmount() {
    if (window && window.addEventListener) {
      window.removeEventListener('scroll', this.handleScroll.bind(this));
    }
  }

  preHandleScroll() {
    if (this.state.classes === "animated") {
      this.setState({elementBottom: this.node.getBoundingClientRect().bottom + ScrollAnimation.posTop(),
                   elementTop: this.node.getBoundingClientRect().top + ScrollAnimation.posTop()}, this.handleScroll);
    } else {
      this.handleScroll();
    }
  }

  handleScroll() {
      const visible = this.isVisible();
      if (visible.completely !== this.state.lastVisibility.completely || visible.partially !== this.state.lastVisibility.partially) {
        const style = this.getStyle(visible);
        const classes = this.getClasses(visible);
        this.setState({classes: classes, style: style, lastVisibility: visible});
      }
  }

  isVisible() {
    const viewBottom = window.scrollY + window.innerHeight;
    const viewTop = window.scrollY;
    const offset = this.props.offset;
    const elementBottom = this.state.elementBottom;
    const elementTop = this.state.elementTop;
    const middleOfView = window.scrollY + (window.innerHeight/2);
    if (elementBottom - elementTop > window.innerHeight - (2*offset)) {
      const completely = (elementTop < middleOfView + offset && elementBottom > middleOfView - offset);
      const partially = completely || (((elementTop > middleOfView + offset && elementTop < viewBottom) ||
          (elementBottom < middleOfView - offset && elementBottom > viewTop)));
      return {
        completely: completely,
        partially: partially
      }
    }
    return {
      completely: (elementBottom < viewBottom - offset && elementBottom > viewTop + offset) && (elementTop > viewTop + offset && elementTop < viewBottom - offset),
      partially: (elementBottom < viewBottom && elementBottom > viewTop) || (elementTop > viewTop && elementTop < viewBottom)
    };
  }

  getStyle(visible) {
    var style = {'animationDuration': this.props.duration + 's'};
    if (!visible.partially && !this.props.initiallyVisible) {
      style.visibility = 'hidden';
    } else if (!visible.completely &&
                visible.partially &&
                !this.state.lastVisibility.partially && !this.props.initiallyVisible) {
      style.visibility = 'hidden';
    }
    return style;
  }

  getClasses(visible) {
    var classes = "animated";
    if ((visible.completely && this.props.animateIn) || (visible.partially && this.state.classes.includes(this.props.animateIn) && !this.props.animateOut)) {
      classes += " " + this.props.animateIn;
    } else if (visible.partially && this.state.lastVisibility.completely && this.props.animateOut) {
      classes += " " + this.props.animateOut;
    }
    return classes;
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
  offset: 100,
  duration: 1,
  initiallyVisible: false
};

ScrollAnimation.propTypes = {
  animateIn: PropTypes.string,
  animateOut: PropTypes.string,
  offset: PropTypes.number,
  duration: PropTypes.number,
  initiallyVisible: PropTypes.bool
}