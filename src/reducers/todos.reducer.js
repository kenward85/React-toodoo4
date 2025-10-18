// src/reducers/todos.reducer.js
export const actions = {
   //actions in useEffect that loads todos
    fetchTodos: 'fetchTodos',
    loadTodos: 'loadTodos',
    //found in useEffect and addTodo to handle failed requests
    setLoadError: 'setLoadError',
    //actions found in addTodo
    startRequest: 'startRequest',
    addTodo: 'addTodo',
    endRequest: 'endRequest',
    //found in helper functions 
    updateTodo: 'updateTodo',
    completeTodo: 'completeTodo',
    //reverts todos when requests fail
    revertTodo: 'revertTodo',
    //action on Dismiss Error button
    clearError: 'clearError',
};

// Mirrors your previous useState defaults
export const initialState = {
  todoList: [],
  isLoading: false,
  isSaving: false,
  loadError: null,     // keeping if you referenced it elsewhere
  errorMessage: '',    // used per instructions
  isRequesting: false, // if used elsewhere
  prevTodos: null,     // if you use snapshots
};

// Helper: normalize an Airtable-like record into a todo
const mapRecordToTodo = (rec) => {
  // Supports { id, fields: {...} } or plain objects
  const fields = rec?.fields ?? rec ?? {};
  const id = rec?.id ?? fields.id;
  const isCompleted =
    (fields.isCompleted ?? fields.completed ?? false);

  return { id, ...fields, isCompleted };
};

export function reducer(state = initialState, action) {
  switch (action.type) {
    //
    // useEffect (Pessimistic UI)
    // Related actions: fetchTodos, loadTodos, setLoadError
    //
    case actions.fetchTodos: {
      // Add isLoading: true
      return {
        ...state,
        isLoading: true,
      };
    }

    case actions.loadTodos: {
      // Map action.records -> todos
      const todos = (action.records ?? []).map(mapRecordToTodo);

      return {
        ...state,
        todoList: todos,  // assign mapped array
        isLoading: false, // set to false
      };
    }

    case actions.setLoadError: {
      return {
        ...state,
        errorMessage: action?.error?.message ?? '',
        isLoading: false,
        isSaving: false,
      };
    }

    //
    // addTodo (Pessimistic UI)
    // Related actions: startRequest, addTodo, endRequest, setLoadError
    //
    case actions.startRequest: {
      // isSaving true
      return {
        ...state,
        isSaving: true,
      };
    }

    case actions.addTodo: {
      // Copy logic that creates savedTodo and ensure isCompleted exists
      // Expect either action.record (Airtable response) or action.savedTodo
      const source = action.record ?? action.savedTodo ?? {};
      const savedTodo = mapRecordToTodo(source);

      return {
        ...state,
        todoList: [savedTodo, ...state.todoList],
        isSaving: false,
      };
    }

    case actions.endRequest: {
      // Set both isLoading & isSaving to false
      return {
        ...state,
        isLoading: false,
        isSaving: false,
      };
    }

    //
    // updateTodo, completeTodo (Optimistic UI)
    // Related actions: updateTodo, completeTodo, revertTodo
    //
    // If revertTodo logic is the same as updateTodo, put revertTodo
    // directly above updateTodo and FALL THROUGH (no return here).
    case actions.revertTodo:
      // fall through to actions.updateTodo

    case actions.updateTodo: {
      // Use action.editedTodo
      const edited = action.editedTodo ?? {};
      const updatedTodos = state.todoList.map((t) =>
        t.id === edited.id ? { ...t, ...edited } : t
      );

      // Build updated state
      const updatedState = {
        ...state,
        todoList: updatedTodos,
      };

      // If there's an error on the action, add errorMessage
      if (action.error) {
        updatedState.errorMessage = action.error.message ?? '';
      }

      return updatedState;
    }

    case actions.completeTodo: {
      // Replace id with action.id
      const updatedTodos = state.todoList.map((t) =>
        t.id === action.id ? { ...t, isCompleted: true } : t
      );

      return {
        ...state,
        todoList: updatedTodos,
      };
    }

    //
    // Dismiss Error Button
    //
    case actions.clearError: {
      return {
        ...state,
        errorMessage: '',
      };
    }

    default:
      return state;
  }
}

