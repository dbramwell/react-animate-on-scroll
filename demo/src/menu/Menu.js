import React, { Component } from 'react';
import { Navbar, Nav, NavItem, MenuItem, NavDropdown } from 'react-bootstrap';

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
        "scrollableParentSelector",
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
        <Navbar inverse collapseOnSelect fixedTop>
          <Navbar.Header>
            <Navbar.Brand>
              <a href="#home">React Animate On Scroll</a>
            </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>
          <Navbar.Collapse>
            <Nav>
              <NavDropdown title="Properties" id="properties">
              {this.state.properties.map((prop, index) => {
                return <MenuItem active={this.state.hash.indexOf(prop) > -1} key={index} onSelect={() => window.location.hash = `#${prop}`}>{prop}</MenuItem>
              })}
              </NavDropdown>
            </Nav>
            <Nav pullRight>
              <NavItem active={this.state.hash.indexOf("install") > -1} onSelect={() => window.location.hash = "#install"}>Install</NavItem>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      </div>
    );
  }
}

export default Menu;