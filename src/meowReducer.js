const initialState = {
  meows: [],
  isEditing: false,
  isEditingIsLocked: false,
  showEditForm: false
};

export const meowReducer = (state = initialState, action) => {
  console.log('payload', action.payload);
  console.log('state', state);
  console.log('type', action.type);
  switch (action.type) {
    case 'APPEND_REMEOWED_BY': {
      const { meowId, embeddedMeow } = action.payload;
      const embeddedMeowIndex = state.meows.findIndex((meow) => meow._id === embeddedMeow._id);
      if (embeddedMeowIndex === -1) {
        return state;
      }
      const updatedMeow = {
        ...state.meows[embeddedMeowIndex],
        remeowedBy: [...state.meows[embeddedMeowIndex].remeowedBy, meowId]
      };
      return {
        ...state,
        meows: [
          ...state.meows.slice(0, embeddedMeowIndex),
          updatedMeow,
          ...state.meows.slice(embeddedMeowIndex + 1)
        ]
      };
    }
    case 'REMOVE_REMEOWED_BY': {
      const { meowId, embeddedMeow } = action.payload;
      const embeddedMeowIndex = state.meows.findIndex((meow) => meow._id === embeddedMeow._id);
      if (embeddedMeowIndex === -1) {
        return state;
      }
      const remeowedByIndex = state.meows[embeddedMeowIndex].remeowedBy.indexOf(meowId);
      if (remeowedByIndex === -1) {
        return state;
      }
      const updatedRemeowedBy = [
        ...state.meows[embeddedMeowIndex].remeowedBy.slice(0, remeowedByIndex),
        ...state.meows[embeddedMeowIndex].remeowedBy.slice(remeowedByIndex + 1)
      ];
      const updatedMeow = {
        ...state.meows[embeddedMeowIndex],
        remeowedBy: updatedRemeowedBy
      };
      return {
        ...state,
        meows: [
          ...state.meows.slice(0, embeddedMeowIndex),
          updatedMeow,
          ...state.meows.slice(embeddedMeowIndex + 1)
        ]
      };
    }
    case 'CREATE_MEOW':
      return { ...state, meows: [action.payload, ...state.meows] };
    case 'READ_MEOW':
      const selectedMeow = state.meows.find((meow) => meow._id === action.payload);
      return { ...state, selectedMeow: selectedMeow };
    case 'UPDATE_MEOW':
      return {
        ...state,
        meows: state.meows.map((meow) =>
          meow._id === action.payload.meowId ? action.payload : meow
        )
      };
    case 'DELETE_MEOW':
      console.log('Before Deletion: ', state.meows);
      let updatedMeows = state.meows.filter((meow) => meow._id !== action.payload._id);
      console.log('After Deletion: ', updatedMeows);
      return {
        ...state,
        meows: updatedMeows
      };

    case 'SET_MEOWS':
      return {
        ...state,
        meows: action.payload
      };
    case 'LIKE_MEOW':
    case 'UNLIKE_MEOW':
      return {
        ...state,
        meows: state.meows.map((meow) => (meow._id === action.payload._id ? action.payload : meow))
      };
    case 'SET_IS_EDITING':
      return {
        ...state,
        isEditing: true
      };
    case 'CLEAR_IS_EDITING':
      return {
        ...state,
        isEditing: false
      };
    case 'SET_LOCK_FOR_CLEAR_IS_EDITING':
      return {
        ...state,
        isEditingIsLocked: true
      };
    case 'CLEAR_LOCK_FOR_CLEAR_IS_EDITING':
      return {
        ...state,
        isEditingIsLocked: false
      };

    case 'SET_SHOW_EDIT_FORM':
      return {
        ...state,
        showEditForm: true
      };
    case 'CLEAR_SHOW_EDIT_FORM':
      return {
        ...state,
        showEditForm: false
      };
    default:
      return state;
  }
};
