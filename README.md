[![Travis](https://travis-ci.org/dbramwell/react-animate-on-scroll.svg?branch=master)](https://travis-ci.org/dbramwell/react-animate-on-scroll)

# React Animate On Scroll
React component to animate elements on scroll with [animate.css](https://daneden.github.io/animate.css/).
Inspired by [React-Scroll-Effect](https://github.com/anorudes/react-scroll-effects)

### [Demo](https://dbramwell.github.io/react-animate-on-scroll/)

## Install:

```
npm install react-animate-on-scroll --save
```

## Most Simple Use:

```
import ScrollAnimation from 'react-animate-on-scroll';
<ScrollEffect animateIn="fadeIn">
  Some Text
</ScrollEffect>
```
## Properties:
**offset** - default 100

The "viewport" is by default 100 pixels from the top and bottom of the screen. When an element is completely contained within the "viewport", animateIn is triggered. When the element is leaving the "viewport", animateOut is triggered. This can be overridden by setting the offset property.

If the element is bigger than the viewport animateIn is triggered when the position of the top of the element is is less than the position of the middle of the screen plus the offset, and the position of the bottom of the element is greater than the middle of the screen minus the offset. AnimateOut happens when the element moves out of these constraints.

**animateIn**

Any animation from [animate.css](https://daneden.github.io/animate.css/). The Animation triggers when the element is contained within the "viewport" (see offset property for more details on this).

**animateOut**

Any animation from [animate.css](https://daneden.github.io/animate.css/). The Animation triggers when the element is leaving the "viewport" (see offset property for more details on this).

**duration** - default 1

Animation duration in seconds.

**initiallyVisible** - default false

Whether the element should be visible to begin with or not. If animateIn is an entrance animation, then should probably be false.

## Development:

In the project root:

### Install Depencenies:

``
npm install
``

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
