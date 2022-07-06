import React, { useContext } from 'react';
import { UserContext } from '../App';
import Header from '../components/Header';
import NavTab from '../components/NavTab';

const Home = () => {
  const { user } = useContext(UserContext);
  return (
    <div className="m-auto w-11/12 h-5/6 bg-white rounded-xl flex flex-col border-2 border-black">
      <Header />
      <div className="w-full h-full flex">
        <NavTab />
        <div className="w-4/5 h-full px-8 py-10">
          <span className="text-xl font-bold">
            Good evening {user.username}!
          </span>
        </div>
      </div>
    </div>
  );
};

export default Home;
