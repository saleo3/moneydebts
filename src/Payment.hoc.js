import React, { Component } from 'react';
import { graphql, compose } from 'react-apollo';
import { GET_ALL_USERS, CREATE_PAYMENT_MUTATION, UPDATE_PAYMENT_BY_ID } from "./gql";


class PaymentHOC extends Component {

    constructor(props) {
        super(props);

        this.handleCollaborators = this.handleCollaborators.bind(this);
        this.handler = this.handler.bind(this);

        this.state = {
            description: '',
            quantity: 0,
            collaborators: []
        }
    }

    componentWillReceiveProps({ payment }) {

        // update state if reciving props to edit the payment
        payment && this.setState( () => ({
            description: payment.description,
            quantity: payment.quantity,
            collaborators: payment.collaborators
        }));
        
    }

    handler(name, { target }) {
        this.setState(state => ({ [name]: target.value }));
    }

    handleCollaborators({ target }) {
        const collaborators = [...this.state.collaborators];
        let newCollaborators;

        newCollaborators = !collaborators.includes(target.value)? collaborators.concat(target.value): collaborators.filter( user => user !== target.value );
        this.setState( () => ({ collaborators: newCollaborators }) );
    }

    render() {
        const { getAllUsersQuery: { loading, error } } = this.props;
        const { handleCollaborators, handler } = this;

        if (loading) return <div>Loading</div>;

        if (error) return <div>Error</div>;

        return (<div>
            {this.props.render(this.state, this.props, { handleCollaborators, handler })}
        </div>)

    }

};


export default compose(
  graphql(CREATE_PAYMENT_MUTATION, { name: 'createPaymentMutation' }),
  graphql(GET_ALL_USERS, { name: 'getAllUsersQuery' }),
  graphql(UPDATE_PAYMENT_BY_ID, { name: 'updatePaymentById' })
)(PaymentHOC);