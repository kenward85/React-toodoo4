// Mirrors your previous useState defaults (swap names/values if needed)
export const initialState = {
  todoList: [],       // was: useState([])
  isLoading: false,   // was: useState(false)
  loadError: null,    // was: useState(null)
  isRequesting: false,// was: useState(false)
  prevTodos: null,    // was: useState(null) (for optimistic revert, if used later)
};

// Reducer per assignment: default state param + no-op cases that return { ...state }
export function reducer(state = initialState, action) {
  switch (action.type) {
    case actions.fetchTodos:
      return { ...state };
    case actions.loadTodos:
      return { ...state };
    case actions.setLoadError:
      return { ...state };
    case actions.startRequest:
      return { ...state };
    case actions.addTodo:
      return { ...state };
    case actions.endRequest:
      return { ...state };
    case actions.updateTodo:
      return { ...state };
    case actions.completeTodo:
      return { ...state };
    case actions.revertTodo:
      return { ...state };
    case actions.clearError:
      return { ...state };
    default:
      return state;
  }
}
// src/reducers/reducers.js

// Actions (named export)
export const actions = {
  // actions in useEffect that load todos
  fetchTodos: 'fetchTodos',
  loadTodos: 'loadTodos',

  // found in useEffect and addTodo to handle failed requests
  setLoadError: 'setLoadError',

  // actions found in addTodo
  startRequest: 'startRequest',
  addTodo: 'addTodo',
  endRequest: 'endRequest',

  // found in helper functions
  updateTodo: 'updateTodo',
  completeTodo: 'completeTodo',

  // reverts todos when requests fail
  revertTodo: 'revertTodo',

  // action on Dismiss Error button
  clearError: 'clearError',
};

