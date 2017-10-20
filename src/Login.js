import React, { Component } from "react";
import { graphql, gql, compose } from 'react-apollo';
import { USR_ID, ATH_TKN } from "./constants";

class Login extends Component {

  state = {
    email: '',
    password: '',
  }

  inputHandler(input, {target}) {
    this.setState( () => ({ [input]: target.value }) );    
  }

  _saveUserData(id, token) {
    localStorage.setItem(USR_ID, id);
    localStorage.setItem(ATH_TKN, token);
  }

  async signinupHandler(isLogged) {
    const { email, password } = this.state;
    let operation = 'signinUserMutation';

    if(!isLogged) operation = 'createUserMutation';

    const { data } = await this.props[operation]({
      variables: { email, password }
    })

      const { user: { id }, token } = data.signinUser;
      this._saveUserData(id, token);
  }

  render() {
    return (
      <div>
        Login <br/>
        <input type="text" value={this.state.email} onChange={(e) => this.inputHandler('email', e)}/>
        <input type="password" value={this.state.password} onChange={(e) => this.inputHandler('password', e)}/>
        <button onClick={() => this.signinupHandler(true)}>Login</button>
        <button onClick={() => this.signinupHandler(false)}>Signup</button>
      </div>
    )
  }

}


const CREATE_USER_MUTATION = gql`

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
`

const SIGNIN_USER_MUTATION = gql`

mutation signinUserMutation($email: String!, $password: String!) {
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
`

export default compose(
  graphql(CREATE_USER_MUTATION, { name: 'createUserMutation' }),
  graphql(SIGNIN_USER_MUTATION, { name: 'signinUserMutation' })
)(Login);


// export default Login;