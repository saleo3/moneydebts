import React, { Component } from 'react';
import { graphql, compose } from 'react-apollo';
import { userID, groupID } from './constants';
import { PAYMENTS_SUSCRIPTIONS, PAYMENTS_BY_USER, DELETE_PAYMENT_BY_ID } from './gql';
import { _getCollaboratorsName } from './helpers';
import './styles.css';


class PaymentList extends Component {

  componentWillMount() {
    this.props.subscribeToMorePayments()
  }

  async deletePaymentById( id ) {
    await this.props.deletePaymentById(id);
  }

  editPaymentById( paymentSelected ) {

    const payment = Object.assign({}, paymentSelected);
    payment.collaborators = payment.collaborators.map( colaborator => colaborator.id );

    this.props.history.push(`/editPayment/${payment.id}`, { payment });

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
      </div>}
      <br/><br/>
    </div>;

  }

  _renderWhoOwsWho(mine, their) {
    return (mine > their? 'They own: ': 'You own: ') + Math.abs(mine - their);
  }
 
  render() {
    console.log(this.props)
    // return null;
    const { paymentsByUser: { loading, error, Party } } = this.props;

    if (loading) return <div>Loading</div>;
    if (error) return <div>error</div>;
  

    const payments = Party.members.reduce( (acc, { id, name, payments }) => {

      const amounts = this._getAmounts(payments);
      acc[id] = { id, name, payments, amounts };

      return acc

    }, {})

    // console.log(payments)

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
            let newParty;
            console.log(prev, subscriptionData);

            switch(subscriptionData.Payment.mutation) {
              case "CREATED":
                const memberIndex = prev.Party.members.findIndex( member => member.id === subscriptionData.Payment.node.postedBy.id );
                const memberData = prev.Party.members[memberIndex];
                console.log(memberData)
                // const { payments } = Object.assign({}, );
                // const newPayment = subscriptionData.Payment.node;
                // const allPayments = [...payments, newPayment];
                // prev.Party.members[memberIndex].payments = allPayments;
                console.log(prev.Party)

                break;
              case "DELETED":
                let newMembers = [];
                
                prev.Party.members.forEach( ({ id, name, payments, __typename }) => {

                  const paymentsFiltered = payments.filter( payment => payment.id !== subscriptionData.Payment.previousValues.id )
                  newMembers.push({ id, name, payments: paymentsFiltered, __typename });

                });

                newParty = {
                  name: prev.Party.name,
                  members: newMembers,
                  __typename: "Party"
                }

                console.log(newParty);
                break;
            }
    
            return { 
              Party: newParty

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
  })
)(PaymentList);