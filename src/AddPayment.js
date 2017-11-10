import React, { Component } from 'react';
import { userID, groupID } from "./constants";
import PaymentHOC from './Payment.hoc';
import PaymentView from './Payment.view';


class AddPayment extends Component {
  
    async addPayment(props, state) {
    
        const { description, quantity, collaborators } = state;
    
        const create = await props.createPaymentMutation({
            variables: { 
                description, 
                quantity: parseFloat(quantity), 
                postedById: userID, 
                collaboratorsIds: collaborators,
                groupId: groupID 
            }
        });

        if (create.data.createPayment.id) window.location = '/payments';
    
    }
  
    render() {
    
        return (
            <PaymentHOC render={(state, props, fns) => <PaymentView 
                data={{ ...state, allUsers: props.getAllUsersQuery.allUsers }} 
                handlers={{...fns, addPayment: () => this.addPayment(props, state) }}/>
            }/>
        );
    
      }
  
};


export default AddPayment;