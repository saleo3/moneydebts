import React, { Component } from 'react';
import { graphql, compose } from 'react-apollo';
import { userID } from './constants';
import { PAYMENTS_SUSCRIPTIONS, PAYMENTS_BY_USER, DELETE_PAYMENT_BY_ID } from './gql';
import { _getCollaboratorsName } from './helpers';
import './styles.css';


class PaymentList extends Component {

  componentDidMount() {

    this.props.paymentsByUser.subscribeToMore({
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

  async deletePaymentById( id ) {

    await this.props.deletePaymentById({
      variables: {
        id
      }
    })

  }

  toggleActivePayment({ target: selectedPayment }) {
    selectedPayment.classList.toggle('active');
  }

  _splitPayment( quantity, many, total = 0 ) {
    return total + Math.round(quantity / many);
  }

  _getAmounts( payments ) {

    return payments.reduce( (a, {quantity, collaborators, _collaboratorsMeta}) => {
      
      collaborators.forEach( colaborator => {
        const _hofSplit = ( total = 0 ) => this._splitPayment(quantity, _collaboratorsMeta.count, total);
        a[colaborator.id] = (colaborator.id in a)? _hofSplit(a[colaborator.id]): _hofSplit(); 
      })

      a.total = a.total + quantity;

      return a;

    }, { total: 0 })

  }

  _renderPaymentsList2( postedById, { id, description, quantity, collaborators, _collaboratorsMeta }, k ) {
    
    const totalDivided = this._splitPayment(quantity, _collaboratorsMeta.count);

    return <div key={k}>
      {description} - {quantity} 
      <br/> 
      [{collaborators.map(_getCollaboratorsName(userID, totalDivided)).join(', ')}]
      {(userID === postedById) && <button onClick={e => this.deletePaymentById(id)}>Delete</button>}
      <br/><br/>
    </div>;

  }

  _renderWhoOwsWho(mine, their) {
    return (mine > their? 'They own: ': 'You own: ') + Math.abs(mine - their);
  }
 
  render() {


    const { paymentsByUser: { loading, error, Group } } = this.props;

    if (loading) return <div>Loading</div>;

    if (error) return <div>Error</div>;

    const payments = Group.users.reduce( (acc, { id, name, payments }) => {

      const amounts = this._getAmounts(payments);

      acc[id] = { id, name, payments, amounts };

      return acc

    }, {})

    console.log(payments)

    return (
      <div>
        Payments
        <div className="accordion">
          {Object.keys(payments).map( (id, k) => {

            const user = payments[id];
            const their = user.amounts[userID] || 0;
            const mine = payments[userID].amounts[id];

            return <div key={k}>
                <div className="accordion title" onClick={e => this.toggleActivePayment(e)}>
                  {user.name} - {user.amounts.total}
                </div>
                <div className="accordion content">
                  {user.payments.map( (payment, k) => this._renderPaymentsList2(user.id, payment, k) )}
                  <br/>
                  {id !== userID && this._renderWhoOwsWho(mine, their)}
                </div>
            </div>

          })}
        </div>
      </div>
    );

  }

};

export default compose(
  graphql(
    PAYMENTS_BY_USER,
    {
      name: 'paymentsByUser',
      options: {
        variables: {
          user_id: userID,
          group_id: localStorage.getItem('debts-group-id')
        }
      }
    }
  ),
  graphql(DELETE_PAYMENT_BY_ID, {
    name: 'deletePaymentById'
  })
)(PaymentList);