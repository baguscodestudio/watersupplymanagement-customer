import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { UserCircle } from '@styled-icons/boxicons-regular/UserCircle';
import { Bell } from 'styled-icons/bootstrap';
import { Logout } from 'styled-icons/heroicons-outline';
import { UserContext } from '../App';
import UserType from '../type/User';

const Header = () => {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userData');
    setUser({} as UserType);
    toast('Successfully logged out!');
    navigate('/');
  };

  return (
    <div className="w-full inline-flex h-16 border-b-2 border-black items-center">
      <span className="ml-6 font-bold text-xl">Water Supply Management</span>
      <div className="ml-auto mr-6 flex items-center">
        <div className="mx-4 text-lg">
          <UserCircle size="20" />
          {user.username}
        </div>
        <Logout
          size="24"
          className="mx-2 hover:cursor-pointer hover:text-red-700"
          onClick={handleLogout}
        />
      </div>
    </div>
  );
};

export default Header;
