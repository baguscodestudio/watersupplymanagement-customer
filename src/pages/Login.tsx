import axios from 'axios';
import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { UserContext } from '../App';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogin = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    axios
      .post('http://localhost:5000/api/Customer/Login', {
        username: username,
        password: password,
      })
      .then((response) => {
        if (response.status === 200) {
          localStorage.setItem('accessToken', response.data.token);
          localStorage.setItem('userData', JSON.stringify(response.data.user));
          console.log(response.data.user);
          setUser({ ...response.data.user });
          console.log(response);
          toast('Logged in successfully');
          navigate('/dashboard');
        }
      })
      .catch((err) => {
        console.log(err);
        toast(err.response.data.message);
      });
  };

  return (
    <form
      onSubmit={handleLogin}
      className="m-auto w-1/4 h-3/5 bg-[#FFF5EE] rounded-2xl shadow-xl px-6 py-10 flex flex-col"
    >
      <div className="font-semibold underline text-xl mb-8">LOGIN</div>
      <div className="w-full inline-flex text-lg my-2 items-center">
        <span>Username:</span>
        <input
          onChange={(event) => setUsername(event.currentTarget.value)}
          required
          className="ml-auto px-2 border-2 border-black"
        />
      </div>
      <div className="w-full inline-flex text-lg my-2 items-center">
        <span>Password:</span>
        <input
          onChange={(event) => setPassword(event.currentTarget.value)}
          required
          type="password"
          className="ml-auto px-2 border-2 border-black"
        />
      </div>
      <button
        type="submit"
        className="w-5/6 my-8 border-2 border-black py-1 text-lg rounded-lg bg-white mx-auto"
      >
        LOGIN
      </button>
    </form>
  );
};

export default Login;
