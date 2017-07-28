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
  render() {
    return (
      <div>
        <Menu/>
        <ScrollableAnchor id={'home'}>
          <Home/>
        </ScrollableAnchor>
        <ScrollableAnchor id={'animateIn'}>
          <PropDescPage property="animateIn" animateIn="fadeIn"/>
        </ScrollableAnchor>
        <ScrollableAnchor id={'animateOut'}>
          <PropDescPage property="animateOut" animateOut="flipOutY" animateIn="flipInY"/>
        </ScrollableAnchor>
        <ScrollableAnchor id={'initiallyVisible'}>
          <PropDescPage property="initiallyVisible" initiallyVisible={true} animateIn="wobble"/>
        </ScrollableAnchor>
        <ScrollableAnchor id={'duration'}>
          <PropDescPage property="duration" initiallyVisible={true} animateIn="hinge" duration={5}/>
        </ScrollableAnchor>
        <ScrollableAnchor id={'delay'}>
          <PropDescPage property="delay" initiallyVisible={true} animateIn="tada" delay={4000}>
          <div className="waitForIt">
          {"Wait...".split("").map(function(letter, index) {
            console.log(index);
            return <ScrollAnimation animateIn="fadeIn" delay={index * 500} offset={0}>
              <h2>{letter}</h2>
            </ScrollAnimation>
          })}
          </div>
          </PropDescPage>
        </ScrollableAnchor>
        <ScrollableAnchor id={'animateOnce'}>
          <PropDescPage property="animateOnce" animateOnce={true} animateIn="bounce"/>
        </ScrollableAnchor>
        <ScrollableAnchor id={'install'}>
          <Overview/>
        </ScrollableAnchor>
      </div>
    );
  }
}

export default App;
