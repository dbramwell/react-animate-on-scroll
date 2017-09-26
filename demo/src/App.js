import React, { Component } from 'react';
import './App.css';
import Menu from './menu/Menu';
import Home from './home/Home';
import PropDescPage from './propDescriptionPage/PropDescPage';
import ScrollableAnchor from 'react-scrollable-anchor';
import Overview from './overview/Overview';
import ScrollAnimation from 'react-animate-on-scroll';
import "../node_modules/animate.css/animate.min.css";

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      show: true
    }

    this.hideScrollAnimation = this.hideScrollAnimation.bind(this);
    this.optionalAnimation = this.optionalAnimation.bind(this);
  }

  hideScrollAnimation() {
    this.setState({ show: false });
  }

  optionalAnimation() {
    if (this.state.show) {
      return <ScrollAnimation animateIn="fadeIn"><p>This is a test scroll animation</p></ScrollAnimation>
    }
  }

  render() {
    return (
      <div>
        <Menu />
        <ScrollableAnchor id={'home'}>
          <Home />
        </ScrollableAnchor>
        <button onClick={this.hideScrollAnimation}>Hide ScrollAnimation</button>
        <ScrollableAnchor id={'animateIn'}>
          <PropDescPage property="animateIn" animateIn="fadeIn" />
        </ScrollableAnchor>
        <ScrollableAnchor id={'animateOut'}>
          <PropDescPage property="animateOut" animateOut="flipOutY" animateIn="flipInY" />
        </ScrollableAnchor>
        <ScrollableAnchor id={'initiallyVisible'}>
          <PropDescPage property="initiallyVisible" initiallyVisible={true} animateIn="wobble" />
        </ScrollableAnchor>
        <ScrollableAnchor id={'duration'}>
          <PropDescPage property="duration" initiallyVisible={true} animateIn="hinge" duration={5} />
        </ScrollableAnchor>
        {this.optionalAnimation()}
        <ScrollableAnchor id={'delay'}>
          <PropDescPage property="delay" initiallyVisible={true} animateIn="tada" delay={4000}>
            <div className="waitForIt">
              {"Wait...".split("").map(function (letter, index) {
                return <ScrollAnimation key={index} animateIn="fadeIn" delay={index * 500} offset={0}>
                  <h2>{letter}</h2>
                </ScrollAnimation>
              })}
            </div>
          </PropDescPage>
        </ScrollableAnchor>
        <ScrollableAnchor id={'animateOnce'}>
          <PropDescPage property="animateOnce" animateOnce={true} animateIn="bounce" initiallyVisible={true} />
        </ScrollableAnchor>
        <ScrollableAnchor id={'install'}>
          <Overview />
        </ScrollableAnchor>
      </div>
    );
  }
}

export default App;
