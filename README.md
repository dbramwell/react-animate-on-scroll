# React Animate On Scroll
React component to animate elements on scroll with [animate.css](https://daneden.github.io/animate.css/).<br />
Inspired by [React-Scroll-Effect](https://github.com/anorudes/react-scroll-effects)
### [Demo](https://dbramwell.github.io/react-animate-on-scroll/)
<br />

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
<b>offset</b> - default 100<br/>
The "viewport" is by default 100 pixels from the top and bottom of the screen. When an element is completely contained within the "viewport", animateIn is triggered. When the element is leaving the "viewport", animateOut is triggered. This can be overridden by setting the offset property.<br /><br />
If the element is bigger than the viewport animateIn is triggered when the position of the top of the element is is less than the position of the middle of the screen plus the offset, and the position of the bottom of the element is greater than the middle of the screen minus the offset. AnimateOut happens when the element moves out of these constraints.
<br /><br />

<b>animateIn</b><br/>
Any animation from [animate.css](https://daneden.github.io/animate.css/). The Animation triggers when the element is contained within the "viewport" (see offset property for more details on this).<br /><br />

<b>animateOut</b><br/>
Any animation from [animate.css](https://daneden.github.io/animate.css/). The Animation triggers when the element is leaving the "viewport" (see offset property for more details on this).<br /><br />

<b>duration</b> - default 1<br />
Animation duration in seconds.<br /><br />

<b>initiallyVisible</b> - default false<br />
Whether the element should be visible to begin with or not. If animateIn is an entrance animation, then should probably be false.<br /><br />

## Development:
In the project root:
### Install Depencenies:
``
npm install
``
### Run Tests:
There are some automated test cases with karma and a Chrome headless browser. I attempted to use Jest, and then to use PhantomJS, but could get neither to work with scroll events. To run them:
``
npm test
``
### Build the component:
``
gulp build
``
### Run the Demo project:
```
cd demo
npm install
npm install ..
npm start
```
