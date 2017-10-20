import React, { Component } from 'react';
import Login from './Login';
import PaymentList from './PaymentList';
import AddPayment from './AddPayment';


// class AddPayment extends Component {

//   state = {
//     description: '',
//     quantity: 0
//   }

//   async addPayment() {

//     const { description, quantity } = this.state;
//     const postedById = localStorage.getItem(USR_ID)

//     await this.props.mutate({
//       variables: { description, quantity: parseFloat(quantity), postedById, collaboratorsIds: ["cj8nf7s9eflhw0192n4bau2vu"]  }
//     });


//   }

//   handleDescription({ target }) {
//     this.setState(state => ({ description: target.value }));
//   }

//   handleQuantity({ target }) {
//     this.setState(state => ({ quantity: target.value }));
//   }

//   render() {

//     return (
//       <div>
//         Add Payment <br />
//         <input type='text' value={this.state.description} onChange={e => this.handleDescription(e)} />
//         <input type='text' value={this.state.quantity} onChange={e => this.handleQuantity(e)} />
//         <button onClick={this.addPayment.bind(this)}>ADD -></button>
//       </div>
//     );

//   }

// };

// // AddPayment = graphql(gql`
// // mutation createPaymentMutation($description: String!, $quantity: Float!, $postedById: ID!, $collaboratorsIds: [ID!]! ) {
// //   createPayment(description: $description, quantity: $quantity, postedById: $postedById, collaboratorsIds: $collaboratorsIds ) {
// //     id
// //   }
// // }
// // `)(AddPayment);


// AddPayment = graphql(gql`
// mutation createPaymentMutation($description: String!, $quantity: Float!, $postedById: ID!, $collaboratorsIds: [ID!]!) {
//   createPayment(
//     description: $description
//     quantity: $quantity
//     postedById: $postedById
//     collaboratorsIds: $collaboratorsIds
//   ) {
//     id
//   }
// }
// `)(AddPayment);

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
