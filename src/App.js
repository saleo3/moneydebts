import React, { Component } from 'react';
import Login from './Login';
import PaymentList from './PaymentList';
import AddPayment from './AddPayment';

class App extends Component {


  render() {

    return (
      <div className="App">
        <PaymentList />
        <hr />
        <AddPayment />
        <hr/>
        <Login/>
      </div>
    );
  }
}


export default App;
