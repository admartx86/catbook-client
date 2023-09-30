import axios from 'axios';

export const setMeows = (meows) => ({
  type: 'SET_MEOWS',
  payload: meows
});

export const createMeow =
  ({ meowText, authorPhoto, authorName, authorUsername }) =>
  async (dispatch) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/meows/`,
        {
          authorPhoto,
          authorName,
          authorUsername,
          meowText
        },
        { withCredentials: true }
      );

      console.log('Created Meow:', response.data);

      dispatch({
        type: 'CREATE_MEOW',
        payload: response.data
      });
    } catch (error) {
      console.error('Error creating new Meow:', error);
    }
  };

export const readMeow = (meowId) => ({
  type: 'READ_MEOW',
  payload: meowId
});

export const updateMeow = (updatedMeow) => async (dispatch) => {
  try {
    const { meowId, meowText } = updatedMeow;
    await axios.put(
      `${process.env.REACT_APP_BACKEND_URL}/meows/${meowId}`,
      {
        meowId: meowId,
        meowText: 'Updated meow text, just for testing testing 1 2 3!'
      },
      { withCredentials: true }
    );
    dispatch({
      type: 'UPDATE_MEOW',
      payload: updatedMeow
    });
  } catch (error) {
    console.error('Error updating Meow:', error);
  }
};

export const deleteMeow = (meowId) => async (dispatch) => {
  try {
    await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/meows/${meowId}`, {
      withCredentials: true
    });
    console.log('Meow deleted');
    dispatch({
      type: 'DELETE_MEOW',
      payload: meowId
    });
  } catch (error) {
    console.error('Error deleting Meow:', error);
  }
};
