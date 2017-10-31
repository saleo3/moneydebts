import React, { Component } from "react";
import { graphql, compose } from 'react-apollo';
import { setUserID, setAuthToken, setGroupID } from "./constants";
import { CREATE_USER_MUTATION, SIGNIN_USER_MUTATION, USER_DEFAULT_GROUP } from "./gql";

class Login extends Component {

  state = {
    email: '',
    password: '',
  }

  inputHandler(input, {target}) {
    this.setState( () => ({ [input]: target.value }) );    
  }

  _saveUserData(id, token, groupId) {
    setUserID(id);
    setAuthToken(token);
    setGroupID(groupId);
  }

  async signinupHandler(isLogged) {
    const { email, password } = this.state;
    let operation = 'signinUserMutation';

    if(!isLogged) operation = 'createUserMutation';

    const { data } = await this.props[operation]({
      variables: { email, password }
    })

      const { user: { id, defaultGroup }, token } = data.signinUser;
      this._saveUserData(id, token, defaultGroup);

      if (!defaultGroup) this.props.history.push('/groups');
      this.props.history.push('/payments');

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


export default compose(
  graphql(CREATE_USER_MUTATION, { name: 'createUserMutation' }),
  graphql(SIGNIN_USER_MUTATION, { name: 'signinUserMutation' })
)(Login);


// export default Login;