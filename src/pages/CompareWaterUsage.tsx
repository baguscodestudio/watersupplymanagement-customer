import moment from 'moment';
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
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
    navigate('/waterusage/compare');
  } else {
    firstData.data.map((sensordata, i) => {
      if (dataValue[moment(sensordata.timestamp).utc().format('YYYYMMDD')]) {
        dataValue[
          moment(sensordata.timestamp).utc().format('YYYYMMDD')
        ].data.push({
          x: moment(
            moment(sensordata.timestamp).utc().format('HH:mm:ss'),
            'HH:mm:ss'
          ).add(8, 'hour'),
          y: sensordata.value,
        });
      } else {
        let color = `rgb(${Math.floor(Math.random() * 255)},${Math.floor(
          Math.random() * 255
        )},${Math.floor(Math.random() * 255)})`;
        dataValue[moment(sensordata.timestamp).utc().format('YYYYMMDD')] = {
          label: moment(sensordata.timestamp).utc().format('DD/MM/YYYY'),
          data: [
            {
              x: moment(
                moment(sensordata.timestamp).utc().format('HH:mm:ss'),
                'HH:mm:ss'
              ).add(8, 'hour'),
              y: sensordata.value,
            },
          ],
          borderColor: color,
          backgroundColor: color,
        };
      }
    });

    secondData.data.map((sensordata, i) => {
      if (dataValue[moment(sensordata.timestamp).utc().format('YYYYMMDD')]) {
        dataValue[
          moment(sensordata.timestamp).utc().format('YYYYMMDD')
        ].data.push({
          x: moment(
            moment(sensordata.timestamp).utc().format('HH:mm:ss'),
            'HH:mm:ss'
          ).add(8, 'hour'),
          y: sensordata.value,
        });
      } else {
        let color = `rgb(${Math.floor(Math.random() * 255)},${Math.floor(
          Math.random() * 255
        )},${Math.floor(Math.random() * 255)})`;
        dataValue[moment(sensordata.timestamp).utc().format('YYYYMMDD')] = {
          label: moment(sensordata.timestamp).utc().format('DD/MM/YYYY'),
          data: [
            {
              x: moment(
                moment(sensordata.timestamp).utc().format('HH:mm:ss'),
                'HH:mm:ss'
              ).add(8, 'hour'),
              y: sensordata.value,
            },
          ],
          borderColor: color,
          backgroundColor: color,
        };
      }
    });
  }

  Object.keys(dataValue).map((key) => {
    let set = dataValue[key];
    let total = 0;
    let currentDate: string;
    let calculated_data: { x: string; y: number }[] = [];
    set.data.map((data: { x: string; y: number }) => {
      if (
        !currentDate ||
        currentDate !== moment(data.x).format('YYYY-MM-DD HH')
      ) {
        if (currentDate) {
          calculated_data.push({
            x: currentDate,
            y: total,
          });
        }
        currentDate = moment(data.x).format('YYYY-MM-DD HH');
        total = 0;
        total += data.y;
      } else if (currentDate === moment(data.x).format('YYYY-MM-DD HH')) {
        total += data.y;
      }
    });
    calculated_data.push({
      x: currentDate!,
      y: total,
    });
    set.data = calculated_data;
  });

  const data = {
    labels: [],
    datasets: Object.keys(dataValue).map((key) => dataValue[key]),
  };

  return (
    <div className="m-auto w-11/12 h-5/6 bg-white rounded-xl flex flex-col border-2 border-black">
      <Header />
      <div className="w-full h-full flex">
        <NavTab />
        <div className="w-4/5 h-full px-8 py-10 flex flex-col items-center">
          <div className="h-4/5 w-5/6 mx-auto">
            <Chart
              type="line"
              data={data}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: 'bottom' as const,
                  },
                  title: {
                    display: true,
                    text: 'Water Usage Comparison',
                  },
                },
                scales: {
                  x: {
                    type: 'time',
                    time: {
                      unit: 'hour',
                      tooltipFormat: 'HH:mm:ss',
                    },
                  },
                },
              }}
            />
          </div>

          <div className="inline-flex w-full mt-auto mb-4">
            <Link
              to="/waterusage/compare"
              className="mt-4 mx-auto px-4 py-1 rounded-lg border-2 border-black"
            >
              Back
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompareWaterUsage;
