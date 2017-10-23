
export function _filterById(ID) {

  return user => user.id !== ID;

} 

export function _compare( thingToCompare ) {

  return ( evaluateThis, doThis, doThat ) => evaluateThis === thingToCompare? doThis: doThat

}

export function _getCollaboratorsName(ID) {

  return collaborator => collaborator.id === ID? 'You': collaborator.name;

}