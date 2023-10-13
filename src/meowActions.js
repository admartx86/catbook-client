import axios from 'axios';

export const setMeows = (meows) => ({
  type: 'SET_MEOWS',
  payload: meows
});

export const createMeow = (formData) => async (dispatch) => {
  try {
    console.log('Dispatching createMeow action');
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      withCredentials: true
    };

    const response = await axios.post(
      `${process.env.REACT_APP_BACKEND_URL}/meows/`,
      formData,
      config
    );
    console.log('API Response:', response.data);

    dispatch({
      type: 'CREATE_MEOW',
      payload: response.data
    });
  } catch (error) {
    console.log('Error creating Meow:', error);
    if (error.response) {
      console.error('Server response:', error.response.data);
    }
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
        meowText
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

export const decrementRemeowCount = (originalMeowId) => ({
  type: 'DECREMENT_REMEOW_COUNT',
  payload: originalMeowId
});

export const deleteMeow = (meowId, isSingleMeow, navigate) => async (dispatch) => {
  try {
    const response = await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/meows/${meowId}`, {
      withCredentials: true
    });
    if (response.status === 200) {
      dispatch({
        type: 'DELETE_MEOW',
        payload: meowId
      });

      if (isSingleMeow) {
        navigate('/home');
      }

      const meowToDelete = await Meow.findById(meowId);
      if (meowToDelete.isARemeow && meowToDelete.embeddedMeow) {
        dispatch(decrementRemeowCount(meowToDelete.embeddedMeow));
      }
    }
  } catch (error) {
    console.error('Error deleting Meow:', error);
  }
};

export const likeMeow = (meowId) => async (dispatch) => {
  try {
    const response = await axios.post(
      `${process.env.REACT_APP_BACKEND_URL}/meows/${meowId}/like`,
      {},
      { withCredentials: true }
    );

    dispatch({
      type: 'LIKE_MEOW',
      payload: response.data
    });
  } catch (error) {
    console.error('Error liking the meow:', error);
  }
};

export const unlikeMeow = (meowId) => async (dispatch) => {
  try {
    const response = await axios.delete(
      `${process.env.REACT_APP_BACKEND_URL}/meows/${meowId}/unlike`,
      { withCredentials: true }
    );

    dispatch({
      type: 'UNLIKE_MEOW',
      payload: response.data
    });
  } catch (error) {
    console.error('Error unliking the meow:', error);
  }
};
