const initialState = {
  meows: []
};

export const meowReducer = (state = initialState, action) => {
  console.log('Incoming action:', action);
  switch (action.type) {
    case 'CREATE_MEOW':
      return { ...state, meows: [...state.meows, action.payload] };
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
      const updatedMeows = state.meows.filter((meow) => meow._id !== action.payload);
      console.log('After Deletion: ', updatedMeows);
      return {
        ...state,
        meows: updatedMeows
      };
    default:
      return state;
    case 'SET_MEOWS':
      return {
        ...state,
        meows: action.payload
      };
  }
};
