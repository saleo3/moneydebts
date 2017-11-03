import React, { Component } from "react";
import { graphql, compose } from 'react-apollo';
import { setUserID, setAuthToken, setGroupID, setParties } from "./constants";
import { CREATE_USER_MUTATION, SIGNIN_USER_MUTATION } from "./gql";

class Login extends Component {

  state = {
    email: 'alisons0216@gmail.com',
    password: '162603',
  }

  inputHandler(input, {target}) {
    this.setState( () => ({ [input]: target.value }) );    
  }

  _saveUserData(id, token, groupId, parties) {
    setUserID(id);
    setAuthToken(token);
    setGroupID(groupId);
    setParties(parties);
  }

  async signinupHandler(isLogged) {
    const { email, password } = this.state;
    let operation = 'signinUserMutation';

    if(!isLogged) operation = 'createUserMutation';

    const { data } = await this.props[operation]({
      variables: { email, password }
    })

      const { user: { id, defaultGroup, createdParties }, token } = data.signinUser;
      this._saveUserData(id, token, defaultGroup, createdParties);
      
      if (id && defaultGroup) window.location = '/payments';
      if( id && !defaultGroup) window.location = '/groups';

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