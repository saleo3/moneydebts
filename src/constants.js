const userID = localStorage.getItem('debts-user-id');
const authToken = localStorage.getItem('debts-auth-token');

const setUserID = id => localStorage.setItem('debts-user-id', id);
const setAuthToken = token => localStorage.setItem('debts-auth-token', token);

export {
    userID,
    authToken,
    setUserID,
    setAuthToken
}