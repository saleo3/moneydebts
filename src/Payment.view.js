
import React from 'react';
import { userID } from "./constants";

const PaymentView = ({ 
    data: { description, quantity, allUsers, collaborators },
    handlers: { handler, handleCollaborators, addPayment, editPayment }
}) => (
    <div>
        Add Payment <br />
        <input type='text' value={description} onChange={e => handler('description', e)} />
        <input type='text' value={quantity} onChange={e => handler('quantity', e)} />
        {allUsers.map( 
            ({ id, name }) => (<label key={id}>
            {userID === id? 'You': name}
            <input  
                type="checkbox" 
                value={id} 
                onChange={e => handleCollaborators(e)}
                checked={collaborators.includes(id)? 'checked': ''}
            />
            </label>)
        )}
        {addPayment && <button onClick={addPayment}>ADD -></button>}
        {editPayment && <button onClick={editPayment}>Edit -></button>}
    </div>
);

export default PaymentView;