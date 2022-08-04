import axios from 'axios';
import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { UserContext } from '../App';
import Header from '../components/Header';
import NavTab from '../components/NavTab';

const Profile = () => {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    axios
      .put(
        'http://localhost:5000/api/Customer/MyInfo',
        {
          ...user,
          updatePassword: false,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        }
      )
      .then((response) => {
        toast('Successfully updated profile!');
        navigate('/dashboard');
      })
      .catch((err) => {
        console.log(err);
        toast('An error occured while updating your profile!');
      });
  };

  return (
    <div className="m-auto w-11/12 h-5/6 bg-white rounded-xl flex flex-col border-2 border-black">
      <Header />
      <div className="w-full h-full flex">
        <NavTab />
        <form
          className="w-4/5 h-full px-8 py-10 flex flex-col"
          onSubmit={handleSubmit}
        >
          <div className="w-3/6 rounded-lg p-4 flex items-center border-2 border-black">
            <div className="w-full my-auto text-lg">
              <div className="inline-flex w-full my-2">
                <span>Username:</span>
                <input
                  value={user.username}
                  onChange={(event) =>
                    setUser({ ...user, username: event.currentTarget.value })
                  }
                  className="border-black ml-auto border-2 px-4"
                  required
                />
              </div>
              <div className="inline-flex w-full my-2">
                <span>Email:</span>
                <input
                  value={user.email}
                  onChange={(event) =>
                    setUser({ ...user, email: event.currentTarget.value })
                  }
                  className="border-black ml-auto border-2 px-4"
                  required
                />
              </div>
              <div className="inline-flex w-full my-2">
                <span>Full Name:</span>
                <input
                  value={user.fullName}
                  onChange={(event) =>
                    setUser({ ...user, fullName: event.currentTarget.value })
                  }
                  className="border-black ml-auto border-2 px-4"
                />
              </div>
              <div className="inline-flex w-full my-2">
                <span>Phone:</span>
                <input
                  value={user.phone}
                  onChange={(event) =>
                    setUser({ ...user, phone: event.currentTarget.value })
                  }
                  className="border-black ml-auto border-2 px-4"
                />
              </div>
              <div className="inline-flex w-full my-2">
                <span>Address:</span>
                <input
                  value={user.address}
                  onChange={(event) =>
                    setUser({ ...user, address: event.currentTarget.value })
                  }
                  className="border-black ml-auto border-2 px-4"
                />
              </div>
            </div>
          </div>
          <div className="inline-flex mt-16">
            <Link
              to="/dashboard"
              className="px-4 py-1 text-lg border-black border-2 rounded-lg mr-16"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="px-4 py-1 text-lg border-black border-2 rounded-lg"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
