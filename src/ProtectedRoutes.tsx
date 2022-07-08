import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { UserContext } from './App';
import UserType from './type/User';

const ProtectedRoutes = () => {
  const [access, setAccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const { setUser } = useContext(UserContext);

  const useAuth = () => {
    let token = localStorage.getItem('accessToken');
    let userData = localStorage.getItem('userData');
    if (token && userData) {
      setAccess(true);
      setLoading(false);
      setUser(JSON.parse(localStorage.getItem('userData')!) as UserType);
    } else {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('userData');
      setAccess(false);
      setLoading(false);
    }
  };
  useEffect(() => {
    useAuth();
  }, []);

  return loading ? (
    <div>Loading</div>
  ) : access ? (
    <Outlet />
  ) : (
    <Navigate to="/" />
  );
};

export default ProtectedRoutes;
