import {fromJS, List, Map} from 'immutable';
import Todo from './todo';
import shortid from 'shortid'

const INITIAL_STATE = fromJS({todos: {}});

export default function reducer(state=INITIAL_STATE, action){

  switch(action.type) {
    case 'ADD':
      let newId = shortid.generate();
      let todo = new Todo(action.todo, newId);
      return state.updateIn(['todos'], todos => todos.set(todo.id, todo))
        .update('currentId', id => newId );
    case 'DELETE_ALL':
      return state.set('todos', Map());
    case 'EDIT':
      return state.updateIn(['todos', action.id], todo => Object.assign({}, todo, action.patch));
    case 'DELETE':
      return state.deleteIn(['todos', action.id]);
  }
  return state;
}
