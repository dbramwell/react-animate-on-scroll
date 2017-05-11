import React, { Component } from 'react';
var Prism = require('prismjs');
import jsxToString from 'jsx-to-string';
import ScrollAnimation from 'react-animate-on-scroll';

class PropDescPage extends Component {

  constructor(props) {
    super(props);
    this.getScrollAnimation = this.getScrollAnimation.bind(this);
  }

  getScrollAnimation() {
    return (<ScrollAnimation duration={this.props.duration} animateIn={this.props.animateIn} animateOut={this.props.animateOut} initiallyVisible={this.props.initiallyVisible}>
        <h1>{this.props.property}</h1>
      </ScrollAnimation>)
  }

  render() {

    const code = Prism.highlight(jsxToString(this.getScrollAnimation()), Prism.languages.html);

    return (
      <div className={this.props.color + " page"}>
      {this.getScrollAnimation()}
        <pre className="language-markup">
          <code className="language-markup">
            <div dangerouslySetInnerHTML={{__html: code}}/>
          </code>
        </pre>
      </div>
    );
  }
}

export default PropDescPage;