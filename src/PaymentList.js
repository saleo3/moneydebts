import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import { userID } from './constants';
import { PAYMENTS_SUSCRIPTIONS, PAYMENTS_BY_USER } from './gql';
import { _compare, _getCollaboratorsName } from './helpers';


class PaymentList extends Component {

  componentDidMount() {

    this.props.data.subscribeToMore({
      document: PAYMENTS_SUSCRIPTIONS,
      updateQuery: (previous, {subscriptionData}) => {
        let payments;

        switch (subscriptionData.data.Payment.mutation) {
          case 'UPDATED':
            const index = previous.allPayments.findIndex(payment => subscriptionData.data.Payment.previousValues.id === payment.id);
            payments = [...previous.allPayments];
            payments[index] = subscriptionData.data.Payment.node;
            break;
        
          case 'DELETED':
            payments = previous.allPayments.filter( payment => subscriptionData.data.Payment.previousValues.id !== payment.id);
            break;
          
          default:
          case 'CREATED': 
            payments = [subscriptionData.data.Payment.node, ...previous.allPayments];
            break
        }
            
        return {
          allPayments: payments
        }

      }
    })

  }

  _splitOthersPayment(id, quantity, collaborators, total = 0 ) {
    total = total + ( id !== userID? Math.round(quantity / (collaborators.length + 1)): quantity )
    return total;
  }

  _renderPaymentsList({ postedBy: { id, name }, collaborators, description, quantity }, k ) {
    const _itsYou = _compare( userID );
    
    return <div key={k}>
      {_itsYou(id, '', '+++')}
      {description} - {this._splitOthersPayment(id, quantity, collaborators)} <br/> 
      By {_itsYou(id, 'You', name)} [ 
        {collaborators.map(_getCollaboratorsName(userID)).join(', ')}
      ]
      <br/><br/>
    </div>;

  }

  render() {
    const { data: { loading, error, allPayments } } = this.props;

    // console.log(this.props)
    if (loading) return <div>Loading</div>;

    if (error) return <div>Error</div>;

    
    const { ownMe, ownThem, paymentsByUser, paymentsList} = allPayments.reduce( (acc, cur, k) => {

      const { postedBy: { id }, collaborators, quantity } = cur;
      const isIdInObj = id in acc.paymentsByUser;
      const accPayments = acc.paymentsByUser[id];
      const addPayments = (accPayments && [...accPayments.payments]) || [];
      const paymentsList = [...acc.paymentsList];

      if ( isIdInObj ) addPayments.push(cur);

      acc.paymentsByUser[id] = { 
        payments: isIdInObj? addPayments: [cur], 
        total: isIdInObj? this._splitOthersPayment(id, quantity, collaborators, accPayments.total): this._splitOthersPayment(id, quantity, collaborators)
      };
      
      paymentsList.push(this._renderPaymentsList(cur, k));

      return { 
        ownMe: acc.ownMe + (id === userID? quantity: 0), 
        ownThem: acc.ownThem + (id !== userID? this._splitOthersPayment(id, quantity, collaborators): 0), 
        paymentsByUser: acc.paymentsByUser, 
        paymentsList 
      };

    }, { ownMe: 0, ownThem: 0, paymentsByUser: {}, paymentsList: []  });

      console.log(paymentsByUser, ownMe, ownThem)

    return (
      <div>
        Payments
        {paymentsList}
        {ownMe > ownThem? 'They own you:': 'You own them'} {Math.abs(ownMe - ownThem)}
      </div>
    );

  }

};

export default graphql(
  PAYMENTS_BY_USER,
  {
    options: {
      variables: {
        user_id: userID
      }
    }
  }
)(PaymentList);