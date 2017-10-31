import React, { Component } from 'react';
import Login from './Login';
import PaymentList from './PaymentList';
import AddPayment from './AddPayment';
import Groups from './Groups';
import { Switch, Route, Redirect } from 'react-router-dom';
import { userID } from './constants';

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={props => (
    userID ? (
      <Component {...props}/>
    ) : (
      <Redirect to={{ pathname: '/login' }}/>
    )
  )}/>
)

class App extends Component {


  render() {

    return (
      <div className="App">
        <a href="/payments">All Payments</a>
        <a href="/addPayment">Add Payment</a>
      <Switch>
        <Route exact path='/login' component={Login}/>
        <PrivateRoute path='/payments' component={PaymentList}/>
        <PrivateRoute path='/addPayment' component={AddPayment}/>
        <PrivateRoute path='/groups' component={Groups}/>
      </Switch>
      </div>
    );
  }
}


export default App;
