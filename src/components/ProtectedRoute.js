import { Route, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ element: Element, ...rest }) => {
  const navigate = useNavigate();

  username = useSelector((state) => state.user.username);
  const isAuthenticated = username && localStorage.getItem('CatbookToken') ? true : false;

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  return isAuthenticated ? <Route {...rest} element={Element} /> : null;
};

export default ProtectedRoute;
