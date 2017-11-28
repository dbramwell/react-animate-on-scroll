import React from "react";
import ReactDOM from "react-dom";
import "animate.css/animate.min.css";
var expect = require("expect");
import ScrollAnimation from "./scroll-animation";

describe("ScrollAnimation -", function () {

  var myTestDiv;

  beforeEach(() => {
    document.body.innerHTML += "<div id='myDiv'></div>";
    myTestDiv = document.getElementById("myDiv");
    window.scrollTo(0, 0);
  });

  it("renders without problems", function () {
    var root = ReactDOM.render(<ScrollAnimation />, myTestDiv);
    expect(root).toExist();
  });

  it("has class matching the 'animateIn' prop when in view", (done) => {
    var scrollAnimation = createScrollAnimationOffScreen({animateIn: "zoomIn"});
    scrollIntoCompleteView(scrollAnimation);
    waitFor(() => {return scrollAnimation.node.className.includes("zoomIn")},
      () => {
        expect(scrollAnimation.node.className).toContain("zoomIn");
        done();
      });
  });

  it("has animated class when in view", (done) => {
    var scrollAnimation = createScrollAnimationOffScreen({animateIn: "zoomIn"});
    scrollIntoCompleteView(scrollAnimation);
    waitFor(() => {return scrollAnimation.node.className.includes("zoomIn")},
      () => {
        expect(scrollAnimation.node.className).toContain("zoomIn");
        done();
      });
  });

  it("has animated class when not in view", () => {
    var scrollAnimation = createScrollAnimationOffScreen({animateIn: "zoomIn"});
    expect(scrollAnimation.node.className).toBe("animated");
  });

  it("does not have class matching the 'animateIn' prop when not in complete view", (done) => {
    var scrollAnimation = createScrollAnimationOffScreen({animateIn: "zoomIn"});
    expect(scrollAnimation.node.className).toNotContain("zoomIn");
    scrollIntoPartialViewTop(scrollAnimation);
    setTimeout(function() {
      expect(scrollAnimation.node.className).toNotContain("zoomIn");
      done();
    }, 200);
  });

  it("class matching 'animateIn' is added when animation is scrolled into comlete view", (done) => {
    var scrollAnimation = createScrollAnimationOffScreen({animateIn: "zoomIn"});
    expect(scrollAnimation.node.className).toNotContain("zoomIn");
    scrollIntoCompleteView(scrollAnimation);
    waitFor(() => {return scrollAnimation.node.className.includes("zoomIn")},
      () => {
        expect(scrollAnimation.node.className).toContain("zoomIn");
        done();
      });
  });

  it("class matching 'animateIn' is removed when scrolled out of view to the top", (done) => {
    var scrollAnimation = createScrollAnimationOffScreen({animateIn: "zoomIn"});
    expect(scrollAnimation.node.className).toNotContain("zoomIn");
    scrollIntoCompleteView(scrollAnimation);
    waitFor(() => {return scrollAnimation.node.className.includes("zoomIn")},
      () => {
        scrollToBottom();
        waitFor(() => {return !scrollAnimation.node.className.includes("zoomIn")},
          () => {
            expect(scrollAnimation.node.className).toNotContain("zoomIn");
            done();
          });
      });
  });

  it("class matching 'animateIn' is removed when scrolled out of view to the bottom", (done) => {
    var scrollAnimation = createScrollAnimationOffScreen({animateIn: "zoomIn"});
    expect(scrollAnimation.node.className).toNotContain("zoomIn");
    scrollIntoCompleteView(scrollAnimation);
    waitFor(() => {return scrollAnimation.node.className.includes("zoomIn")},
      () => {
        scrollToTop();
        waitFor(() => {return !scrollAnimation.node.className.includes("zoomIn")},
          () => {
            expect(scrollAnimation.node.className).toNotContain("zoomIn");
            done();
          });
      });
  });

  it("is visible when in view", (done) => {
    var scrollAnimation = createScrollAnimationOffScreen({animateIn: "zoomInTest"});
    scrollIntoCompleteView(scrollAnimation);
    waitFor(() => {return !scrollAnimation.node.style.visibility.includes("hidden")},
      () => {
        expect(scrollAnimation.node.style.visibility).toNotBe("hidden");
        done();
      });
  });

  it("is hidden when not in view", () => {
    var scrollAnimation = createScrollAnimationOffScreen({animateIn: "zoomIn"});
    expect(scrollAnimation.node.style.visibility).toBe("hidden");
  });

  it("is invisible when partly in view and already invisible", (done) => {
    var scrollAnimation = createScrollAnimationOffScreen({animateIn: "zoomIn"});
    scrollIntoPartialViewTop(scrollAnimation);
    setTimeout(function() {
      expect(scrollAnimation.node.style.visibility).toBe("hidden");
      done()
    }, 200)
  });

  it("when visible and scrolled partially out of view, class matching 'animateOut' is added", (done) => {
    var scrollAnimation = createScrollAnimationOffScreen({animateIn: "zoomIn", animateOut: "zoomOut"});
    scrollIntoCompleteView(scrollAnimation);
    waitFor(() => {return scrollAnimation.node.className.includes("zoomIn")},
      () => {
        scrollIntoPartialViewTop(scrollAnimation);
        waitFor(() => {return !scrollAnimation.node.className.includes("zoomIn")},
          () => {
            expect(scrollAnimation.node.className).toNotContain("zoomIn");
            expect(scrollAnimation.node.className).toContain("zoomOut");
            done();
          });
      });
  });

  it("is visible when partly in view and already visible", (done) => {
    var scrollAnimation = createScrollAnimationOffScreen({animateIn: "zoomIn"});
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
    waitFor(() => {return scrollAnimation.node.className.includes("bounceInDown")},
      () => {
        expect(scrollAnimation.node.getBoundingClientRect().top).toBeLessThan(initialTop);
        window.scrollTo(0, window.scrollY + 4);
        setTimeout(function() {
          expect(scrollAnimation.node.className).toContain("bounceInDown");
          done();
        }, 200);
      });
  });

  it("if set with initiallyVisible prop then is visible when created off screen", () => {
    var scrollAnimation = createScrollAnimationOffScreen({animateIn: "bounceInDown", initiallyVisible: true});
    expect(scrollAnimation.node.style.visibility).toBe("");
  });

  it("if the element is bigger than the screen then animation happens when element covers more than 50% of the screen", (done) => {
    var scrollAnimation = createScrollAnimationOffScreen({animateIn: "bounceInDown", size: 2000});
    scrollLargeElementSoOverHalfCoversPage(scrollAnimation);
    waitFor(() => {return scrollAnimation.node.className.includes("bounceInDown")},
      () => {
        expect(scrollAnimation.node.className).toContain("bounceInDown");
        expect(scrollAnimation.node.style.visibility).toNotBe("hidden");
        done();
      });
  });

  it("if element is created with 'delay' property, animation is delayed when scrolled into view", (done) => {
    var scrollAnimation = createScrollAnimationOffScreen({animateIn: "bounceInDown", delay: 200});
    scrollIntoCompleteView(scrollAnimation);
    setTimeout(function() {
      expect(scrollAnimation.node.className).toNotContain("bounceInDown");
      waitFor(() => {return scrollAnimation.node.className.includes("bounceInDown")},
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

  it("if element is given animate with delay, when scrolled out of view animation class is removed instantly", (done) => {
    var scrollAnimation = createScrollAnimationOffScreen({animateIn: "fadeIn", delay: 200});
    scrollIntoCompleteView(scrollAnimation);
    waitFor(() => {return scrollAnimation.node.className.includes("fadeIn")},
      () => {
        scrollToTop();
        waitFor(() => {return !scrollAnimation.node.className.includes("fadeIn")},
          () => {
            expect(scrollAnimation.node.className).toNotContain("fadeIn");
            expect(scrollAnimation.node.style.visibility).toBe("hidden");
            done();
          }, 100);
      });
  });

  it("only animates once with 'animateOnce' property", (done) => {
    var scrollAnimation = createScrollAnimationOffScreen({animateIn: "zoomIn", animateOnce: true });
    expect(scrollAnimation.node.style.visibility).toBe("hidden");
    expect(scrollAnimation.node.className).toNotContain("zoomIn");
    scrollIntoCompleteView(scrollAnimation);
    waitFor(() => {return scrollAnimation.node.className.includes("zoomIn")},
      () => {
        expect(scrollAnimation.node.className).toContain("zoomIn");
        expect(scrollAnimation.node.style.visibility).toNotBe("hidden");
        scrollToTop();
        ensureNotSatisfied(() => {return !scrollAnimation.node.className.includes("zoomIn")},
          () => {
            expect(scrollAnimation.node.className).toContain("zoomIn");
            expect(scrollAnimation.node.style.visibility).toNotBe("hidden");
            done();
          }
        );
      }
    );
  });

  it("executes afterAnimatedIn callback when scrolled away mid animation, with visible.partially and visible.completely equal to false", (done) => {
    var neverSetToTrue = false;
    var scrollAnimation = createScrollAnimationOffScreen({
      animateIn: "zoomIn",
      duration: 1,
      afterAnimatedIn: (visible) => {
        expect(visible.partially).toBeFalsy();
        expect(visible.completely).toBeFalsy();
        done();
      }
    });
    expect(scrollAnimation.node.style.visibility).toBe("hidden");
    expect(scrollAnimation.node.className).toNotContain("zoomIn");
    scrollIntoCompleteView(scrollAnimation);
    waitFor(() => {return scrollAnimation.node.className.includes("zoomIn")},
      () => {
        scrollToTop();
      }
    );
  });

  it("executes afterAnimatedOut callback when scrolled away mid animation, with visible.partially and visible.completely equal to false", (done) => {
    var neverSetToTrue = false;
    var scrollAnimation = createScrollAnimationOffScreen({
      animateIn: "zoomIn",
      animateOut: "zoomOut",
      duration: 1,
      afterAnimatedOut: (visible) => {
        expect(visible.partially).toBeFalsy();
        expect(visible.completely).toBeFalsy();
        done();
      }
    });
    expect(scrollAnimation.node.style.visibility).toBe("hidden");
    expect(scrollAnimation.node.className).toNotContain("zoomOut");
    scrollIntoCompleteView(scrollAnimation);
    waitFor(() => {return scrollAnimation.node.className.includes("zoomIn")},
      () => {
        scrollIntoPartialViewTop(scrollAnimation);
        waitFor(() => {return scrollAnimation.node.className.includes("zoomOut")},
          () => {
            scrollToTop();
          }
        );
      }
    );
  });

  it("executes afterAnimatedIn callback and visible.partially and visible.completely equal to true", (done) => {
    var scrollAnimation = createScrollAnimationOffScreen({
      animateIn: "zoomIn",
      afterAnimatedIn: (visible) => {
        expect(visible.partially).toBeTruthy();
        expect(visible.completely).toBeTruthy();
        done();
      }
    });
    expect(scrollAnimation.node.style.visibility).toBe("hidden");
    expect(scrollAnimation.node.className).toNotContain("zoomIn");
    scrollIntoCompleteView(scrollAnimation);
  });

  it("executes afterAnimatedOut callback and visible.partially and visible.completely equal to true", (done) => {
    var neverSetToTrue = false;
    var scrollAnimation = createScrollAnimationOffScreen({
      animateIn: "zoomIn",
      animateOut: "zoomOut",
      duration: 1,
      afterAnimatedOut: (visible) => {
        expect(visible.partially).toBeTruthy();
        expect(visible.completely).toBeTruthy();
        done();
      }
    });
    expect(scrollAnimation.node.style.visibility).toBe("hidden");
    expect(scrollAnimation.node.className).toNotContain("zoomOut");
    scrollIntoCompleteView(scrollAnimation);
    waitFor(() => {return scrollAnimation.node.className.includes("zoomIn")},
      () => {
        scrollIntoPartialViewTop(scrollAnimation);
        waitFor(() => {return scrollAnimation.node.className.includes("zoomOut")},
          () => {
            scrollIntoCompleteView(scrollAnimation);
          }
        );
      }
    );
  });

  it("executes afterAnimatedIn callback and visible.partially is true and visible.completely is false when only visible partially", (done) => {
    var scrollAnimation = createScrollAnimationOffScreen({
      animateIn: "zoomIn",
      duration: 1,
      afterAnimatedIn: (visible) => {
        expect(visible.partially).toBeTruthy();
        expect(visible.completely).toBeFalsy();
        done();
      }
    });
    expect(scrollAnimation.node.style.visibility).toBe("hidden");
    expect(scrollAnimation.node.className).toNotContain("zoomIn");
    scrollIntoCompleteView(scrollAnimation);
    waitFor(() => {return scrollAnimation.node.className.includes("zoomIn")},
      () => {
        scrollIntoPartialViewTop(scrollAnimation);
      }
    );
  });

  it("executes afterAnimatedOut callback when partially visible and visible.partially is true and visible.completely is false", (done) => {
    var neverSetToTrue = false;
    var scrollAnimation = createScrollAnimationOffScreen({
      animateIn: "zoomIn",
      animateOut: "zoomOut",
      duration: 1,
      afterAnimatedOut: (visible) => {
        expect(visible.partially).toBeTruthy();
        expect(visible.completely).toBeFalsy();
        done();
      }
    });
    expect(scrollAnimation.node.style.visibility).toBe("hidden");
    expect(scrollAnimation.node.className).toNotContain("zoomOut");
    scrollIntoCompleteView(scrollAnimation);
    waitFor(() => {return scrollAnimation.node.className.includes("zoomIn")},
      () => {
        scrollIntoPartialViewTop(scrollAnimation);
      }
    );
  });

  it("does not execute callback when only partially in view", (done) => {
    var neverSetToTrue = false;
    var scrollAnimation = createScrollAnimationOffScreen({
      animateIn: "zoomIn",
      duration: 1,
      afterAnimatedIn: () => {
        neverSetToTrue = true;
      }
    });
    expect(scrollAnimation.node.style.visibility).toBe("hidden");
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
        console.log('Done ' + runTimes)
        if (runTimes == 2) {
          expect(runTimes).toBe(2);
          done();
        } else {
          scrollToTop();
          waitFor(() => {return !scrollAnimation.node.className.includes("zoomIn")},
            () => {
              scrollIntoCompleteView(scrollAnimation);
            }
          );
        }
      }
    });
    expect(scrollAnimation.node.style.visibility).toBe("hidden");
    expect(scrollAnimation.node.className).toNotContain("zoomIn");
    scrollIntoCompleteView(scrollAnimation);
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
