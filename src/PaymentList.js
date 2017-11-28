import React, { Component } from 'react';
import { graphql, compose } from 'react-apollo';
import { userID, groupID } from './constants';
import { PAYMENTS_SUSCRIPTIONS, PAYMENTS_BY_USER, DELETE_PAYMENT_BY_ID, UPDATE_PAYMENT_AS_PAID } from './gql';
import { _getCollaboratorsName } from './helpers';
import './styles.css';


class PaymentList extends Component {

  componentWillMount() {
    this.props.subscribeToMorePayments();
  }

  async deletePaymentById( id ) {
    await this.props.deletePaymentById(id);
  }

  editPaymentById( paymentSelected ) {

    const payment = Object.assign({}, paymentSelected);
    payment.collaborators = payment.collaborators.map( colaborator => colaborator.id );

    this.props.history.push(`/editPayment/${payment.id}`, { payment });

  }

  async setPaymentAsPaid(payment) {
    await this.props.setPaymentAsPaid(payment); 
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

  _renderPaymentsList2( postedById, payment, k ) {
    const { id, description, quantity, collaborators, _collaboratorsMeta } = payment;
    const totalDivided = this._splitPayment(quantity, _collaboratorsMeta.count);

    return <div key={k}>
      {description} - {quantity} 
      <br/> 
      [{collaborators.map(_getCollaboratorsName(userID, totalDivided)).join(', ')}]
      {(userID === postedById) && <div>
        <button onClick={e => this.deletePaymentById(id)}>Delete</button>
        <button onClick={e => this.editPaymentById(payment)}>Edit</button>
        <button onClick={e => this.setPaymentAsPaid(payment)}>Set Paid</button>
      </div>}
      <br/><br/>
    </div>;

  }

  _renderWhoOwsWho(mine, their) {
    return (mine > their? 'They own: ': 'You own: ') + Math.abs(mine - their);
  }
 
  render() {
    const { paymentsByUser: { loading, error, Party } } = this.props;
    let spends;

    if (loading) return <div>Loading</div>;
    if (error) return <div>error</div>;
  

    const payments = Party.members.reduce( (acc, { id, name, payments }) => {

      const amounts = this._getAmounts(payments);
      if(id === userID) spends = amounts;

      return [...acc, { id, name, payments, amounts }];

    }, [])

    return (
      <div>
        Payments
        <div className="accordion">
          {payments.map( (user, k) => {
            const their = user.amounts[userID] || 0;
            const mine = spends[user.id] || 0;

            return <div key={k}>
              <div className="accordion title" onClick={e => this.toggleActivePayment(e)}>
                {user.name} - {user.amounts.total}
              </div>
              <div className="accordion content">
                {user.payments.map( (payment, k) => this._renderPaymentsList2(user.id, payment, k) )}
                <br/>
                {user.id !== userID && this._renderWhoOwsWho(mine, their)}
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
          group_id: groupID
        }
      },
      props: props => ({
        paymentsByUser: props.paymentsByUser,
        subscribeToMorePayments: props.paymentsByUser.subscribeToMore({
          document: PAYMENTS_SUSCRIPTIONS,
          variables: {
            user_id: userID,
            group_id: groupID
          },
          updateQuery: (prev,{ subscriptionData }) => {
            let newMembers = [];

            prev.Party.members.forEach( member => {
              // If in prop postedby is the same to the currrent member it means we are only work with 
              // that and skip to the next member
              const newMember = Object.assign({}, member);
            
              if (subscriptionData.Payment.mutation === "CREATED") newMember.payments = [...member.payments, subscriptionData.Payment.node];
              if (subscriptionData.Payment.mutation === "DELETED") newMember.payments = member.payments.filter( payment => payment.id !== subscriptionData.Payment.previousValues.id );
              if (subscriptionData.Payment.mutation === "UPDATED") newMember.payments = member.payments.filter( payment => payment.id !== subscriptionData.Payment.previousValues.id && !payment.isPaid );

              newMembers.push(newMember);

            });

    
            return { 
              Party: {
                name: prev.Party.name,
                members: newMembers || prev.Party.members,
                __typename: "Party"
              }
            }
    
          }
        })
      })
    }
  ),
  graphql(DELETE_PAYMENT_BY_ID, {
    name: 'deletePaymentById',
    props: props => ({
      deletePaymentById: id => props.deletePaymentById({
        variables: {
          id
        }
      })
    })
  }),
  graphql(UPDATE_PAYMENT_AS_PAID, {
    name: 'setPaymentAsPaid',
    props: props => ({
      setPaymentAsPaid: ({id, isPaid}) => props.setPaymentAsPaid({
        variables: { 
          id,
          isPaid: !isPaid 
        }
      })
    })
  })
)(PaymentList);