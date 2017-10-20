import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import { USR_ID } from './constants';
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

  _renderPayment({ postedBy, quantity, collaborators }) {
    return postedBy.id !== localStorage.getItem(USR_ID)? Math.round(quantity / (collaborators.length + 1)): quantity
  }

  render() {
    const { data: { loading, error, allPayments } } = this.props;

    // console.log(this.props)
    if (loading) return <div>Loading</div>;

    if (error) return <div>Error</div>;

    const _itsYou = _compare( localStorage.getItem(USR_ID) );
    const { ownMe, ownThem } = allPayments.reduce( (acc, cur) => {

      if( cur.postedBy.id !== localStorage.getItem(USR_ID) ) return { ownMe: acc.ownMe, ownThem: acc.ownThem + this._renderPayment(cur)};

      return { ownMe: acc.ownMe + cur.quantity, ownThem: acc.ownThem };

    }, { ownMe: 0, ownThem: 0 });

    // console.dir(mreduce)

    return (
      <div>
        Payments
        {allPayments.map( 
          (payment, k, arr) => <div key={k}>
          {_itsYou(payment.postedBy.id, '', '+++')}
          {payment.description} - {this._renderPayment(payment)} <br/> 
          By {_itsYou(payment.postedBy.id, 'You', payment.postedBy.name)} [ 
          {payment.collaborators.map(_getCollaboratorsName).join(', ')}
          ]<br/><br/></div>
        )}
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
        user_id: localStorage.getItem(USR_ID)
      }
    }
  }
)(PaymentList);