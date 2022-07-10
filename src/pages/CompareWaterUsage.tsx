import moment from 'moment';
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Chart } from 'react-chartjs-2';
import Header from '../components/Header';
import NavTab from '../components/NavTab';
import WaterUsageType from '../type/WaterUsage';

type LocationState = {
  firstData: WaterUsageType;
  secondData: WaterUsageType;
  from: {
    path: string;
  };
};

const CompareWaterUsage = () => {
  const location = useLocation();
  const { firstData, secondData } = location.state as LocationState;
  const navigate = useNavigate();

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

  if (!firstData || !secondData) {
    navigate('/waterusage/past');
  } else {
    firstData.data.map((sensordata, i) => {
      if (dataValue[moment(sensordata.timestamp).format('YYYYMMDD')]) {
        dataValue[moment(sensordata.timestamp).format('YYYYMMDD')].data.push({
          x: moment(sensordata.timestamp),
          y: sensordata.value,
        });
      } else {
        let color = `rgb(${Math.floor(Math.random() * 255)},${Math.floor(
          Math.random() * 255
        )},${Math.floor(Math.random() * 255)})`;
        dataValue[moment(sensordata.timestamp).format('YYYYMMDD')] = {
          label: moment(sensordata.timestamp).format('DD/MM/YYYY'),
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
    });

    secondData.data.map((sensordata, i) => {
      if (dataValue[moment(sensordata.timestamp).format('YYYYMMDD')]) {
        dataValue[moment(sensordata.timestamp).format('YYYYMMDD')].data.push({
          x: moment(sensordata.timestamp),
          y: sensordata.value,
        });
      } else {
        let color = `rgb(${Math.floor(Math.random() * 255)},${Math.floor(
          Math.random() * 255
        )},${Math.floor(Math.random() * 255)})`;
        dataValue[moment(sensordata.timestamp).format('YYYYMMDD')] = {
          label: moment(sensordata.timestamp).format('DD/MM/YYYY'),
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
    });
  }

  const data = {
    labels: [],
    datasets: Object.keys(dataValue).map((key) => dataValue[key]),
  };

  return (
    <div className="m-auto w-11/12 h-5/6 bg-white rounded-xl flex flex-col border-2 border-black">
      <Header />
      <div className="w-full h-full flex">
        <NavTab />
        <div className="w-4/5 h-full px-8 py-10 flex items-center">
          <Chart
            type="line"
            className="w-full"
            data={data}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: 'top' as const,
                },
                title: {
                  display: true,
                  text: `Water Usage Comparison`,
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

          <div className="inline-flex w-full">
            <button className="mt-4 mx-auto px-4 py-1 rounded-lg border-2 border-black">
              Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompareWaterUsage;
