import axios from 'axios';
import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { UserContext } from '../App';
import Header from '../components/Header';
import NavTab from '../components/NavTab';

const CreateReport = () => {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (title === '' || desc === '') {
      toast.error('Please fill in all the form!');
    } else {
      axios
        .post(
          `${import.meta.env.VITE_REST_URL}/ReportTicket`,
          {
            title: title,
            description: desc,
            status: 'Active',
            customerId: user.userId,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            },
          }
        )
        .then((response) => {
          toast('Successfully submitted report');
          navigate('/report');
        })
        .catch((err) => {
          toast.error('An error occured while creating report');
        });
    }
  };

  return (
    <div className="m-auto w-11/12 h-5/6 bg-white rounded-xl flex flex-col border-2 border-black">
      <Header />
      <div className="w-full h-full flex">
        <NavTab />
        <div className="w-4/5 h-full px-8 py-10 flex flex-col">
          <form className="w-1/2 flex flex-col" onSubmit={handleSubmit}>
            <div className="w-full rounded-xl px-6 py-8 border-2 border-black">
              <div className="flex flex-col w-1/2 mb-4">
                <span>Title of Issue</span>
                <input
                  className="border-2 border-black px-2"
                  required
                  onChange={(event) => setTitle(event.currentTarget.value)}
                />
              </div>
              <div className="flex flex-col w-full">
                <span>Description</span>
                <textarea
                  className="border-2 border-black px-2 w-full"
                  rows={10}
                  required
                  onChange={(event) => setDesc(event.currentTarget.value)}
                />
              </div>
            </div>
            <button
              type="submit"
              className="px-4 py-1 border-2 border-black rounded-lg mt-4 mx-auto hover:bg-slate-200 transition-colors"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateReport;
