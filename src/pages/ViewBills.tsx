import axios from 'axios';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  LeftArrowCircle,
  RightArrowCircle,
} from 'styled-icons/boxicons-regular';
import Header from '../components/Header';
import NavTab from '../components/NavTab';
import BillType from '../type/Bill';

const ViewBills = () => {
  const [bills, setBills] = useState<BillType[]>([]);
  const [page, setPage] = useState(0);
  const navigate = useNavigate();

  const rightPage = () => {
    if (page < Math.ceil(bills.length / 10)) setPage(page + 1);
  };
  const leftPage = () => {
    if (page > 0) setPage(page - 1);
  };

  const handlePayment = (index: number) => {
    navigate('/bill/pay', { state: { bill: bills[index] } });
  };

  useEffect(() => {
    axios
      .get('http://localhost:5000/api/Bill/MyInfo', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      })
      .then((response) => setBills(response.data))
      .catch((err) => {
        console.log(err);
        toast.error('An error occured while getting your bills.');
      });
  }, []);

  return (
    <div className="m-auto w-11/12 h-5/6 bg-white rounded-xl flex flex-col border-2 border-black">
      <Header />
      <div className="w-full h-full flex">
        <NavTab />
        <div className="w-4/5 h-full px-8 py-10 flex flex-col">
          <table className="border-2 border-black rounded-xl m-auto w-3/4">
            <thead>
              <tr className="border-2 border-black">
                <th className="w-[10%]">Deadline</th>
                <th className="w-[10%]">Amount</th>
                <th>Title</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {bills.slice(page * 10, page * 10 + 10).map((bill, index) => (
                <tr key={index}>
                  <td className="border-2 border-black py-1 px-4">
                    {moment(bill.deadline).format('DD/MM/YYYY')}
                  </td>
                  <td className="border-2 border-black py-1 px-4 text-center">
                    ${bill.rate * bill.totalUsage}
                  </td>
                  <td className="border-2 border-black py-1 px-4">
                    {bill.title}
                  </td>
                  <td className="border-2 border-black text-center py-1">
                    {bill.payment ? (
                      <div className="mx-auto px-4 py-1 rounded-xl bg-lime-500 text-white w-1/2">
                        Paid
                      </div>
                    ) : (
                      <button
                        onClick={() => handlePayment(index)}
                        className="w-1/2 px-4 py-1 rounded-xl bg-red-500 text-white hover:bg-red-300 transition-colors"
                      >
                        Unpaid
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="inline-flex w-12 justify-between ml-auto mt-2">
            <LeftArrowCircle
              onClick={leftPage}
              size="24"
              className="hover:scale-105 hover:cursor-pointer"
            />
            <RightArrowCircle
              onClick={rightPage}
              size="24"
              className="hover:scale-105 hover:cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewBills;
