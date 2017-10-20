import { gql } from 'react-apollo';

export const PAYMENTS_SUSCRIPTIONS = gql`
  subscription  paymentSubscriptionMutation {
    Payment(filter: {
      mutation_in: [CREATED, UPDATED, DELETED]
    }) {
      mutation
      previousValues {
          id
      }
      node {
        id
        description
        quantity
        postedBy {
          name
          id
        }
        collaborators {
          name
          id
        }
      }
    }
  }`;

export const PAYMENTS_BY_USER = gql`
query allPaymentsByUserQuery ($user_id: ID!) {
  allPayments(
    orderBy: id_DESC
    filter: {
      OR: [
        { 
          postedBy: {
          	id: $user_id
        	}
        },
        {
          collaborators_some: {
            id: $user_id
          } 
        }
      ]
    }
  ) {
    id
    description
    quantity
    postedBy {
      id
      name
    }
    collaborators {
      id
      name
    }
  }
}`;

export const CREATE_PAYMENT_MUTATION = gql`

mutation createPaymentMutation($description: String!, $quantity: Float!, $postedById: ID!, $collaboratorsIds: [ID!]!) {
  createPayment(
    description: $description
    quantity: $quantity
    postedById: $postedById
    collaboratorsIds: $collaboratorsIds
  ) {
    id
  }

}`;

export const GET_ALL_USERS = gql`

  query getAllUsersQuery {
    allUsers {
      id
      name
    }
  }
  
`;