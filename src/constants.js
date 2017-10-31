const userID = localStorage.getItem('debts-user-id');
const authToken = localStorage.getItem('debts-auth-token');
const groupID = localStorage.getItem('debts-group-id');

const setUserID = id => localStorage.setItem('debts-user-id', id);
const setAuthToken = token => localStorage.setItem('debts-auth-token', token);
const setGroupID = id => localStorage.setItem('debts-group-id', id);

export {
    userID,
    authToken,
    setUserID,
    setAuthToken,
    groupID,
    setGroupID
}