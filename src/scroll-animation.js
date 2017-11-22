import React, { Component } from "react";
import throttle from "lodash.throttle";
import PropTypes from "prop-types";

export default class ScrollAnimation extends Component {
  static posTop() {
    if (typeof window.pageYOffset !== "undefined") {
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
    const initialHide = this.props.initiallyVisible ? "" : "hidden";
    var serverSide = false;
    if(typeof window === "undefined") {
        serverSide = true;
    }
    this.listener = throttle(this.handleScroll.bind(this), 200);
    this.state = {
      classes: "animated",
      style: { "animationDuration": `${this.props.duration}s`, visibility: initialHide },
      lastVisibility: { partially: false, completely: false },
      timeouts: [], serverSide: serverSide
    };
    if(!serverSide){
        if (window && window.addEventListener) {
            window.addEventListener("scroll", this.listener);
        }
    }
    this.getClasses = this.getClasses.bind(this);
  }

  componentDidMount() {
    if(!this.state.serverSide) {
        this.setState({
            elementBottom: this.node.getBoundingClientRect().bottom + ScrollAnimation.posTop(),
            elementTop: this.node.getBoundingClientRect().top + ScrollAnimation.posTop()
        }, this.handleScroll);
        this.handleScroll();
    }
  }

  componentWillUnmount() {
    try {
        if (window && window.addEventListener) {
            window.removeEventListener("scroll", this.listener);
        }
    }catch(e){
        console.log("error unmounting event listener:", e);
    }
  }

  handleScroll() {
    const visible = this.isVisible();
    if (!visible.partially) {
      this.state.timeouts.forEach(function (tid) {
        clearTimeout(tid);
      })
    }
    if (this.props.animateOnce && this.state.lastVisibility.completely) {
      return;
    }
    if (visible.completely !== this.state.lastVisibility.completely || visible.partially !== this.state.lastVisibility.partially) {
      const style = this.getStyle(visible);
      const classes = this.getClasses(visible);
      var that = this;
      if (visible.partially) {
        var timeout = setTimeout(function () {
          that.setState({ classes: classes, style: style, lastVisibility: visible });
        }, this.props.delay);
        var timeouts = this.state.timeouts.slice()
        timeouts.push(timeout);
        this.setState({ timeouts: timeouts });
      } else {
        this.setState({ classes: classes, style: style, lastVisibility: visible });
      }
    }
  }

  isVisible() {
    const viewBottom = window.scrollY + window.innerHeight;
    const viewTop = window.scrollY;
    const offset = this.props.offset;
    const elementBottom = this.state.elementBottom;
    const elementTop = this.state.elementTop;
    const middleOfView = window.scrollY + (window.innerHeight / 2);
    if (elementBottom - elementTop > window.innerHeight - (2 * offset)) {
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
    var style = { "animationDuration": this.props.duration + "s" };
    if (!visible.partially && !this.props.initiallyVisible) {
      style.visibility = "hidden";
    } else if (!visible.completely &&
      visible.partially &&
      !this.state.lastVisibility.partially && !this.props.initiallyVisible) {
      style.visibility = "hidden";
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
