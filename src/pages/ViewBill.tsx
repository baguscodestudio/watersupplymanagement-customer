import axios from 'axios';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import Header from '../components/Header';
import NavTab from '../components/NavTab';
import BillType from '../type/Bill';
import { formatter } from '../utils';

const ViewBill = () => {
  const [bill, setBill] = useState<BillType>();
  const params = useParams();

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/Bill/MyInfo/${params.id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      })
      .then((response) => setBill(response.data))
      .catch((err) => {
        console.log(err);
        toast.error('An error occured while fetching bill');
      });
  }, []);

  return (
    <div className="m-auto w-11/12 h-5/6 bg-white rounded-xl flex flex-col border-2 border-black">
      <Header />
      <div className="w-full h-full flex">
        <NavTab />
        <div className="w-4/5 h-full px-8 py-10 flex flex-col">
          <div className="w-2/5 mx-auto border-black rounded-lg border-2 h-5/6">
            <div className="px-4 py-1 text-xl border-b-2 border-black font-bold">
              Payment Summary
            </div>
            <div className="px-4 py-4 flex flex-col h-5/6">
              <div className="inline-flex w-full justify-between">
                <span>Water Usage:</span>
                <span>{bill && formatter.format(bill.totalUsage)}L</span>
              </div>
              <div className="inline-flex w-full justify-between">
                <span>Month:</span>
                <span>{moment(bill?.month, 'MM').format('MMMM')}</span>
              </div>
              <div className="inline-flex w-full justify-between">
                <span>Year:</span>
                <span>{bill?.year}</span>
              </div>
              <div className="inline-flex w-full justify-between">
                <span>Title:</span>
                <span>{bill?.title}</span>
              </div>
              <div className="inline-flex w-full justify-between">
                <span>Created:</span>
                <span>{moment(bill?.createdAt).format('DD/MM/YYYY')}</span>
              </div>
              <div className="inline-flex w-full justify-between">
                <span>Deadline:</span>
                <span>{moment(bill?.deadline).format('DD/MM/YYYY')}</span>
              </div>
              {bill?.payment && (
                <>
                  <span className="mt-12 text-lg font-semibold">
                    Payment Information
                  </span>
                  <div className="w-full mt-2 border-2 px-2 border-gray-900 py-1">
                    <div className="inline-flex w-full justify-between">
                      <span>Paid At:</span>
                      <span>
                        {moment(bill?.payment.createdAt).format('DD/MM/YYYY')}
                      </span>
                    </div>
                    <div className="inline-flex w-full justify-between">
                      <span>Card Number:</span>
                      <span>{bill?.payment.cardNumber}</span>
                    </div>
                  </div>
                </>
              )}
              <div className="inline-flex w-full justify-between mt-auto">
                <span className="font-bold">Water Rate:</span>
                <span>
                  ${bill?.rate}/m<sup>3</sup>
                </span>
              </div>
              <div className="inline-flex w-full justify-between mt-2">
                <span className="font-bold">Total:</span>
                <span>
                  $
                  {bill &&
                    formatter.format((bill.rate * bill.totalUsage) / 1000)}
                </span>
              </div>
            </div>
          </div>
          <Link
            to="/bill"
            className="px-4 py-1 border-2 border-black rounded-lg mt-4 hover:bg-slate-200 transition-colors w-fit mx-auto"
          >
            Back
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ViewBill;
