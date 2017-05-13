import React from 'react';
import ReactDOM from 'react-dom';
var expect = require('expect');
import ScrollAnimation from './scroll-animation'; //my root-test lives in components/__tests__/, so this is how I require in my components.

describe('scrollEffect', function () {

  var myTestDiv;

  beforeEach(() => {
    document.body.innerHTML += '<div id="myDiv"></div>';
    myTestDiv = document.getElementById("myDiv");
    window.scrollTo(0, 0);
  });

  it('renders without problems', function () {
    var root = ReactDOM.render(<ScrollAnimation />, myTestDiv);
    expect(root).toExist();
    // console.log(root.props);
    // console.log(root.node);
    // console.log(root.state);
  });

  it('produced div has class matching the "animateIn" prop when in view', (done) => {
    var scrollEffect = createScrollAnimationOffScreen({animateIn: "zoomIn"});
    scrollIntoCompleteView(scrollEffect);
    setTimeout(function() {
      expect(scrollEffect.node.className).toContain("zoomIn");
      done();
    }, 200);
  });

  it('produced div has class "animated" when in view', () => {
    var scrollEffect = createScrollAnimationOffScreen({animateIn: "zoomIn"});
    scrollIntoCompleteView(scrollEffect);
    expect(scrollEffect.node.className).toContain("animated");
  });

  it('produced div does not have class matching the "animateIn" prop when not in complete view', (done) => {
    var scrollEffect = createScrollAnimationOffScreen({animateIn: "zoomIn"});
    expect(scrollEffect.node.className).toNotContain("zoomIn");
    scrollIntoPartialViewTop(scrollEffect);
    setTimeout(function() {
      expect(scrollEffect.node.className).toNotContain("zoomIn");
      done();
    }, 100);
  });

  it('produced div has class "animated" when not in view', () => {
    var scrollEffect = createScrollAnimationOffScreen({animateIn: "zoomIn"});
    expect(scrollEffect.node.className).toContain("animated");
  });

  it('produced div gains class matching "animateIn" when scrolled into view completely', (done) => {
    var scrollEffect = createScrollAnimationOffScreen({animateIn: "zoomInTest"});
    expect(scrollEffect.node.className).toNotContain("zoomInTest");
    scrollIntoCompleteView(scrollEffect);
    setTimeout(function() {
      expect(scrollEffect.node.className).toContain("zoomInTest");
      done();
    }, 300);
  });

  it('produced div loses class matching "animateIn" when not visible anymore (at bottom of page)', (done) => {
    var scrollEffect = createScrollAnimationOffScreen({animateIn: "zoomIn"});
    expect(scrollEffect.node.className).toNotContain("zoomIn");
    scrollIntoCompleteView(scrollEffect);
    setTimeout(function() {
      expect(scrollEffect.node.className).toContain("zoomIn");
      scrollToBottom();
      setTimeout(function() {
        expect(scrollEffect.node.className).toNotContain("zoomIn");
        done();
      }, 200)
    }, 200);
  });

  it('produced div loses class matching "animateIn" when not visible anymore (at top of page)', (done) => {
    var scrollEffect = createScrollAnimationOffScreen({animateIn: "zoomIn"});
    expect(scrollEffect.node.className).toNotContain("zoomIn");
    scrollIntoCompleteView(scrollEffect);
    setTimeout(function() {
      expect(scrollEffect.node.className).toContain("zoomIn");
      scrollToTop();
      setTimeout(function() {
        expect(scrollEffect.node.className).toNotContain("zoomIn");
        done();
      }, 500)
    }, 500);
  });

  it('is in view then is visible', (done) => {
    var scrollEffect = createScrollAnimationOffScreen({animateIn: "zoomInTest"});
    scrollIntoCompleteView(scrollEffect);
    setTimeout(function() {
      expect(scrollEffect.node.style.visibility).toNotBe("hidden");
      done();
    }, 300);
  });

  it('is not in view then is not visible', () => {
    var scrollEffect = createScrollAnimationOffScreen({animateIn: "zoomIn"});
    expect(scrollEffect.node.style.visibility).toBe("hidden");
  });

  it('is partly in view but is already invisible then is invisible', (done) => {
    var scrollEffect = createScrollAnimationOffScreen({animateIn: "zoomIn"});
    scrollIntoPartialViewTop(scrollEffect);
    setTimeout(function() {
      expect(scrollEffect.node.style.visibility).toBe("hidden");
      done()
    }, 200)
  });

  it('when created with "animateOut" prop and almost out of view, class matching prop is on element after animateIn has happened', (done) => {
    var scrollEffect = createScrollAnimationOffScreen({animateIn: "zoomIn", animateOut: "zoomOut"});
    scrollIntoCompleteView(scrollEffect);
    setTimeout(function() {
      expect(scrollEffect.node.className).toContain("zoomIn");
      scrollIntoPartialViewTop(scrollEffect);
      setTimeout(function(){
        expect(scrollEffect.node.className).toNotContain("zoomIn");
        expect(scrollEffect.node.className).toContain("zoomOut");
        done();
      }, 200)
    }, 200)
  });

  it('is partly in view but is already visible then is visible', (done) => {
    var scrollEffect = createScrollAnimationOffScreen({animateIn: "zoomIn"});
    scrollIntoCompleteView(scrollEffect);
    setTimeout(function() {
      expect(scrollEffect.node.style.visibility).toBe("");
      scrollIntoPartialViewTop(scrollEffect);
      setTimeout(function() {
        expect(scrollEffect.node.style.visibility).toBe("");
        done()
      }, 400)
    }, 200);
  });

  it('is in view then animation-duration is 1s', () => {
    ReactDOM.render(<ScrollAnimation animateIn="zoomIn"/>, myTestDiv);
    expect(document.getElementsByTagName('div')[1].style['animation-duration']).toBe("1s");
  });

  it('is in view then animation-duration matches duration prop if set', () => {
    ReactDOM.render(<ScrollAnimation animateIn="zoomIn" duration={2}/>, myTestDiv);
    expect(document.getElementsByTagName('div')[1].style['animation-duration']).toBe("2s");
  });

  it('is not in view then animation-duration is 1s', () => {
    var scrollEffect = createScrollAnimationOffScreen({animateIn: "zoomIn", duration: 1});
    expect(scrollEffect.node.style['animation-duration']).toBe("1s");
  });

  it('if animation changes position of component, scrolling slightly at this time should not stop animation', (done) => {
    var scrollEffect = createScrollAnimationOffScreen({animateIn: "bounceInDown", duration: 5});
    scrollIntoCompleteView(scrollEffect);
    setTimeout(function() {
      expect(scrollEffect.node.className).toContain("bounceInDown");
      window.scrollTo(0, window.scrollY + 4);
      setTimeout(function() {
        expect(scrollEffect.node.className).toContain("bounceInDown");
        done();
      }, 200)
    }, 200)
  });

  it('if set with initiallyVisible prop then is visible when created off screen', () => {
    var scrollEffect = createScrollAnimationOffScreen({animateIn: "bounceInDown", initiallyVisible: true});
    expect(scrollEffect.node.style.visibility).toBe("");
  });

  it('if the element is bigger than the screen then is completely visible when covering over half of the screen', (done) => {
    var scrollEffect = createScrollAnimationOffScreen({animateIn: "bounceInDown", size: 2000});
    scrollLargeElementSoOverHalfCoversPage(scrollEffect);
    setTimeout(function() {
      expect(scrollEffect.node.className).toContain("bounceInDown");
      expect(scrollEffect.node.style.visibility).toNotBe("hidden");
      done();
    }, 200)
  });

  it('if element is created with "delay" property, animation is delayed upon trigger', (done) => {
    var scrollEffect = createScrollAnimationOffScreen({animateIn: "bounceInDown", delay: 1000});
    scrollIntoCompleteView(scrollEffect);
    setTimeout(function() {
      expect(scrollEffect.node.className).toNotContain("bounceInDown");
      setTimeout(function() {
        expect(scrollEffect.node.className).toContain("bounceInDown");
        done();
      }, 150)
    }, 900)
  });

  it('if element is created with "delay" property, and element is scrolled out of view, timeouts are cancelled', (done) => {
    var scrollEffect = createScrollAnimationOffScreen({animateIn: "bounceInDown", delay: 1000});
    scrollIntoCompleteView(scrollEffect);
    setTimeout(function() {
      scrollToTop();
      setTimeout(function() {
        expect(scrollEffect.node.className).toNotContain("bounceInDown");
        done();
      }, 850)
    }, 200)
  });

  it('if element is given animate with delay, when scrolled out of view animation class is removed instantly', (done) => {
    var scrollEffect = createScrollAnimationOffScreen({animateIn: "fadeIn", delay: 1000});
    scrollIntoCompleteView(scrollEffect);
    setTimeout(function() {
      expect(scrollEffect.node.className).toContain("fadeIn");
      scrollToTop();
      setTimeout(function() {
        expect(scrollEffect.node.className).toNotContain("fadeIn");
        expect(scrollEffect.node.style.visibility).toBe("hidden");
        done();
      }, 200)
    }, 1050)
  });

  function createScrollAnimationOffScreen(props) {
    var size = props.size ? props.size : 100;
    ReactDOM.render(<div><div style={{height:10000 + 'px'}} /><div id="test"/><div style={{height:10000 + 'px'}} /></div>, myTestDiv);
    var div = document.getElementById("test");
    var offset = props.offset ? props.offset : 0;
    var duration = props.duration ? props.duration : 0;
    var delay = props.delay ? props.delay : 0;
    return ReactDOM.render(<ScrollAnimation delay={delay} initiallyVisible={props.initiallyVisible} duration={duration} animateIn={props.animateIn} animateOut={props.animateOut} offset={offset}><div style={{height:size + "px"}}/></ScrollAnimation>, div);
  }

  function scrollIntoCompleteView(elem) {
    var top = elem.node.getBoundingClientRect().top + ScrollAnimation.posTop();
    var elemHeight = elem.node.getBoundingClientRect().height;
    var offset = (window.innerHeight - elemHeight)/2;
    window.scrollTo(0, top - offset);
  }

  function scrollLargeElementSoOverHalfCoversPage(elem) {
    var top = elem.node.getBoundingClientRect().top + ScrollAnimation.posTop();
    window.scrollTo(0, top - 20);
  }

  function scrollIntoPartialViewTop(elem) {
    var top = elem.node.getBoundingClientRect().top + ScrollAnimation.posTop();
    window.scrollTo(0, top - window.innerHeight + 2);
  }

  function scrollIntoPartialViewBottom(elem) {
    var bottom = elem.node.getBoundingClientRect().bottom + ScrollAnimation.posTop();
    window.scrollTo(0, bottom - 2);
  }

  function scrollToTop() {
    window.scrollTo(0, 0);
  }

  function scrollToBottom() {
    window.scrollTo(0,document.body.scrollHeight);
  }
});