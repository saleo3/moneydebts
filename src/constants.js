const userID = localStorage.getItem('debts-user-id');
const groupID = localStorage.getItem('debts-group-id');
const parties = JSON.parse(localStorage.getItem('debts-parties'));
const authToken = localStorage.getItem('debts-auth-token');

const setUserID = id => localStorage.setItem('debts-user-id', id);
const setAuthToken = token => localStorage.setItem('debts-auth-token', token);
const setGroupID = id => localStorage.setItem('debts-group-id', id);
const setParties = parties => localStorage.setItem('debts-parties', JSON.stringify(parties));

export {
    userID,
    authToken,
    setUserID,
    setAuthToken,
    groupID,
    setGroupID,
    setParties,
    parties
}