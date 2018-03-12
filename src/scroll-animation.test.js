import React from "react";
import ReactDOM from "react-dom";
import "animate.css/animate.min.css";
var expect = require("expect");
import ScrollAnimation from "./scroll-animation";

describe("ScrollAnimation - ", function () {

  var myTestDiv;

  beforeEach(() => {
    document.body.innerHTML = "<div id='myDiv'></div>";
    myTestDiv = document.getElementById("myDiv");
    window.scrollTo(0, 0);
  });

  afterEach(() => {
    var test = document.getElementById("test");
    if (test) {
      ReactDOM.unmountComponentAtNode(test);
    }
    ReactDOM.unmountComponentAtNode(document.getElementById("myDiv"));
  });

  it("renders without problems", function () {
    var root = ReactDOM.render(<ScrollAnimation />, myTestDiv);
    expect(root).toExist();
  });

  it("getElementTop returns location of top of element", function () {
    var root = ReactDOM.render(<ScrollAnimation />, myTestDiv);
    expect(root.getElementTop()).toBe(0);
  });

  it("getElementTop returns location of top of element when element contains an image after image has loaded", function (done) {
    var root = ReactDOM.render(<ScrollAnimation><img style={{verticalAlign: "middle"}} src="base/test.jpg"/></ScrollAnimation>, myTestDiv);
    setTimeout(() => {
      expect(root.getElementTop()).toBe(0);
      done();
    }, 100);
  });  

  it("getViewportTop returns location of top of viewport", () => {
    var root = ReactDOM.render(<ScrollAnimation />, myTestDiv);
    expect(root.getViewportTop()).toBe(150);
  });

  it("getViewportTop returns location of top of viewport when given specific offset", () => {
    var root = ReactDOM.render(<ScrollAnimation offset={50} />, myTestDiv);
    expect(root.getViewportTop()).toBe(50);
  });

  it("getViewportTop returns location of top of viewport when given specific offset after scrolling", () => {
    var scrollAnimation = createScrollAnimationOffScreen({animateIn: "zoomIn", offset: 50});
    window.scrollTo(0, 500);
    expect(scrollAnimation.getViewportTop()).toBe(550);
  });

  it("getViewportBottom returns location of bottom of viewport", () => {
    var root = ReactDOM.render(<ScrollAnimation />, myTestDiv);
    expect(root.getViewportBottom()).toBe(450);
  });

  it("getViewportBottom returns location of bottom of viewport when given specific offset", () => {
    var root = ReactDOM.render(<ScrollAnimation offset={50} />, myTestDiv);
    expect(root.getViewportBottom()).toBe(550);
  });

  it("getViewportBottom returns location of bottom of viewport when given specific offset after scrolling", () => {
    var scrollAnimation = createScrollAnimationOffScreen({animateIn: "zoomIn", offset: 50});
    window.scrollTo(0, 500);
    expect(scrollAnimation.getViewportBottom()).toBe(1050);
  });

  it("isAboveViewport returns false if value is below viewport", () => {
    var scrollAnimation = createScrollAnimationOffScreen({animateIn: "zoomIn"});
    expect(scrollAnimation.isAboveViewport(1000)).toBeFalsy();
  });

  it("isAboveViewport returns true if value is above viewport", () => {
    var scrollAnimation = createScrollAnimationOffScreen({animateIn: "zoomIn", offset: 100});
    expect(scrollAnimation.isAboveViewport('0')).toBeTruthy();
  });

  it("isBelowViewport returns false if value is above viewport", () => {
    var scrollAnimation = createScrollAnimationOffScreen({animateIn: "zoomIn"});
    expect(scrollAnimation.isBelowViewport('0')).toBeFalsy();
  });

  it("isBelowViewport returns true if value is below viewport", () => {
    var scrollAnimation = createScrollAnimationOffScreen({animateIn: "zoomIn"});
    expect(scrollAnimation.isBelowViewport(1000)).toBeTruthy();
  });

  it("inViewport returns true if element is contained in the viewport", (done) => {
    var scrollAnimation = createScrollAnimationOffScreen({animateIn: "zoomIn", offset: 100});
    scrollIntoCompleteView(scrollAnimation);
    waitFor(() => {return scrollAnimation.inViewport(scrollAnimation.getElementTop(scrollAnimation.node), scrollAnimation.getElementTop(scrollAnimation.node) + scrollAnimation.node.clientHeight)},
      () => {
        expect(scrollAnimation.inViewport(scrollAnimation.getElementTop(scrollAnimation.node), scrollAnimation.getElementTop(scrollAnimation.node) + scrollAnimation.node.clientHeight)).toBeTruthy();
        done();
      });
  });

  it("inViewport returns true if element top is above the viewport and element bottom is below the viewport", (done) => {
    var scrollAnimation = createScrollAnimationOffScreen({animateIn: "zoomIn", offset: 200, size: 4000});
    scrollIntoCompleteView(scrollAnimation);
    const top = scrollAnimation.getElementTop(scrollAnimation.node);
    const bottom = top + scrollAnimation.node.clientHeight;
    waitFor(() => {return scrollAnimation.inViewport(top, bottom)},
      () => {
        expect(scrollAnimation.inViewport(top, bottom)).toBeTruthy();
        done();
      });
  });

  it("inViewport returns false if element not completely visible", () => {
    var scrollAnimation = createScrollAnimationOffScreen({animateIn: "zoomIn", offset: 200});
    const top = scrollAnimation.getElementTop(scrollAnimation.node);
    const bottom = top + scrollAnimation.node.clientHeight;
    expect(scrollAnimation.inViewport(top, bottom)).toBeFalsy();
    scrollIntoPartialViewTop(scrollAnimation);
    expect(scrollAnimation.inViewport(top, bottom)).toBeFalsy();
    scrollIntoPartialViewBottom(scrollAnimation);
    expect(scrollAnimation.inViewport(top, bottom)).toBeFalsy();
  });

  it("getVisibility returns the current visibility of the element when onScreen at top but not inViewport", (done) => {
    var scrollAnimation = createScrollAnimationOffScreen({animateIn: "zoomIn", offset: 100});
    var visibility = scrollAnimation.getVisibility();
    expect(visibility.inViewport).toBeFalsy();
    expect(visibility.onScreen).toBeFalsy();

    scrollIntoPartialViewTop(scrollAnimation);
    waitFor(() => {return scrollAnimation.getVisibility().onScreen},
      () => {
        visibility = scrollAnimation.getVisibility();
        expect(visibility.inViewport).toBeFalsy();
        expect(visibility.onScreen).toBeTruthy();
        done();
      });
  });

  it("getVisibility returns the current visibility of the element when onScreen and inViewport", (done) => {
    var scrollAnimation = createScrollAnimationOffScreen({animateIn: "zoomIn", offset: 100});
    var visibility = scrollAnimation.getVisibility();
    expect(visibility.inViewport).toBeFalsy();
    expect(visibility.onScreen).toBeFalsy();

    scrollIntoCompleteView(scrollAnimation);
    waitFor(() => {return scrollAnimation.getVisibility().onScreen},
      () => {
        visibility = scrollAnimation.getVisibility();
        expect(visibility.inViewport).toBeTruthy();
        expect(visibility.onScreen).toBeTruthy();
        done();
      });
  });

  it("getVisibility returns the current visibility of the element when onScreen at bottom but not inViewport", (done) => {
    var scrollAnimation = createScrollAnimationOffScreen({animateIn: "zoomIn",offset: 100});
    var visibility = scrollAnimation.getVisibility();
    expect(visibility.inViewport).toBeFalsy();
    expect(visibility.onScreen).toBeFalsy();

    scrollIntoPartialViewBottom(scrollAnimation);
    waitFor(() => {return scrollAnimation.getVisibility().onScreen},
      () => {
        visibility = scrollAnimation.getVisibility();
        expect(visibility.inViewport).toBeFalsy();
        expect(visibility.onScreen).toBeTruthy();
        done();
      });
  });

  it("onScreen returns false if whole of element is off screen", () => {
    var scrollAnimation = createScrollAnimationOffScreen({animateIn: "zoomIn"});
    const top = scrollAnimation.getElementTop(scrollAnimation.node);
    const bottom = top + scrollAnimation.node.clientHeight;
    expect(scrollAnimation.onScreen(top, bottom)).toBeFalsy();
  });

  it("onScreen returns true if part of element is on screen", (done) => {
    var scrollAnimation = createScrollAnimationOffScreen({animateIn: "zoomIn"});
    const top = scrollAnimation.getElementTop(scrollAnimation.node);
    const bottom = top + scrollAnimation.node.clientHeight;
    scrollIntoCompleteView(scrollAnimation);
    waitFor(() => {return scrollAnimation.onScreen(top, bottom)}, () => {
      expect(scrollAnimation.onScreen(top, bottom)).toBeTruthy();
      done();
    });
  });

  it("isAboveScreen returns true if bottom of element is above top of screen", (done) => {
    var scrollAnimation = createScrollAnimationOffScreen({animateIn: "zoomIn"});
    scrollToBottom();
    waitFor(() => {return scrollAnimation.isAboveScreen(scrollAnimation.getElementTop(scrollAnimation.node) + scrollAnimation.node.clientHeight)}, () => {
      expect(scrollAnimation.isAboveScreen(scrollAnimation.getElementTop(scrollAnimation.node) + scrollAnimation.node.clientHeight)).toBeTruthy();
      done();
    });
  });

  it("isAboveScreen returns false if bottom of element is below top of screen", () => {
    var scrollAnimation = createScrollAnimationOffScreen({animateIn: "zoomIn"});
    expect(scrollAnimation.isAboveScreen()).toBeFalsy();
  });

  it("isBelowScreen returns true if top of element is below bottom of screen", () => {
    var scrollAnimation = createScrollAnimationOffScreen({animateIn: "zoomIn"});
    expect(scrollAnimation.isBelowScreen(scrollAnimation.getElementTop(scrollAnimation.node))).toBeTruthy();
  });

  it("isBelowScreen returns false if top of element is above bottom of screen", (done) => {
    var scrollAnimation = createScrollAnimationOffScreen({animateIn: "zoomIn"});
    scrollToBottom();
    waitFor(() => {return !scrollAnimation.isBelowScreen(scrollAnimation.getElementTop(scrollAnimation.node))}, () => {
      expect(scrollAnimation.isBelowScreen(scrollAnimation.getElementTop(scrollAnimation.node))).toBeFalsy();
      done();
    });
  });

  it("visibilityHasChanged should show any changes in visibility", () => {
    var scrollAnimation = createScrollAnimationOffScreen({animateIn: "zoomIn", animateOnce: true});
    var prevVis = {
      inViewport: false,
      onScreen: false
    };
    var nextVis = {
      inViewport: false,
      onScreen: false
    };
    expect(scrollAnimation.visibilityHasChanged(prevVis, nextVis)).toBeFalsy();

    prevVis.inViewport = true;
    expect(scrollAnimation.visibilityHasChanged(prevVis, nextVis)).toBeTruthy();

    prevVis.inViewport = false;
    prevVis.onScreen = true;
    expect(scrollAnimation.visibilityHasChanged(prevVis, nextVis)).toBeTruthy();
  });

  it("animateIn() unhides and adds animateIn class", (done) => {
    var scrollAnimation = createScrollAnimationOffScreen({animateIn: "zoomIn"});
    scrollAnimation.animateIn();
    setTimeout(() => {
      expect(scrollAnimation.state.classes).toContain("zoomIn");
      expect(scrollAnimation.state.style.opacity).toNotBe(0);
      done();
    }, 10);
  });

  it("animateIn() unhides and adds animateIn class after delay", (done) => {
    var scrollAnimation = createScrollAnimationOffScreen({animateIn: "zoomIn", delay: 500});
    scrollAnimation.animateIn();
    setTimeout(() => {
      expect(scrollAnimation.state.classes).toNotContain("zoomIn");
      expect(scrollAnimation.state.style.opacity).toBe(0);
      setTimeout(() => {
        expect(scrollAnimation.state.classes).toContain("zoomIn");
        expect(scrollAnimation.state.style.opacity).toNotBe(0);
        done();
      }, 100);
    }, 400);
  });

  it("animateOut() unhides and adds animateOut class", (done) => {
    var scrollAnimation = createScrollAnimationOffScreen({animateOut: "zoomOut", duration: 0.5});
    scrollAnimation.animateOut();
    setTimeout(() => {
      expect(scrollAnimation.state.classes).toContain("zoomOut");
      expect(scrollAnimation.state.style.opacity).toNotBe(0);
      done();
    }, 100);
  });

  it("animateOut() unhides and adds animateIn class after delay", (done) => {
    var scrollAnimation = createScrollAnimationOffScreen({animateOut: "zoomOut", delay: 500});
    scrollAnimation.animateOut();
    setTimeout(() => {
      expect(scrollAnimation.state.classes).toNotContain("zoomOut");
      expect(scrollAnimation.state.style.opacity).toBe(0);
      setTimeout(() => {
        expect(scrollAnimation.state.classes).toContain("zoomOut");
        expect(scrollAnimation.state.style.opacity).toNotBe(0);
        done();
      }, 100);
    }, 400);
  });

  it("when animateOut has finished, animateOut class is removed and style is set back to hidden", (done) => {
    var scrollAnimation = createScrollAnimationOffScreen({animateOut: "zoomOut", duration: 0.2});
    scrollAnimation.animateOut();
    setTimeout(() => {
      expect(scrollAnimation.state.classes).toContain("zoomOut");
      expect(scrollAnimation.state.style.opacity).toNotBe(0);
      setTimeout(() => {
        expect(scrollAnimation.state.classes).toNotContain("zoomOut");
        expect(scrollAnimation.state.style.opacity).toBe(0);
        done();
      }, 200)
    }, 10);
  });

  it("if animating out finished, but element is back in viewport, animateIn class should be given", (done) => {
    var scrollAnimation = createScrollAnimationOffScreen({animateIn: "zoomIn", animateOut: "zoomOut", duration: 0.2});
    scrollAnimation.animateOut();
    setTimeout(() => {
      expect(scrollAnimation.state.classes).toContain("zoomOut");
      expect(scrollAnimation.state.style.opacity).toNotBe(0);
      scrollIntoCompleteView(scrollAnimation);
      setTimeout(() => {
        expect(scrollAnimation.state.classes).toContain("zoomIn");
        expect(scrollAnimation.state.style.opacity).toNotBe(0);
        done();
      }, 250);
    }, 10);
  });

  it("callback executed after animateOut finished", (done) => {
    var scrollAnimation = createScrollAnimationOffScreen({animateOut: "zoomOut"});
    scrollAnimation.animateOut(() => {
      expect(scrollAnimation.state.classes).toNotContain("zoomOut");
      expect(scrollAnimation.state.style.opacity).toBe(0);
      done();
    });
  });

  it("callback executed after animateIn finished", (done) => {
    var scrollAnimation = createScrollAnimationOffScreen({animateIn: "zoomIn"});
    scrollAnimation.animateIn(() => {
      expect(scrollAnimation.state.classes).toNotContain("animateIn");
      expect(scrollAnimation.state.style.opacity).toNotBe(0);
      done();
    });
  });

  it("while animating in, this.animating is set to true", (done) => {
    var scrollAnimation = createScrollAnimationOffScreen({animateIn: "zoomIn", duration: 0.2});
    scrollAnimation.animateIn()
    setTimeout(() => {
      expect(scrollAnimation.animating).toBeTruthy();
      setTimeout(() => {
        expect(scrollAnimation.animating).toBeFalsy();
        done();
      }, 200);
    }, 10);
  });

  it("while animating out, this.animating is set to true", (done) => {
    var scrollAnimation = createScrollAnimationOffScreen({animateOut: "zoomOut", duration: 0.2});
    scrollAnimation.animateOut()
    setTimeout(() => {
      expect(scrollAnimation.animating).toBeTruthy();
      setTimeout(() => {
        expect(scrollAnimation.animating).toBeFalsy();
        done();
      }, 200);
    }, 10);
  });

  it("has class matching the 'animateIn' prop when in viewport", (done) => {
    var scrollAnimation = createScrollAnimationOffScreen({animateIn: "zoomIn"});
    scrollIntoCompleteView(scrollAnimation);
    waitFor(() => {return scrollAnimation.node.classList.contains("zoomIn")},
      () => {
        expect(scrollAnimation.node.className).toContain("zoomIn");
        done();
      });
  });

  it("has animated class when not in view", () => {
    var scrollAnimation = createScrollAnimationOffScreen({animateIn: "zoomIn"});
    expect(scrollAnimation.node.className).toBe("animated");
  });

  it("does not have class matching the 'animateIn' prop when on screen but not in viewport", (done) => {
    var scrollAnimation = createScrollAnimationOffScreen({animateIn: "zoomIn", offset: 100});
    expect(scrollAnimation.node.className).toNotContain("zoomIn");
    scrollIntoPartialViewTop(scrollAnimation);
    setTimeout(function() {
      expect(scrollAnimation.node.className).toNotContain("zoomIn");
      done();
    }, 200);
  });

  it("class matching 'animateIn' is added when animation is scrolled into complete view", (done) => {
    var scrollAnimation = createScrollAnimationOffScreen({animateIn: "zoomIn"});
    expect(scrollAnimation.node.className).toNotContain("zoomIn");
    scrollIntoCompleteView(scrollAnimation);
    waitFor(() => {return scrollAnimation.node.classList.contains("zoomIn")},
      () => {
        expect(scrollAnimation.node.className).toContain("zoomIn");
        done();
      });
  });

  it("class matching 'animateIn' is removed when scrolled out of view to the top", (done) => {
    var scrollAnimation = createScrollAnimationOffScreen({animateIn: "zoomIn"});
    expect(scrollAnimation.node.className).toNotContain("zoomIn");
    scrollIntoCompleteView(scrollAnimation);
    waitFor(() => {return scrollAnimation.node.classList.contains("zoomIn")},
      () => {
        expect(scrollAnimation.node.className).toContain("zoomIn");
        waitFor(() => {return !scrollAnimation.animating},
          () => {
            scrollToBottom();
            waitFor(() => {return !scrollAnimation.node.classList.contains("zoomIn")},
              () => {
                expect(scrollAnimation.node.className).toNotContain("zoomIn");
                done();
              });
          });
      });
  });

  it("class matching 'animateIn' is removed when scrolled out of view to the bottom", (done) => {
    var scrollAnimation = createScrollAnimationOffScreen({animateIn: "zoomIn"});
    expect(scrollAnimation.node.className).toNotContain("zoomIn");
    scrollIntoCompleteView(scrollAnimation);
    waitFor(() => {return scrollAnimation.node.classList.contains("zoomIn")},
      () => {
        expect(scrollAnimation.node.className).toContain("zoomIn");
        waitFor(() => {return !scrollAnimation.animating},
          () => {
            scrollToTop();
            waitFor(() => {return !scrollAnimation.node.classList.contains("zoomIn")},
              () => {
                expect(scrollAnimation.node.className).toNotContain("zoomIn");
                done();
              });
          });
      });
  });

  it("is visible when in viewport", (done) => {
    var scrollAnimation = createScrollAnimationOffScreen({animateIn: "zoomInTest"});
    scrollIntoCompleteView(scrollAnimation);
    waitFor(() => {return scrollAnimation.node.style.opacity !== '0'},
      () => {
        expect(scrollAnimation.node.style.opacity).toNotBe('0');
        done();
      });
  });

  it("is hidden when not in view", () => {
    var scrollAnimation = createScrollAnimationOffScreen({animateIn: "zoomIn"});
    expect(scrollAnimation.node.style.opacity).toBe('0');
  });

  it("is invisible when on screen but not in viewport and already invisible", (done) => {
    var scrollAnimation = createScrollAnimationOffScreen({animateIn: "zoomIn", offset: 100});
    scrollIntoPartialViewTop(scrollAnimation);
    setTimeout(function() {
      expect(scrollAnimation.node.style.opacity).toBe('0');
      done()
    }, 200)
  });

  it("when visible and scrolled partially out of viewport, class matching 'animateOut' is added", (done) => {
    var scrollAnimation = createScrollAnimationOffScreen({animateIn: "zoomIn", animateOut: "zoomOut", offset: 100});
    scrollIntoCompleteView(scrollAnimation);
    waitFor(() => {return scrollAnimation.node.classList.contains("zoomIn")},
      () => {
        waitFor(() => {return !scrollAnimation.animating},
          () => {
            scrollIntoPartialViewTop(scrollAnimation);
            waitFor(() => {return scrollAnimation.node.classList.contains("zoomOut")},
              () => {
                expect(scrollAnimation.node.className).toNotContain("zoomIn");
                expect(scrollAnimation.node.className).toContain("zoomOut");
                done();
              });
          });
      });
  });

  it("element remains visible when on screen, not in viewport, but already visible", (done) => {
    var scrollAnimation = createScrollAnimationOffScreen({animateIn: "zoomIn", offset: 100});
    scrollIntoCompleteView(scrollAnimation);
    waitFor(() => {return scrollAnimation.node.style.visibility === ""},
      () => {
        scrollIntoPartialViewTop(scrollAnimation);
        setTimeout(function() {
          expect(scrollAnimation.node.style.visibility).toBe("");
          done()
        }, 200);
      });
  });

  it("animation-duration is 1s by default", () => {
    ReactDOM.render(<ScrollAnimation animateIn="zoomIn"/>, myTestDiv);
    expect(document.getElementsByTagName("div")[1].style["animation-duration"]).toBe("1s");
  });

  it("animation-duration matches duration prop if set", () => {
    ReactDOM.render(<ScrollAnimation animateIn="zoomIn" duration={2}/>, myTestDiv);
    expect(document.getElementsByTagName("div")[1].style["animation-duration"]).toBe("2s");
  });

  it("if animation changes size or position of component, scrolling slightly at this time should not stop animation", (done) => {
    var scrollAnimation = createScrollAnimationOffScreen({animateIn: "bounceInDown", duration: 5});
    var initialTop = scrollAnimation.node.getBoundingClientRect().top;
    scrollIntoCompleteView(scrollAnimation);
    waitFor(() => {return scrollAnimation.node.classList.contains("bounceInDown")},
      () => {
        expect(scrollAnimation.node.getBoundingClientRect().top).toBeLessThan(initialTop);
        window.scrollTo(0, window.pageYOffset + 4);
        setTimeout(function() {
          expect(scrollAnimation.node.className).toContain("bounceInDown");
          done();
        }, 200);
      });
  });

  it("if set with initiallyVisible prop then is visible when created off screen", () => {
    var scrollAnimation = createScrollAnimationOffScreen({animateIn: "bounceInDown", initiallyVisible: true});
    expect(scrollAnimation.node.style.opacity).toBe('1');
  });

  it("if the element is bigger than the screen then animation happens when element enters viewport", (done) => {
    var scrollAnimation = createScrollAnimationOffScreen({animateIn: "bounceInDown", size: 2000});
    scrollLargeElementSoOverHalfCoversPage(scrollAnimation);
    waitFor(() => {return scrollAnimation.node.classList.contains("bounceInDown")},
      () => {
        expect(scrollAnimation.node.className).toContain("bounceInDown");
        expect(scrollAnimation.node.style.opacity).toNotBe('0');
        done();
      });
  });

  it("if element is created with 'delay' property, animation is delayed when scrolled into view", (done) => {
    var scrollAnimation = createScrollAnimationOffScreen({animateIn: "bounceInDown", delay: 200});
    scrollIntoCompleteView(scrollAnimation);
    setTimeout(function() {
      expect(scrollAnimation.node.className).toNotContain("bounceInDown");
      waitFor(() => {return scrollAnimation.node.classList.contains("bounceInDown")},
        () => {
          expect(scrollAnimation.node.className).toContain("bounceInDown");
          done();
        }, 50);
    }, 199);
  });

  it("if element is created with 'delay' property, and element is scrolled out of view, timeouts are cancelled", (done) => {
    var scrollAnimation = createScrollAnimationOffScreen({animateIn: "bounceInDown", delay: 200});
    scrollIntoCompleteView(scrollAnimation);
    setTimeout(function() {
      scrollToTop();
      setTimeout(function() {
        expect(scrollAnimation.node.className).toNotContain("bounceInDown");
        done();
      }, 50);
    }, 199);
  });

  it("When 'animateOnce' is set, animating is never set back to false after first animation", (done) => {
    var scrollAnimation = createScrollAnimationOffScreen({animateIn: "zoomIn", animateOnce: true });
    expect(scrollAnimation.node.style.opacity).toBe('0');
    expect(scrollAnimation.node.className).toNotContain("zoomIn");
    expect(scrollAnimation.animating).toBeFalsy();
    scrollIntoCompleteView(scrollAnimation);
    waitFor(() => {return scrollAnimation.node.classList.contains("zoomIn")},
      () => {
        expect(scrollAnimation.node.className).toContain("zoomIn");
        expect(scrollAnimation.node.style.opacity).toNotBe('0');
        expect(scrollAnimation.animating).toBeTruthy();
        scrollToTop();
        ensureNotSatisfied(() => {return scrollAnimation.animating === false},
          () => {
            expect(scrollAnimation.animating).toBeTruthy();
            expect(scrollAnimation.node.style.opacity).toNotBe('0');
            done();
          }
        );
      }
    );
  });

  it("executes afterAnimatedIn callback when scrolled away mid animation, with visible.onScreen and visible.inViewport equal to false", (done) => {
    var neverSetToTrue = false;
    var scrollAnimation = createScrollAnimationOffScreen({
      animateIn: "zoomIn",
      duration: 0.1,
      afterAnimatedIn: (visible) => {
        expect(visible.onScreen).toBeFalsy();
        expect(visible.inViewport).toBeFalsy();
        done();
      }
    });
    expect(scrollAnimation.node.style.opacity).toBe('0');
    expect(scrollAnimation.node.className).toNotContain("zoomIn");
    scrollIntoCompleteView(scrollAnimation);
    waitFor(() => {return scrollAnimation.node.classList.contains("zoomIn")},
      () => {
        scrollToTop();
      }
    );
  });

  it("executes afterAnimatedOut callback when scrolled away mid animation, with visible.onScreen and visible.inViewport equal to false", (done) => {
    var neverSetToTrue = false;
    var scrollAnimation = createScrollAnimationOffScreen({
      animateIn: "zoomIn",
      animateOut: "zoomOut",
      duration: 0.1,
      afterAnimatedOut: (visible) => {
        expect(visible.onScreen).toBeFalsy();
        expect(visible.inViewport).toBeFalsy();
        done();
      },
      offset: 100
    });
    expect(scrollAnimation.node.style.opacity).toBe('0');
    expect(scrollAnimation.node.className).toNotContain("zoomOut");
    scrollIntoCompleteView(scrollAnimation);
    waitFor(() => {return scrollAnimation.node.classList.contains("zoomIn")},
      () => {
        waitFor(() => {return !scrollAnimation.animating},
          () => {
            scrollIntoPartialViewTop(scrollAnimation);
            waitFor(() => {return scrollAnimation.node.classList.contains("zoomOut")},
              () => {
                scrollToTop();
              }
            );
          }
        );
      }
    );
  });

  it("executes afterAnimatedIn callback and visible.onScreen and visible.inViewport equal to true", (done) => {
    var scrollAnimation = createScrollAnimationOffScreen({
      animateIn: "zoomIn",
      afterAnimatedIn: (visible) => {
        expect(visible.inViewport).toBeTruthy();
        expect(visible.onScreen).toBeTruthy();
        done();
      }
    });
    expect(scrollAnimation.node.style.opacity).toBe('0');
    expect(scrollAnimation.node.className).toNotContain("zoomIn");
    scrollIntoCompleteView(scrollAnimation);
  });

  it("executes afterAnimatedOut callback and visible.onScreen and visible.inViewport equal to true", (done) => {
    var neverSetToTrue = false;
    var scrollAnimation = createScrollAnimationOffScreen({
      animateIn: "zoomIn",
      animateOut: "zoomOut",
      afterAnimatedOut: (visible) => {
        expect(visible.inViewport).toBeTruthy();
        expect(visible.onScreen).toBeTruthy();
        done();
      },
      offset: 100
    });
    expect(scrollAnimation.node.style.opacity).toBe('0');
    expect(scrollAnimation.node.className).toNotContain("zoomOut");
    scrollIntoCompleteView(scrollAnimation);
    waitFor(() => {return scrollAnimation.node.classList.contains("zoomIn")},
      () => {
        waitFor(() => {return !scrollAnimation.animating},
          () => {
            scrollIntoPartialViewTop(scrollAnimation);
            waitFor(() => {return scrollAnimation.node.classList.contains("zoomOut")},
              () => {
                scrollIntoCompleteView(scrollAnimation);
              }
            );
          }
        );
      }
    );
  });

  it("executes afterAnimatedIn callback and visible.onScreen is true and visible.inViewport is false when only visible partially", (done) => {
    var scrollAnimation = createScrollAnimationOffScreen({
      animateIn: "zoomIn",
      afterAnimatedIn: (visible) => {
        expect(visible.onScreen).toBeTruthy();
        expect(visible.inViewport).toBeFalsy();
        done();
      },
      offset: 100
    });
    expect(scrollAnimation.node.style.opacity).toBe('0');
    expect(scrollAnimation.node.className).toNotContain("zoomIn");
    scrollIntoCompleteView(scrollAnimation);
    waitFor(() => {return scrollAnimation.node.classList.contains("zoomIn")},
      () => {
        scrollIntoPartialViewTop(scrollAnimation);
      }
    );
  });

  it("executes afterAnimatedOut callback when partially visible and visible.onScreen is true and visible.inViewport is false", (done) => {
    var neverSetToTrue = false;
    var scrollAnimation = createScrollAnimationOffScreen({
      animateIn: "zoomIn",
      animateOut: "zoomOut",
      afterAnimatedOut: (visible) => {
        expect(visible.onScreen).toBeTruthy();
        expect(visible.inViewport).toBeFalsy();
        done();
      },
      offset: 100
    });
    expect(scrollAnimation.node.style.opacity).toBe('0');
    expect(scrollAnimation.node.className).toNotContain("zoomOut");
    scrollIntoCompleteView(scrollAnimation);
    waitFor(() => {return scrollAnimation.node.classList.contains("zoomIn")},
      () => {
        waitFor(() => {return !scrollAnimation.animating}, 
          () => {
            scrollIntoPartialViewTop(scrollAnimation);
          }
        );
      }
    );
  });

  it("does not execute callback when only partially in view", (done) => {
    var neverSetToTrue = false;
    var scrollAnimation = createScrollAnimationOffScreen({
      animateIn: "zoomIn",
      afterAnimatedIn: () => {
        neverSetToTrue = true;
      },
      offset: 100
    });
    expect(scrollAnimation.node.style.opacity).toBe('0');
    expect(scrollAnimation.node.className).toNotContain("zoomIn");
    scrollIntoPartialViewTop(scrollAnimation);
    ensureNotSatisfied(() => {return neverSetToTrue}, () => {done();}, 1500);
  });

  it("callbacks can run twice", (done) => {
    var runTimes = 0
    var scrollAnimation = createScrollAnimationOffScreen({
      animateIn: "zoomIn",
      afterAnimatedIn: (visible) => {
        runTimes++;
        if (runTimes == 2) {
          expect(runTimes).toBe(2);
          done();
        } else {
          scrollToTop();
          waitFor(() => {return !scrollAnimation.node.classList.contains("zoomIn")},
            () => {
              scrollIntoCompleteView(scrollAnimation);
            }
          );
        }
      }
    });
    expect(scrollAnimation.node.style.opacity).toBe('0');
    expect(scrollAnimation.node.className).toNotContain("zoomIn");
    scrollIntoCompleteView(scrollAnimation);
  });

  it("callback doesn't run twice when animateOnce specified", (done) => {
    var runTimes = 0
    var scrollAnimation = createScrollAnimationOffScreen({
      animateIn: "zoomIn",
      animateOnce: true,
      afterAnimatedIn: (visible) => {
        runTimes++;
        scrollToTop();
        waitFor(() => {return window.pageYOffset === 0},
          () => {
            scrollIntoCompleteView(scrollAnimation);
            ensureNotSatisfied(() => {return runTimes >= 2}, () => {done();}, 1500);
          }
        );
      }
    });
    expect(scrollAnimation.node.style.opacity).toBe('0');
    expect(scrollAnimation.node.className).toNotContain("zoomIn");
    scrollIntoCompleteView(scrollAnimation);
  });

  it("after animating out the animate out class is removed", (done) => {
    var scrollAnimation = createScrollAnimationOffScreen({animateIn: "zoomIn", animateOut: "zoomOut", offset: 100});
    scrollIntoCompleteView(scrollAnimation);
    waitFor(() => {return scrollAnimation.node.classList.contains("zoomIn")},
      () => {
        waitFor(() => {return !scrollAnimation.animating},
          () => {
            scrollIntoPartialViewTop(scrollAnimation);
            waitFor(() => {return !scrollAnimation.node.classList.contains("zoomIn")},
              () => {
                expect(scrollAnimation.node.className).toNotContain("zoomIn");
                expect(scrollAnimation.node.className).toContain("zoomOut");
                waitFor(() => {return !scrollAnimation.node.classList.contains("zoomOut")},
                  () => {
                    expect(scrollAnimation.node.className).toNotContain("zoomOut");
                    done();
                  }
                );
              }
            );
          }
        );
      });
  });

  it("passes the style prop to the rendered dom element", () => {
    ReactDOM.render(<ScrollAnimation animateIn="fadeIn" duration={2} style={{color: "red"}}/>, myTestDiv);
    expect(document.getElementsByTagName("div")[1].style["color"]).toBe("red");
  });

  it("Scrollable element is onscreen but ScrollAnimation is not in view in scrollable element, animation should not be triggered", () => {
    ReactDOM.render(<div id="scrolly-div" style={{height:500 + "px", overflow:"scroll"}} >
      <div style={{height:600 + "px"}} />
      <div id="animation-div" />
      <div style={{height:600 + "px"}} />
    </div>, myTestDiv);
    var scrollAnimation = ReactDOM.render(<ScrollAnimation scrollableParentSelector="#scrolly-div" animateIn="fadeIn"/>, document.getElementById("animation-div"));
    expect(scrollAnimation.node.className).toNotContain("fadeIn");
  });

  it("Scrollable element is on screen and ScrollAnimation is in view in scrollable element, animation should be triggered", (done) => {
    ReactDOM.render(<div id="scrolly-div" style={{height:500 + "px", overflow:"scroll"}} >
      <div style={{height:600 + "px"}} />
      <div id="animation-div" />
      <div style={{height:600 + "px"}} />
    </div>, myTestDiv);
    var scrollyDiv = document.getElementById("scrolly-div");
    var scrollAnimation = ReactDOM.render(<ScrollAnimation scrollableParentSelector="#scrolly-div" animateIn="fadeIn"/>, document.getElementById("animation-div"));
    scrollyDiv.scrollTop = 400;
    waitFor(() => {return scrollAnimation.animating}, () => {
      expect(scrollAnimation.node.className).toContain("fadeIn");
      done();
    });
  });

  it("When not passed scrollableParentSelector the scrollableParent is the window object", () => {
    var scrollAnimation = ReactDOM.render(<ScrollAnimation />, myTestDiv);
    expect(scrollAnimation.scrollableParent).toBe(window);
  });

  it("When passed scrollableParentSelector the scrollableParent is object found by the selector", () => {
    ReactDOM.render(<div id="scrolly-div" style={{height:500 + "px"}} >
      <div style={{height:600 + "px"}} />
      <div id="animation-div" />
      <div style={{height:600 + "px"}} />
    </div>, myTestDiv);
    var scrollyDiv = document.getElementById("scrolly-div");
    var scrollAnimation = ReactDOM.render(<ScrollAnimation scrollableParentSelector="#scrolly-div" animateIn="fadeIn"/>, document.getElementById("animation-div"));
    expect(scrollAnimation.scrollableParent).toBe(scrollyDiv);
  });

  function createScrollAnimationOffScreen(props) {
    var size = props.size ? props.size : 100;
    ReactDOM.render(<div><div style={{height:10000 + "px"}} /><div id="test"/><div style={{height:10000 + "px"}} /></div>, myTestDiv);
    var div = document.getElementById("test");
    var offset = props.offset ? props.offset : 0;
    var duration = props.duration ? props.duration : 0.1;
    var delay = props.delay ? props.delay : 0;
    var callback = props.afterAnimatedIn ? props.afterAnimatedIn : null;
    var afterAnimatedOut = props.afterAnimatedOut ? props.afterAnimatedOut : null;
    return ReactDOM.render(<ScrollAnimation afterAnimatedOut={afterAnimatedOut} afterAnimatedIn={callback} animateOnce={props.animateOnce} delay={delay} initiallyVisible={props.initiallyVisible} duration={duration} animateIn={props.animateIn} animateOut={props.animateOut} offset={offset}><div style={{height:size + "px"}}/></ScrollAnimation>, div);
  }

  function scrollIntoCompleteView(elem) {
    var top = elem.node.getBoundingClientRect().top + window.pageYOffset;
    var elemHeight = elem.node.getBoundingClientRect().height;
    var offset = elem.props.offset;
    window.scrollTo(0, top - offset);
  }

  function scrollLargeElementSoOverHalfCoversPage(elem) {
    var top = elem.node.getBoundingClientRect().top + window.pageYOffset;
    window.scrollTo(0, top - 20);
  }

  function scrollIntoPartialViewTop(elem) {
    var top = elem.node.getBoundingClientRect().top + window.pageYOffset;
    window.scrollTo(0, top - window.innerHeight + 2);
  }

  function scrollIntoPartialViewBottom(elem) {
    var bottom = elem.node.getBoundingClientRect().bottom + window.pageYOffset;
    window.scrollTo(0, bottom - 2);
  }

  function scrollToTop() {
    window.scrollTo(0, 0);
  }

  function scrollToBottom() {
    window.scrollTo(0,document.body.scrollHeight);
  }

  function waitFor(condition, callback, timeToWait = 1000, time = 0) {
    if (timeToWait - time < 0) {
      throw new Error("Timed out waiting for: " + condition);
    } else if (!condition()) {
      setTimeout(function() {
        time += 10;
        waitFor(condition, callback, timeToWait, time);
      }, 10);
    } else {
      callback();
    }
  }

  function ensureNotSatisfied(condition, callback, timeToWait = 1000, time = 0) {
    if (timeToWait - time < 0) {
      callback();
    } else if (!condition()) {
      setTimeout(function() {
        time += 10;
        ensureNotSatisfied(condition, callback, timeToWait, time);
      }, 10);
    } else {
      throw new Error("Condition was satisfied: " + condition);
    }
  }
});
