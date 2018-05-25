import React, { Component } from 'react';
import './App.css';
import Menu from './menu/Menu';
import Home from './home/Home';
import PropDescPage from './propDescriptionPage/PropDescPage';
import ScrollableAnchor from 'react-scrollable-anchor';
import { configureAnchors } from 'react-scrollable-anchor';
import Overview from './overview/Overview';
import ScrollAnimation from 'react-animate-on-scroll';
import "../node_modules/animate.css/animate.min.css";
import "prismjs/components/prism-jsx.min";

configureAnchors({offset: -100})

class App extends Component {
  render() {
    return (
      <div>
        <Menu />
        <ScrollableAnchor id={'home'}>
          <Home />
        </ScrollableAnchor>
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
        <ScrollableAnchor id={'scrollableParentSelector'}>
        <div className={"page"}>
          <h1>scrollableParentSelector</h1>
          <div id="scrolly-div" className='scrolly-div'>
            <PropDescPage property="scrollableParentSelector" animateIn="fadeIn" animateOut="fadeOut" scrollableParentSelector="#scrolly-div">
              <div style={{height:100 + "vh"}}>
                <h2>You can use scroll animations within other elements too, just pass a CSS selector that corresponds to the scrollable parent object.</h2>
                <h3>Scroll here to see how it works!</h3>
              </div>
            </PropDescPage>
          </div>
        </div>
        </ScrollableAnchor>
        <ScrollableAnchor id={'afterAnimatedIn'}>
          <PropDescPage property="afterAnimatedIn" animateIn="flipInX" afterAnimatedIn={(v) => {
              var t = "Animate In finished.\n";
              t += `v.onScreen: ${v.onScreen}\n`;
              t += `v.inViewport: ${v.inViewport}`;
              alert(t);
            }} />
        </ScrollableAnchor>
        <ScrollableAnchor id={'afterAnimatedOut'}>
          <PropDescPage property="afterAnimatedOut" initiallyVisible={true} animateOut="flipOutX" afterAnimatedOut={(v) => {
              var t = "Animate Out finished.\n";
              t += `v.onScreen: ${v.onScreen}\n`;
              t += `v.inViewport: ${v.inViewport}`;
              alert(t);
            }} />
        </ScrollableAnchor>
        <ScrollableAnchor id={'animatePreScroll'}>
        <div className={"page"}>
          <h1>animatePreScroll</h1>
          <h3>You might not want an animation to run if it is in view as soon as the page loads. Scroll below to see what I mean.</h3>
          <div id='scrolly-div-animatePreScroll' className='scrolly-div' >
            <PropDescPage property="animatePreScroll=false" offset={0} animateIn="fadeIn" animatePreScroll={false} scrollableParentSelector="#scrolly-div-animatePreScroll">
              <ScrollAnimation offset={0} animateIn="fadeIn" scrollableParentSelector="#scrolly-div-animatePreScroll">
                <h1>animatePreScroll=true</h1>
              </ScrollAnimation>
              <div style={{height:20 + "px"}}/>
            </PropDescPage>
          </div>
        </div>
        </ScrollableAnchor>
        <ScrollableAnchor id={'install'}>
          <Overview />
        </ScrollableAnchor>
      </div>
    );
  }
}

export default App;
