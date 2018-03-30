//@flow
import React from 'react';
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
    <Subscribe to={[HeaderContainer]}>{container => <div> </div>}</Subscribe>
  </Provider>
);

export default Index;
