import React, { Component } from 'react';
import { Navbar, Nav, NavItem } from 'react-bootstrap';

class Menu extends Component {

  constructor(props) {
    super(props);
    this.state = {
      properties: [
        "animateIn",
        "animateOut",
        "initiallyVisible",
        "duration",
        "delay",
        "animateOnce",
        "afterAnimatedIn",
        "afterAnimatedOut"
      ],
      hash: ''
    }
  }

  componentDidMount() {
    const that = this;
    window.onhashchange = function () { that.setState({ hash: window.location.hash }) };
  }

  render() {
    return (
      <div id="menu">
        <Navbar inverse fluid fixedTop>
          <Navbar.Header>
            <Navbar.Brand>
              <a href="#home">React Animate On Scroll</a>
            </Navbar.Brand>
          </Navbar.Header>
          <Nav>
            {this.state.properties.map((prop, index) => {
              return <NavItem active={this.state.hash.includes(prop)} key={index} href={"#" + prop}>{prop}</NavItem>
            })}
          </Nav>
          <Nav pullRight>
            <NavItem active={this.state.hash.includes("install")} href="#install">Install</NavItem>
          </Nav>
        </Navbar>
      </div>
    );
  }
}

export default Menu;