import {fromJS, List, Map} from 'immutable';
import Todo from './todo';

const INITIAL_STATE = fromJS({todos: {}, currentId: 0});

export default function reducer(state=INITIAL_STATE, action){

  switch(action.type) {
    case 'ADD':
      let todo = new Todo(action.todo, state.get('currentId'));
      return state.updateIn(['todos'], todos => todos.set(todo.id, todo))
        .update('currentId', id => id + 1);
    case 'DELETE_ALL':
      return state.set('todos', Map());
    case 'EDIT':
      return state.updateIn(['todos', action.id], todo => Object.assign(todo, action.patch));
    case 'DELETE':
      return state.deleteIn(['todos', action.id]);
  }
  return state;
}
