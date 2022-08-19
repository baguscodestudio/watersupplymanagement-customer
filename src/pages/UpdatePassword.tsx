import axios from 'axios';
import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { UserContext } from '../App';
import Header from '../components/Header';
import NavTab from '../components/NavTab';

const UpdatePassword = () => {
  const { user, setUser } = useContext(UserContext);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (confirmPassword !== password) {
      toast.error('Password confirmation does not match!');
    } else {
      axios
        .put(
          `${import.meta.env.VITE_REST_URL}/Customer/MyInfo`,
          {
            ...user,
            updatePassword: true,
            password: password,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            },
          }
        )
        .then((response) => {
          toast('Successfully updated password!');
          navigate('/dashboard');
        })
        .catch((err) => {
          console.log(err);
          toast('An error occured while updating your password!');
        });
    }
  };

  return (
    <div className="m-auto w-11/12 h-5/6 bg-white rounded-xl flex flex-col border-2 border-black">
      <Header />
      <div className="w-full h-full flex">
        <NavTab />
        <form
          className="w-4/5 h-full px-8 py-10 flex flex-col justify-center"
          onSubmit={handleSubmit}
        >
          <div className="w-3/6 h-1/4 rounded-lg px-4 flex items-center border-2 border-black">
            <div className="w-full my-auto text-lg">
              <div className="inline-flex w-full my-2">
                <span>Password:</span>
                <input
                  onChange={(event) => setPassword(event.currentTarget.value)}
                  type="password"
                  pattern="^(?=\P{Ll}*\p{Ll})(?=\P{Lu}*\p{Lu})(?=\P{N}*\p{N})(?=[\p{L}\p{N}]*[^\p{L}\p{N}])[\s\S]{8,}$"
                  className="border-black ml-auto border-2"
                  required
                />
              </div>
              <div className="inline-flex w-full my-2">
                <span>Confirm password:</span>
                <input
                  onChange={(event) =>
                    setConfirmPassword(event.currentTarget.value)
                  }
                  type="password"
                  pattern="^(?=\P{Ll}*\p{Ll})(?=\P{Lu}*\p{Lu})(?=\P{N}*\p{N})(?=[\p{L}\p{N}]*[^\p{L}\p{N}])[\s\S]{8,}$"
                  className="border-black ml-auto border-2"
                  required
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

export default UpdatePassword;
