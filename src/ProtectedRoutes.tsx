import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { UserContext } from './App';
import UserType from './type/User';

const ProtectedRoutes = () => {
  const [access, setAccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const { setUser } = useContext(UserContext);

  const useAuth = async () => {
    await axios
      .get('http://localhost:5000/api/TestAuthorization', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      })
      .then((response) => {
        if (response.status === 200) {
          setAccess(true);
          setLoading(false);
          setUser(JSON.parse(localStorage.getItem('userData')!) as UserType);
        } else {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('userData');
          setAccess(false);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.log(err);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('userData');
        setAccess(false);
        setLoading(false);
      });
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
