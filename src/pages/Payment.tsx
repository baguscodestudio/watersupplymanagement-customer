import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import NavTab from '../components/NavTab';
import BillType from '../type/Bill';

import * as dropin from 'braintree-web-drop-in';
import axios from 'axios';
import { toast } from 'react-toastify';
import { formatter } from '../utils';

type LocationState = {
  bill: BillType;
  from: {
    path: string;
  };
};

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [bill, setBill] = useState<BillType>();
  const [braintreeInstance, setBraintreeInstance] = useState<dropin.Dropin>();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (braintreeInstance) {
      braintreeInstance.requestPaymentMethod((error, payload) => {
        if (error) {
          console.error(error);
        } else {
          const paymentMethodNonce = payload.nonce;
          axios
            .post(
              'http://localhost:5000/api/Payment/',
              {
                billId: bill?.billId,
                paymentNonce: paymentMethodNonce,
              },
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem(
                    'accessToken'
                  )}`,
                },
              }
            )
            .then((response) => {
              if (response.data.success) {
                navigate('/bill');
                toast('Payment made successfully');
              } else {
                toast.error('Payment was not successful');
              }
            });
        }
      });
    }
  };

  const initializeBraintree = () => {
    axios
      .get('http://localhost:5000/api/Payment/ClientToken', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      })
      .then((response) => {
        dropin.create(
          {
            // insert your tokenization key or client token here
            authorization: response.data.token,
            container: '#braintree-payment',
          },
          function (error, instance) {
            if (error) console.error(error);
            else setBraintreeInstance(instance);
          }
        );
      });
  };

  useEffect(() => {
    if (location.state === null) navigate('/bill');
    else {
      const { bill } = location.state as LocationState;
      setBill(bill);

      if (braintreeInstance) {
        braintreeInstance.teardown().then(() => {
          initializeBraintree();
        });
      } else {
        initializeBraintree();
      }
    }
  }, []);

  return (
    <div className="m-auto w-11/12 h-5/6 bg-white rounded-xl flex flex-col border-2 border-black">
      <Header />
      <div className="w-full h-full flex">
        <NavTab />
        <form
          className="w-4/5 h-full px-8 py-10 flex flex-col"
          onSubmit={(event) => handleSubmit(event)}
        >
          <div className="h-4/5 inline-flex w-full justify-around">
            <div className="w-3/5 border-black rounded-lg border-2 h-full">
              <div className="w-full py-1 px-6 border-b-2 border-black text-xl font-bold">
                Payment
              </div>
              <div
                className="grid gap-6 px-8 py-4"
                id="braintree-payment"
              ></div>
            </div>
            <div className="w-1/5 border-black rounded-lg border-2 h-full">
              <div className="px-4 py-1 text-xl border-b-2 border-black font-bold">
                Payment Summary
              </div>
              <div className="px-4 py-4 flex flex-col h-5/6">
                <div className="inline-flex w-full justify-between">
                  <span>Water Usage:</span>
                  <span>{bill && formatter.format(bill.totalUsage)}L</span>
                </div>
                <div className="inline-flex w-full justify-between mt-auto">
                  <span className="font-bold">Total:</span>
                  <span>
                    $
                    {bill &&
                      formatter.format((bill.rate * bill.totalUsage) / 1000)}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <button
            type="submit"
            className="mt-12 mx-auto py-1 px-6 rounded-lg border-2 border-black"
          >
            Submit Payment
          </button>
        </form>
      </div>
    </div>
  );
};

export default Payment;
