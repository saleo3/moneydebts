import React, { Component } from 'react';
import { parties, groupID, userID, setGroupID } from "./constants";
import { graphql } from 'react-apollo';
import { UPDATE_DEFAULT_GROUP } from './gql';

class Groups extends Component {

    state = {
        groupID
    }

    async updateDefaultGroup({ target }) {

        await this.props.updateDefaultGroup({
            variables: {
                user_id: userID,
                group_id: target.value

            }
        });

        setGroupID(target.value);
        this.setState( () => ({ groupID: target.value }) )


    }

    render() {

        return <div>
            {parties.map( ({id, name, createdBy: { name: user, id: by } }, k) => {
                return <label key={k}> 
                    {`${name} by ${userID === by? 'You': user}`} 
                    <input 
                        type="radio" 
                        value={id} 
                        checked={(this.state.groupID === id) && 'checked'} 
                        onChange={e => this.updateDefaultGroup(e)}
                    />
                    <br/> 
                </label>
            })}
        </div>
    }
    
} 

export default graphql(UPDATE_DEFAULT_GROUP, { 
    name: 'updateDefaultGroup'
})(Groups);