import axios from 'axios';

export const appendRemeowedBy = (meowId, embeddedMeow) => (dispatch) => {
  dispatch({
    type: 'APPEND_REMEOWED_BY',
    payload: {
      meowId,
      embeddedMeow
    }
  });
};

export const removeRemeowedBy = (meowId, embeddedMeow) => (dispatch) => {
  dispatch({
    type: 'REMOVE_REMEOWED_BY',
    payload: {
      meowId,
      embeddedMeow
    }
  });
};

export const setMeows = (meows) => ({
  type: 'SET_MEOWS',
  payload: meows
});

export const createMeow = (formData) => async (dispatch) => {
  try {
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
    if (response.data.isARemeow) {
      dispatch(appendRemeowedBy(response.data._id, response.data.embeddedMeow));
    }
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

export const deleteMeow = (meowId, isARemeow, embeddedMeow, navigate) => async (dispatch) => {
  try {
    const response = await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/meows/${meowId}`, {
      withCredentials: true
    });
    if (response.status === 200) {
      if (isARemeow) {
        dispatch(removeRemeowedBy(meowId, embeddedMeow));
      }
      dispatch({
        type: 'DELETE_MEOW',
        payload: response.data.placeholderMeow
      });
    }
  } catch (error) {
  } finally {
    navigate('/home');
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

export const setIsEditing = () => ({
  type: 'SET_IS_EDITING'
});

export const clearIsEditing = () => ({
  type: 'CLEAR_IS_EDITING'
});

export const setLockForClearIsEditing = () => ({
  type: 'SET_LOCK_FOR_CLEAR_IS_EDITING'
});

export const clearLockForClearIsEditing = () => ({
  type: 'CLEAR_LOCK_FOR_CLEAR_IS_EDITING'
});

export const setShowEditForm = () => ({
  type: 'SET_SHOW_EDIT_FORM'
});

export const clearShowEditForm = () => ({
  type: 'CLEAR_SHOW_EDIT_FORM'
});
