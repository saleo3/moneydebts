
export function _filterById(ID) {

  return user => user.id !== localStorage.getItem(ID);

} 

export function _compare( thingToCompare ) {

  return ( evaluateThis, doThis, doThat ) => evaluateThis === thingToCompare? doThis: doThat

}

export function _getCollaboratorsName(collaborator, index) {

  return collaborator.name

}