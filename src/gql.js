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

export const CREATE_PAYMENT_MUTATION = gql`

mutation createPaymentMutation($description: String!, $quantity: Float!, $postedById: ID!, $collaboratorsIds: [ID!]!, $groupId: ID!) {
  createPayment(
    description: $description
    quantity: $quantity
    postedById: $postedById
    collaboratorsIds: $collaboratorsIds
    partyId: $groupId
  ) {
    id
  }

}

`;

export const GET_ALL_USERS = gql`

  query getAllUsersQuery {
    allUsers {
      id
      name
    }
  }
  
`;

export const DELETE_PAYMENT_BY_ID = gql`

   mutation deletePaymentById( $id: ID! ) {
     deletePayment( id: $id ) {
       id
     }
   }

`;

export const UPDATE_PAYMENT_BY_ID = gql`

  mutation updatePaymentById($id: ID!, $description: String!, $quantity: Float!, $collaboratorsIds: [ID!]!)  {
    
    updatePayment( 
      id: $id 
      description: $description
      quantity: $quantity
      collaboratorsIds: $collaboratorsIds
    ) {
      id
    }

  }

`;


export const PAYMENTS_BY_USER = gql`

query allPaymentsByUser($group_id: ID!, $user_id: ID!) {

    Party(id: $group_id) {
      name
      members {
        id
        name
        payments(
          filter: {
            party: {
              id: $group_id
            }
            OR: [
              {
                collaborators_some: {
                  id: $user_id
                }
              },
              { 
                postedBy: {
                  id: $user_id
                }
              }
            ]
          }
        ) {
          id
          quantity
          description
          _collaboratorsMeta {
            count
          }
          collaborators {
            id
            name
          }
        }
      }
    }

  }

`;


export const CREATE_USER_MUTATION = gql`

mutation createUserMutation($email: String!, $password: String!) {
  
  createUser(
    authProvider: {
      email: {
        email: $email,
        password: $password
      }
    }
  ) {
    id
  }

  signinUser(email: {
    email: $email,
    password: $password
  }) {
    token
    user {
      id
    }
  }

}

`;

export const SIGNIN_USER_MUTATION = gql`

mutation signinUserMutation($email: String!, $password: String!) {

  signinUser(email: {
    email: $email,
    password: $password
  }) {
    token
    user {
      id
      defaultGroup
      parties {
        id
        name
        createdBy {
          id
          name
        }
      }
    }
  }

}

`;

export const USER_DEFAULT_GROUP = gql`

mutation userDefaultGroup($id: ID!) {

  User(id: $id) {
    groups {
      id
    }
  }
  
}

`;


export const UPDATE_DEFAULT_GROUP = gql`

  mutation updateDefaultGroup($group_id: String!, $user_id: ID!) {
  
    updateUser(
      id: $user_id, 
      defaultGroup: $group_id
    ) {
      id
      defaultGroup
      parties {
        id
        name
        createdBy {
          id
          name
        }
      }
    }

  }

`;


