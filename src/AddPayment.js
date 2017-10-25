import React, { Component } from 'react';
import { graphql, compose } from 'react-apollo';
import { userID, groupID } from "./constants";
import { GET_ALL_USERS, CREATE_PAYMENT_MUTATION } from "./gql";


class AddPayment extends Component {

  state = {
    description: '',
    quantity: 0,
    collaborators: []
  }

  async addPayment() {
    const { description, quantity, collaborators } = this.state;

    await this.props.createPaymentMutation({
      variables: { 
        description, 
        quantity: parseFloat(quantity), 
        postedById: userID, 
        collaboratorsIds: collaborators,
        groupId: groupID 
      }
    });


  }

  handleDescription({ target }) {
    this.setState(state => ({ description: target.value }));
  }

  handleQuantity({ target }) {
    this.setState(state => ({ quantity: target.value }));
  }

  handleCollaborators({ target }) {
    const collaborators = [...this.state.collaborators];
    let newCollaborators;

    newCollaborators = !collaborators.includes(target.value)? collaborators.concat(target.value): collaborators.filter( user => user !== target.value );

    this.setState( () => ({ collaborators: newCollaborators }) );
  }

  render() {
    const { getAllUsersQuery: { loading, error, allUsers } } = this.props;

    if (loading) return <div>Loading</div>;

    if (error) return <div>Error</div>;

    return (
      <div>
        Add Payment <br />
        <input type='text' value={this.state.description} onChange={e => this.handleDescription(e)} />
        <input type='text' value={this.state.quantity} onChange={e => this.handleQuantity(e)} />
        {allUsers.map( 
            ({ id, name }) => (<label key={id}>
              {userID === id? 'You': name}
              <input type="checkbox" value={id} onChange={e => this.handleCollaborators(e)}/>
            </label>)
        )}
        <button onClick={this.addPayment.bind(this)}>ADD -></button>
      </div>
    );

  }

};


export default compose(
  graphql(CREATE_PAYMENT_MUTATION, { name: 'createPaymentMutation' }),
  graphql(GET_ALL_USERS, { name: 'getAllUsersQuery' })
)(AddPayment);