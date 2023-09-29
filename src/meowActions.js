import axios from 'axios';

// meowActions.js


export const setMeows = (meows) => ({
  type: "SET_MEOWS",
  payload: meows,
});



export const createMeow = (meow) => ({
  type: "CREATE_MEOW",
  payload: meow,
});

export const readMeow = (meowId) => ({
  type: "READ_MEOW",
  payload: meowId,
});

export const updateMeow = (updatedMeow) => async (dispatch) => {
  try {
    
    const { meowId, meowText } = updatedMeow;
    await axios.put(`${process.env.REACT_APP_BACKEND_URL}/meows/${meowId}`, 
        {
          meowId: meowId,
          meowText: 'Updated meow text, just for testing testing 1 2 3!',
          // ... other updated fields
        }, { withCredentials: true });
      dispatch ({
  type: "UPDATE_MEOW",
  payload: updatedMeow,
}); } catch (error) {
    console.error('Error updating Meow:', error);
  }
};



export const deleteMeow = (meowId) => async (dispatch) => {
  try {
    await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/meows/${meowId}`, { withCredentials: true });
    console.log('Meow deleted');
    dispatch({
      type: "DELETE_MEOW",
      payload: meowId,
    });
  } catch (error) {
    console.error('Error deleting Meow:', error);
    // You can dispatch an error action here if you like
  }
};
