import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { toast } from 'react-toastify';
import axios from 'axios';

import Header from '../components/Header';
import NavTab from '../components/NavTab';

import WaterUsageType from '../type/WaterUsage';
import { Search } from 'styled-icons/bootstrap';
import SensorDataType from '../type/SensorData';
import {
  LeftArrowCircle,
  RightArrowCircle,
} from 'styled-icons/boxicons-regular';
import { useNavigate } from 'react-router-dom';

const PastWaterUsage = () => {
  const [firstData, setFirst] = useState(-1);
  const [secondData, setSecond] = useState(-1);
  const [selected, setSelected] = useState(-1);
  const [page, setPage] = useState(0);
  const [waterUsage, setWaterUsage] = useState<WaterUsageType[]>([]);
  const navigate = useNavigate();
  const [beginDate, setBeginDate] = useState(
    moment().startOf('year').format('YYYY-MM-DD')
  );
  const [endDate, setEndDate] = useState(moment().format('YYYY-MM-DD'));

  const rightPage = () => {
    if (page < Math.ceil(waterUsage.length / 10)) setPage(page + 1);
  };
  const leftPage = () => {
    if (page > 0) setPage(page - 1);
  };

  const getTotal = (data: SensorDataType[]) => {
    let total = 0;
    data.map((data) => {
      total += data.value;
    });

    return Math.floor(total);
  };

  const handleDetail = () => {
    if (firstData !== -1 && secondData !== -1 && firstData !== secondData) {
      navigate('/waterusage/compare', {
        state: {
          firstData: waterUsage[firstData],
          secondData: waterUsage[secondData],
        },
      });
    } else {
      toast.error('Invalid data to compare!');
    }
  };

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/WaterUsage/MyInfo`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
        params: {
          fromDate: beginDate,
          toDate: endDate,
        },
      })
      .then((response) => {
        setWaterUsage(response.data);
      })
      .catch((err) => {
        console.log(err);
        toast.error('An error occured while fetching your water usage');
      });
  }, [beginDate, endDate]);

  return (
    <div className="m-auto w-11/12 h-5/6 bg-white rounded-xl flex flex-col border-2 border-black">
      <Header />
      <div className="w-full h-full flex">
        <NavTab />
        <div className="w-4/5 h-full px-8 py-10 flex">
          <div className="w-1/3 flex flex-col mb-auto">
            <div className="w-full py-1 border-black border-2 rounded-lg mb-8 inline-flex px-4 items-center">
              <input className="w-full h-full outline-none" />
              <Search size="16" className="ml-auto" />
            </div>
            <table className="w-full justify-between border-black border-[2px] rounded-lg border-collapse">
              <thead>
                <tr className="border-[2px] border-black">
                  <th colSpan={2}>History of your water usage</th>
                </tr>
                <tr>
                  <th className="border-r-[2px] border-black">Amount</th>
                  <th className="border-l-[2px] border-black">Date</th>
                </tr>
              </thead>
              <tbody>
                {waterUsage
                  .slice(page * 10, page * 10 + 10)
                  .map((waterUsage, index) => (
                    <tr
                      key={index}
                      onClick={() => setSelected(index)}
                      className={`hover:bg-gray-700 hover:text-white hover:cursor-pointer transition-colors text-center ${
                        selected == index && 'bg-gray-700 text-white'
                      }`}
                    >
                      <td className="border-r-[2px] border-black">
                        {getTotal(waterUsage.data)}L
                      </td>
                      <td className="border-r-[2px] border-black">
                        {moment(waterUsage.date).format('DD-MM-YYYY')}
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
            <div className="w-full inline-flex items-center my-2">
              <span className="font-semibold">Starting Date: </span>
              <input
                className="ml-auto px-4 py-1 rounded-lg border-2 border-black"
                type="date"
                onBlur={(event) => setBeginDate(event.currentTarget.value)}
                defaultValue={moment().startOf('year').format('YYYY-MM-DD')}
              />
            </div>
            <div className="w-full inline-flex items-center my-2">
              <span className="font-semibold">End Date: </span>
              <input
                className="ml-auto px-4 py-1 rounded-lg border-2 border-black"
                type="date"
                onBlur={(event) => setEndDate(event.currentTarget.value)}
                defaultValue={moment().format('YYYY-MM-DD')}
              />
            </div>
          </div>
          <div className="w-2/3 pl-8 flex flex-col">
            <div className="inline-flex w-full justify-around">
              <div className="w-[40%] h-64 border-2 border-black rounded-lg flex flex-col items-center">
                {firstData !== -1 && (
                  <>
                    <span className="font-bold mt-12">
                      {moment(waterUsage[firstData].date).format('DD/MM/YYYY')}
                    </span>
                    <span className="text-4xl">
                      {getTotal(waterUsage[firstData].data)}L
                    </span>
                  </>
                )}
                <button
                  onClick={() => setFirst(selected)}
                  className="px-4 py-1 border-2 border-black rounded-lg mt-auto mb-2"
                >
                  Set Data
                </button>
              </div>
              <div className="w-[40%] h-64 border-2 border-black rounded-lg flex flex-col items-center">
                {secondData !== -1 && (
                  <>
                    <span className="font-bold mt-12">
                      {moment(waterUsage[secondData].date).format('DD/MM/YYYY')}
                    </span>
                    <span className="text-4xl">
                      {getTotal(waterUsage[secondData].data)}L
                    </span>
                  </>
                )}
                <button
                  onClick={() => setSecond(selected)}
                  className="px-4 py-1 border-2 border-black rounded-lg mt-auto mb-2"
                >
                  Set Data
                </button>
              </div>
            </div>
            <button
              className="mt-4 mx-auto px-4 py-1 rounded-lg border-2 border-black"
              onClick={handleDetail}
            >
              View Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PastWaterUsage;
