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

export const PAYMENTS_ALL_USERS = gql`
query allPaymentsByUserQuery ($user_id: ID!, $group_id: ID!) {
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
      group: {
        id: $group_id
      }
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

mutation createPaymentMutation($description: String!, $quantity: Float!, $postedById: ID!, $collaboratorsIds: [ID!]!, $groupId: ID!) {
  createPayment(
    description: $description
    quantity: $quantity
    postedById: $postedById
    collaboratorsIds: $collaboratorsIds
    groupId: $groupId
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

export const DELETE_PAYMENT_BY_ID = gql`

   mutation deletePaymentById( $id: ID! ) {
     deletePayment( id: $id ) {
       id
     }
   }

`;


export const PAYMENTS_BY_USER = gql`

query allPaymentsByUser($group_id: ID!) {

    Group(id: $group_id) {
      users {
        id
        name
        payments {
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