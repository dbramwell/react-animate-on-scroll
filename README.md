[![Travis](https://travis-ci.org/dbramwell/react-animate-on-scroll.svg?branch=master)](https://travis-ci.org/dbramwell/react-animate-on-scroll)

# React Animate On Scroll
React component to animate elements on scroll with [animate.css](https://daneden.github.io/animate.css/).
Inspired by [React-Scroll-Effect](https://github.com/anorudes/react-scroll-effects)

### [Demo](https://dbramwell.github.io/react-animate-on-scroll/)

## Install:

```
npm install react-animate-on-scroll --save
```
**If you want to use the animations from animate.css, be sure to include animate.css in someway in your project**
This can be done in a number of ways, eg:
```
npm install --save animate.css
```
and then importing in your project:
```
import "animate.css/animate.min.css";
```
Or by simply including a link to the file hosted by CDNJS:
```
<head>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.5.2/animate.min.css">
</head>
```

## Most Simple Use:

```
import ScrollAnimation from 'react-animate-on-scroll';
<ScrollAnimation animateIn="fadeIn">
  Some Text
</ScrollAnimation>
```
## Properties:
**offset** - default 150

The "viewport" is by default 150 pixels from the top and bottom of the screen. When part of an element is within the "viewport", animateIn is triggered. When no part of the element is in the "viewport", animateOut is triggered. This size of the "viewport" can be overridden by setting the offset property.

**animateIn**

Any css animation defined against a class, be it from [animate.css](https://daneden.github.io/animate.css/) or an animation that you have created yourself. The Animation triggers when the element enters the "viewport" (see offset property for more details on this).

**animateOut**

Any css animation defined against a class, be it from [animate.css](https://daneden.github.io/animate.css/) or an animation that you have created yourself. The Animation triggers when the element is leaving the "viewport" (see offset property for more details on this).

**duration** - default 1

Animation duration in seconds.

**initiallyVisible** - default false

Whether the element should be visible to begin with or not.

**delay** - default 0

How long to delay the animation for (in milliseconds) once it enters or leaves the view.

**animateOnce** - default false

Whether the element should only animate once or not.

**style** - default {}

A style object can be assigned to any ScrollAnimation component and will be passed to the rendered dom element. Its probably best to avoid manually setting animationDuration or opacity as the component will modify those attributes.

**scrollableParentSelector**

By default the code checks to see if the element is visible within the window. This can be changed to any other parent element of the ScrollAnimation by adding a css selector pointing to the parent that you wish to use.

**afterAnimatedIn**

Callback function to run once the animateIn animation has completed. Receives the visibility of the element at time of execution.
Example:
```
function(visible) {
  if (visible.inViewport) {
    // Part of the element is in the viewport (the area defined by the offset property)
  } else if (visible.onScreen) {
    // Part of the element is visible on the screen
  } else {
    // Element is no longer visible
  }
}
```

**afterAnimatedOut**

Callback function to run once the animateOut animation has completed. Receives the visibility of the element at time of execution.
Example:
```
function(visible) {
  if (visible.inViewport) {
    // Part of the element is in the viewport (the area defined by the offset property)
  } else if (visible.onScreen) {
    // Part of the element is visible on the screen
  } else {
    // Element is no longer visible
  }
}
```

**animatePreScroll** - default true

By default if a ScrollAnimation is in view as soon as a page loads, then the animation will begin. If you don't want the animation to being until the user scrolls, then set this to false.

## Changes:
### Version 2.1.0
* Can now use scrollableParentSelector to use ScrollAnimation within any scrolling parent element.
### Version 2.0.2
* ScrollAnimation components now accept style prop.
### Version 2.0.1
* animateOnce now works properly.
#### Version 2.0.0
* The "visible" object passed to the afterAnimatedIn and afterAnimatedOut callbacks has the properties "onScreen" which is true if the element is on the screen, and "inViewport", which is true if the element is in the viewport. visible.completely and visible.partially will no longer work.
* Should now work on mobile devices.
* Should work more consistently with dynamically sized elements (eg, images).
* Elements now "animateIn" when any part of them is in the viewport, not only when they are fully contained in the viewport.
* The viewport now has a default offset of 150px from the top and bottom of the screen, rather than 100px.

## Development:

In the project root:

### Install Dependencies:

```
npm install
```

### Run Tests:

There are some automated test cases with karma and a Chrome headless browser. I attempted to use Jest, and then to use PhantomJS, but could get neither to work with scroll events. To run them:

```
npm test
```

### Build the component:

```
gulp build
```

### Run the Demo project:

```
cd demo
npm install
npm install ..
npm start
```
