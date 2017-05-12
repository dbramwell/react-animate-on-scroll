import React, { Component } from 'react';
import ScrollAnimation from 'react-animate-on-scroll';
import Prism from 'prismjs';
import 'prismjs/components/prism-bash';

class Overview extends Component {

  constructor(props) {
    super(props);
    this.getScrollAnimationHeader = this.getScrollAnimationHeader.bind(this);
    this.getScrollAnimationLink = this.getScrollAnimationLink.bind(this);
  }

  getScrollAnimationHeader() {
    return (<ScrollAnimation animateIn="zoomIn" animateOut="zoomOut" duration={3}>
        <h1>Install</h1>
      </ScrollAnimation>)
  }

  getScrollAnimationLink() {
    return (<ScrollAnimation animateIn="bounceInRight" animateOut="bounceOutLeft">
          <h2>For more usage info, see the README in <a href="https://github.com/dbramwell/react-animate-on-scroll">Github</a></h2>
        </ScrollAnimation>)
  }

  render() {

    const codeString = "npm install --save react-animate-on-scroll";
    const code = Prism.highlight(codeString, Prism.languages.bash);

    return (
      <div className="page">
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

export default Overview;