import axios from 'axios';
import moment from 'moment';
import React, { Fragment, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Header from '../components/Header';
import NavTab from '../components/NavTab';
import AlertType from '../type/Alert';
import { Dialog, Transition } from '@headlessui/react';

import { Search } from '@styled-icons/boxicons-regular/Search';
import { ChevronThinLeft } from '@styled-icons/entypo/ChevronThinLeft';
import { ChevronThinRight } from '@styled-icons/entypo/ChevronThinRight';

const Alerts = () => {
  const [alerts, setAlerts] = useState<AlertType[]>([]);
  const [page, setPage] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [alert, setAlert] = useState<AlertType>();
  const [search, setSearch] = useState('');
  const [length, setLength] = useState(1);

  const fetchAnnouncements = () => {
    axios
      .get(`${import.meta.env.VITE_REST_URL}/BroadcastAlert`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
        params: {
          page: page + 1,
        },
      })
      .then((response) => {
        setAlerts(response.data.result);
        setLength(response.data.metadata.count);
      })
      .catch((err) => {
        console.log(err);
        toast.error('An error occured while fetching announcements!!');
      });
  };

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (search !== '') {
      axios
        .get(`${import.meta.env.VITE_REST_URL}/BroadcastAlert/Search`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
          params: {
            keyword: search,
          },
        })
        .then((response) => {
          setAlerts(response.data.result);
          setLength(response.data.metadata.count);
        })
        .catch((err) => {
          console.log(err);
          toast.error('An error occured while fetching announcements!!');
        });
    } else fetchAnnouncements();
  };

  const rightPage = () => {
    if (page < Math.ceil(length / 10)) setPage(page + 1);
  };
  const leftPage = () => {
    if (page > 0) setPage(page - 1);
  };

  const handleOpen = (alert: AlertType) => {
    setAlert(alert);
    setIsOpen(true);
  };
  const handleClose = () => {
    setAlert(undefined);
    setIsOpen(false);
  };

  useEffect(() => {
    fetchAnnouncements();
  }, [page]);

  return (
    <>
      <div className="m-auto w-11/12 h-5/6 bg-white rounded-xl flex flex-col border-2 border-black">
        <Header />
        <div className="w-full h-full flex">
          <NavTab />
          <div className="w-4/5 h-full px-8 py-10 flex flex-col">
            <form
              onSubmit={(event) => handleSearch(event)}
              className="rounded-lg ring-1 ring-gray-500 w-full h-12 mb-8 inline-flex items-center px-6"
            >
              <button type="submit" className="mr-4">
                <Search size="24" />
              </button>
              <input
                placeholder="Search for announcement"
                onChange={(event) => setSearch(event.currentTarget.value)}
                id="search"
                className="outline-none text-lg w-full"
              />
            </form>
            <div className="h-[85%] border-black rounded-xl border-2 overflow-clip">
              <table className="w-full">
                <thead>
                  <tr className="border-black border-b-2 bg-[#FFDAB9] h-10">
                    <th className="w-[15%]">Date</th>
                    <th>Title</th>
                    <th className="w-[15%]">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {alerts.map((alert, index) => (
                    <tr key={index} className="border-y-2 border-black">
                      <td className="border-r-2 border-black px-4">
                        {moment(alert.createdAt).format('HH:mm:ss DD/MM/YYYY')}
                      </td>
                      <td className="border-x-2 border-black px-4">
                        {alert.alertTitle}
                      </td>
                      <td className="text-center border-l-2 border-black">
                        <button
                          onClick={() => handleOpen(alert)}
                          className="mx-auto w-1/2 py-1 rounded-lg bg-gray-400 text-white"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="inline-flex w-full justify-center mt-4">
              <button
                className="mx-4 hover:font-bold transition-all"
                onClick={leftPage}
              >
                <ChevronThinLeft size="24" /> Back
              </button>
              <button
                className="mx-4 hover:font-bold transition-all"
                onClick={rightPage}
              >
                Next <ChevronThinRight size="24" />
              </button>
            </div>
          </div>
        </div>
      </div>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={handleClose}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    {alert?.alertTitle}
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      {alert?.alertDescription}
                    </p>
                  </div>

                  <div className="mt-4">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-red-900 hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                      onClick={handleClose}
                    >
                      Close
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default Alerts;
