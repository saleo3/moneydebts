import React, { Component } from 'react';
import Login from './Login';
import PaymentList from './PaymentList';
import AddPayment from './AddPayment';
import EditPayment from './EditPayment';
import Groups from './Groups';
import { Switch, Route } from 'react-router-dom';
import { userID } from './constants';

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={props => (
    userID 
      ? <Component {...props}/>
      : <Login/>
  )}/>
)

class App extends Component {


  render() {

    return (
      <div className="App">
        <a href="/payments">All Payments</a>
        <a href="/addPayment">Add Payment</a>
      <Switch>
        <PrivateRoute path='/' component={PaymentList}/>
        <PrivateRoute path='/payments' component={PaymentList}/>
        <PrivateRoute path='/addPayment' component={AddPayment}/>
        <PrivateRoute path='/editPayment/:id' component={EditPayment}/>
        <PrivateRoute path='/groups' component={Groups}/>
      </Switch>
      </div>
    );
  }
}


export default App;
