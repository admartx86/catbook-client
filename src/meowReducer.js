const initialState = {
  meows: [],
  isEditing: false,
  showEditForm: false
};

export const meowReducer = (state = initialState, action) => {
  console.log('payload', action.payload);
  console.log('state', state);
  console.log('type', action.type); 
  switch (action.type) {
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
      const updatedMeows = state.meows.filter((meow) => meow._id !== action.payload);
      console.log('After Deletion: ', updatedMeows);
      // Additional logic to update the original meow's remeowedBy
      const deletedMeow = state.meows.find((meow) => meow._id === action.payload);
      if (deletedMeow && deletedMeow.isARemeow) {
        const originalMeowIndex = state.meows.findIndex(
          (meow) => meow._id === deletedMeow.embeddedMeow
        );
        if (originalMeowIndex !== -1) {
          // updatedMeows[originalMeowIndex].remeowedBy = updatedMeows[
          //   originalMeowIndex
          // ].remeowedBy.filter((id) => id !== userId);
          const updatedRemeowedBy = updatedMeows[originalMeowIndex].remeowedBy.filter(
            (id) => id !== userId
          );

          const updatedOriginalMeow = {
            ...updatedMeows[originalMeowIndex],
            remeowedBy: updatedRemeowedBy
          };

          const finalMeows = [
            ...updatedMeows.slice(0, originalMeowIndex),
            updatedOriginalMeow,
            ...updatedMeows.slice(originalMeowIndex + 1)
          ];
        }
      }
      // return {
      //   ...state,
      //   meows: updatedMeows
      // };
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
    case 'DECREMENT_REMEOW_COUNT':
      console.log('Decrementing remeow count for:', action.payload);
      const meowIndex = state.meows.findIndex((meow) => meow._id === action.payload);
      if (meowIndex !== -1) {
        const updatedMeow = {
          ...state.meows[meowIndex],
          remeowedBy: state.meows[meowIndex].remeowedBy.slice(0, -1)
        };
        return {
          ...state,
          meows: [
            ...state.meows.slice(0, meowIndex),
            updatedMeow,
            ...state.meows.slice(meowIndex + 1)
          ]
        };
      }
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
