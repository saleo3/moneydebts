import gql from 'graphql-tag';

export const PAYMENTS_SUSCRIPTIONS = gql`

subscription paymentSubsciption($group_id: ID!, $user_id: ID!) {
  Payment(
    filter: {
      node: {
        party: {
          id: $group_id
        }
      }
      OR: [
        {
          node: {
            collaborators_some: {
              id: $user_id
            }
          }
        },
        {
          node: {
            postedBy: {
              id: $user_id
            }
          }
        }
      ]
    }
  ) {
    mutation
    previousValues {
      id
    }
    node {
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
      postedBy {
        id
        name
      }
      isPaid
    }
  }
}

`;

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

  mutation updatePaymentById($id: ID!, $description: String!, $quantity: Float!, $collaboratorsIds: [ID!]!, $isPaid: Boolean)  {
    
    updatePayment( 
      id: $id 
      description: $description
      quantity: $quantity
      collaboratorsIds: $collaboratorsIds
      isPaid: $isPaid
    ) {
      id
    }

  }

`;

export const UPDATE_PAYMENT_AS_PAID = gql`

  mutation updatePaymentById($id: ID!, $isPaid: Boolean)  {
    
    updatePayment( 
      id: $id 
      isPaid: $isPaid
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
            AND: [
              {
                isPaid_not: true
              },
              {
                party: {
                  id: $group_id
                }
              }
            ]
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
          isPaid
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


