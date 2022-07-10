import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { UserContext } from '../App';
import Header from '../components/Header';
import NavTab from '../components/NavTab';
import WaterUsageType from '../type/WaterUsage';
import { Chart } from 'react-chartjs-2';
import moment from 'moment';

const WaterUsageCurrent = () => {
  const { user } = useContext(UserContext);
  const [waterUsage, setWaterUsage] = useState<WaterUsageType[]>([]);
  const [price, setPrice] = useState(0);

  const dataValue: {
    [key: string]: {
      label: string;
      data: {
        x: any;
        y: number;
      }[];
      borderColor: string;
      backgroundColor: string;
    };
  } = {};

  waterUsage.map((waterUsage, index) => {
    waterUsage.data.map((sensordata, i) => {
      if (
        moment(sensordata.timestamp).format('YYYYMMDD') ===
        moment().format('YYYYMMDD')
      ) {
        if (dataValue[waterUsage.customerId]) {
          dataValue[waterUsage.customerId].data.push({
            x: moment(sensordata.timestamp),
            y: sensordata.value,
          });
        } else {
          let color = `rgb(${Math.floor(Math.random() * 255)},${Math.floor(
            Math.random() * 255
          )},${Math.floor(Math.random() * 255)})`;
          dataValue[waterUsage.customerId] = {
            label: 'Your Usage',
            data: [
              {
                x: moment(sensordata.timestamp),
                y: sensordata.value,
              },
            ],
            borderColor: color,
            backgroundColor: color,
          };
        }
      }
    });
  });

  const data = {
    labels: [],
    datasets: Object.keys(dataValue).map((key) => dataValue[key]),
  };

  const getTotal = (date: string) => {
    let total = 0;
    waterUsage.map((waterUsage) => {
      if (moment(waterUsage.date).format('YYYYMMDD') === date) {
        waterUsage.data.map((data) => {
          if (date === moment(data.timestamp).format('YYYYMMDD')) {
            total += data.value;
          }
        });
      }
    });

    return Math.floor(total);
  };

  const getCost = () => {
    let totalLiter = 0;
    waterUsage.map((waterUsage) => {
      waterUsage.data.map((data) => (totalLiter += data.value));
    });
    return Math.round((totalLiter * price * 100) / 1000) / 100;
  };

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/WaterUsage/MyInfo`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
        params: {
          fromDate: moment().startOf('month').format('YYYY-MM-DD'),
          toDate: moment().format('YYYY-MM-DD'),
        },
      })
      .then((response) => {
        setWaterUsage(response.data);
      })
      .catch((err) => {
        console.log(err);
        toast.error('An error occured while fetching your water usage');
      });
    axios
      .get(
        `http://localhost:5000/api/WaterRate/Year/${moment().year()}/Month/${moment().month()}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        }
      )
      .then((response) => setPrice(response.data.price))
      .catch((err) => {
        console.log(err);
        toast.error('An error occured while fetching water rate');
      });
  }, []);

  return (
    <div className="m-auto w-11/12 h-5/6 bg-white rounded-xl flex flex-col border-2 border-black">
      <Header />
      <div className="w-full h-full flex">
        <NavTab />
        <div className="w-4/5 h-full px-8 py-10 flex items-center">
          <div className="w-1/3">
            <div className="w-full h-52 mb-20 border-black border-2 rounded-xl flex flex-col items-center">
              <span className="font-bold text-xl underline mt-4">
                Your water usage
              </span>
              <span className="text-lg">
                This month &#40;{moment().format('MMM YYYY')}
                &#41;
              </span>
              <span className="mb-auto mt-6 text-3xl">${getCost()}</span>
            </div>
            <div className="inline-flex w-full justify-between">
              <div className="w-[45%] h-40 flex flex-col border-2 border-black rounded-xl items-center">
                <span className="font-bold text-xl mt-4">Today:</span>
                <span className="text-2xl mb-auto mt-6">
                  {waterUsage[0] && getTotal(moment().format('YYYYMMDD'))}L
                </span>
              </div>
              <div className="w-[45%] h-40 flex flex-col border-2 border-black rounded-xl items-center">
                <span className="font-bold text-xl mt-4">Yesterday:</span>
                <span className="text-2xl mb-auto mt-6">
                  {waterUsage[0] &&
                    getTotal(moment().add(-1, 'd').format('YYYYMMDD'))}
                  L
                </span>
              </div>
            </div>
          </div>
          <div className="w-2/3 pl-12">
            <Chart
              type="line"
              className="w-full h-auto"
              data={data}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: 'top' as const,
                  },
                  title: {
                    display: true,
                    text: `Water Usage ${moment().format('DD MMM YYYY')}`,
                  },
                },
                scales: {
                  x: {
                    type: 'time',
                    time: {
                      displayFormats: {
                        hour: 'HH:mm',
                      },
                      tooltipFormat: 'DD MMM HH:mm',
                    },
                  },
                },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WaterUsageCurrent;
