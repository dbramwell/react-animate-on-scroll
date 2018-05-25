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
    return (<ScrollAnimation
      delay={this.props.delay}
      duration={this.props.duration}
      animateIn={this.props.animateIn}
      animateOut={this.props.animateOut}
      initiallyVisible={this.props.initiallyVisible}
      animateOnce={this.props.animateOnce}
      afterAnimatedIn={this.props.afterAnimatedIn}
      afterAnimatedOut={this.props.afterAnimatedOut}
      scrollableParentSelector={this.props.scrollableParentSelector}
      animatePreScroll={this.props.animatePreScroll}>
        <h1>{this.props.property}</h1>
      </ScrollAnimation>)
  }

  render() {

    const code = Prism.highlight(jsxToString(this.getScrollAnimation(), {useFunctionCode: true}), Prism.languages.jsx);

    return (
      <div className={"page"}>
      {this.props.children}
      {this.getScrollAnimation()}
        <pre>
          <code className="language-jsx">
            <div dangerouslySetInnerHTML={{__html: code}}/>
          </code>
        </pre>
      </div>
    );
  }
}

export default PropDescPage;