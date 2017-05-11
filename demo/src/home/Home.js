import React, { Component } from 'react';
import ScrollAnimation from 'react-animate-on-scroll';
import jsxToString from 'jsx-to-string';
var Prism = require('prismjs');

class Home extends Component {

  constructor(props) {
    super(props);
    this.getScrollAnimationHeader = this.getScrollAnimationHeader.bind(this);
    this.getScrollAnimationLink = this.getScrollAnimationLink.bind(this);
  }

  getScrollAnimationHeader() {
    return (<ScrollAnimation animateIn="fadeIn" animateOut="fadeOut">
        <h1>React Animate On Scroll</h1>
        <h2>Using:</h2>
      </ScrollAnimation>)
  }

  getScrollAnimationLink() {
    return (<ScrollAnimation animateIn="bounceInRight" animateOut="bounceOutLeft">
          <h2><a href="https://daneden.github.io/animate.css/">Animate.css</a></h2>
        </ScrollAnimation>)
  }

  render() {

    const code = Prism.highlight(jsxToString(this.getScrollAnimationHeader()) + "\n" + jsxToString(this.getScrollAnimationLink()), Prism.languages.html);

    return (
      <div className="page home">
      {this.getScrollAnimationHeader()}
      {this.getScrollAnimationLink()}
        <pre className="language-markup">
          <code className="language-markup">
            <div dangerouslySetInnerHTML={{__html: code}}/>
          </code>
        </pre>
      </div>
    );
  }
}

export default Home;