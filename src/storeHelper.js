export function findById(id, store) {
  return store.getState().get('todos').get(id);
}

export function getLast(store){
  let currentId = store.getState().get('currentId');
  return store.getState().getIn(['todos', currentId]);
}
