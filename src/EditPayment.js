import React, { Component } from 'react';
import PaymentHOC from './Payment.hoc';
import PaymentView from './Payment.view';


class EditPayment extends Component {

    async editPaymentById(props, state) {

        const { description, quantity, collaborators: collaboratorsIds } = state;

        const update = await props.updatePaymentById({
            variables: { 
                id: this.props.location.state.payment.id, 
                description, 
                quantity: parseFloat(quantity), 
                collaboratorsIds
            }
        });

        if (update.data.updatePayment.id) window.location = '/payments';
    
    }

  render() {

    return (
        <PaymentHOC payment={{...this.props.location.state.payment}} render={(state, props, fns) => <PaymentView 
            data={{ ...state, allUsers: props.getAllUsersQuery.allUsers }} 
            handlers={{ ...fns, editPayment: () => this.editPaymentById(props, state) }}
            />
        }/>
    );

  }

};


export default EditPayment;