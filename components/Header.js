//@flow
import React from 'react';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from 'reactstrap';
import foo from 'bootstrap/dist/css/bootstrap.css';
import { render } from 'react-dom';
import { Provider, Subscribe, Container } from 'unstated';

type CounterState = {
  isOpen: boolean
};

class HeaderContainer extends Container<CounterState> {
  state = {
    isOpen: false
  };

  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }
}
const Index = () => (
  <Provider>
    <Subscribe to={[HeaderContainer]}>
      {container => (
        <Navbar color="faded" light expand="md">
          <NavbarBrand href="/">
            <img src="/static/itdagene_logo.png " />
          </NavbarBrand>
          <link rel="stylesheet" href="/static/bootstrap.min.css" />
          <NavbarToggler onClick={() => container.toggle()} />
          <Collapse isOpen={container.state.isOpen} navbar>
            <Nav className="ml-auto" navbar>
              <NavItem>
                <NavLink href="/components/">Components</NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="https://github.com/reactstrap/reactstrap">
                  Github
                </NavLink>
              </NavItem>
            </Nav>
          </Collapse>
        </Navbar>
      )}
    </Subscribe>
  </Provider>
);

export default Index;
