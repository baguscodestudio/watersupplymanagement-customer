import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { toast } from 'react-toastify';
import axios from 'axios';

import Header from '../components/Header';
import NavTab from '../components/NavTab';
import SelectTimeFrameLabel from '../components/SelectTimeFrameLabel';

import WaterUsageType from '../type/WaterUsage';
import { useNavigate } from 'react-router-dom';
import { Chart } from 'react-chartjs-2';

const MODES: {
  label: string;
  unit: 'day' | 'month' | 'week' | 'hour';
}[] = [
  {
    label: 'Daily',
    unit: 'day',
  },
  {
    label: 'Monthly',
    unit: 'month',
  },
  {
    label: 'Weekly',
    unit: 'week',
  },
  {
    label: 'Hourly',
    unit: 'hour',
  },
];

const WaterUsage = () => {
  const [waterUsage, setWaterUsage] = useState<WaterUsageType[]>([]);
  const [beginDate, setBeginDate] = useState(
    moment().startOf('year').format('YYYY-MM-DD')
  );
  const [endDate, setEndDate] = useState(moment().format('YYYY-MM-DD'));
  const navigate = useNavigate();
  const [mode, setMode] = useState(MODES[0]);

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

  const labels: string[] = [];
  waterUsage.map((waterPumpUsage, index) => {
    waterPumpUsage.data.map((sensordata, i) => {
      if (dataValue[waterPumpUsage.customerId]) {
        dataValue[waterPumpUsage.customerId].data.push({
          x: moment(sensordata.timestamp),
          y: sensordata.value,
        });
      } else {
        let color = `rgb(${Math.floor(Math.random() * 255)},${Math.floor(
          Math.random() * 255
        )},${Math.floor(Math.random() * 255)})`;
        dataValue[waterPumpUsage.customerId] = {
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
    });
  });

  Object.keys(dataValue).map((key) => {
    let set = dataValue[key];
    if (mode.unit === 'day') {
      let total = 0;
      let currentDate: string;
      let calculated_data: { x: string; y: number }[] = [];
      set.data.map((data: { x: string; y: number }) => {
        if (
          !currentDate ||
          currentDate !== moment(data.x).format('YYYY-MM-DD')
        ) {
          if (currentDate) {
            calculated_data.push({
              x: currentDate,
              y: total,
            });
          }
          currentDate = moment(data.x).format('YYYY-MM-DD');
          total = 0;
          total += data.y;
        } else if (currentDate === moment(data.x).format('YYYY-MM-DD')) {
          total += data.y;
        }
      });
      calculated_data.push({
        x: currentDate!,
        y: total,
      });
      set.data = calculated_data;
    } else if (mode.unit === 'month') {
      let total = 0;
      let currentDate: string;
      let calculated_data: { x: string; y: number }[] = [];
      set.data.map((data: { x: string; y: number }) => {
        if (!currentDate || currentDate !== moment(data.x).format('YYYY-MM')) {
          if (currentDate) {
            calculated_data.push({
              x: currentDate,
              y: total,
            });
          }
          currentDate = moment(data.x).format('YYYY-MM');
          total = 0;
          total += data.y;
        } else if (currentDate === moment(data.x).format('YYYY-MM')) {
          total += data.y;
        }
      });
      calculated_data.push({
        x: currentDate!,
        y: total,
      });
      set.data = calculated_data;
    } else if (mode.unit === 'hour') {
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
    } else if (mode.unit === 'week') {
      let total = 0;
      let currentDate: string;
      let calculated_data: { x: string; y: number }[] = [];
      set.data.map((data: { x: string; y: number }) => {
        if (
          !currentDate ||
          moment(currentDate).week() !== moment(data.x).week()
        ) {
          if (currentDate) {
            calculated_data.push({
              x: moment(currentDate).startOf('week').format('YYYY-MM-DD'),
              y: total,
            });
          }
          currentDate = moment(data.x).format('YYYY-MM-DD');
          total = 0;
          total += data.y;
        } else if (moment(currentDate).week() === moment(data.x).week()) {
          total += data.y;
        }
      });
      calculated_data.push({
        x: moment(currentDate!).startOf('week').format('YYYY-MM-DD'),
        y: total,
      });
      set.data = calculated_data;
    }
  });

  const data = {
    labels: labels,
    datasets: Object.keys(dataValue).map((key) => dataValue[key]),
  };

  const getTotal = () => {
    let total = 0;
    waterUsage.map((waterUsage) => {
      waterUsage.data.map((data) => {
        total += data.value;
      });
    });

    return Math.floor(total);
  };

  return (
    <div className="m-auto w-11/12 h-5/6 bg-white rounded-xl flex flex-col border-2 border-black">
      <Header />
      <div className="w-full h-full flex">
        <NavTab />
        <div className="w-4/5 h-full px-8 py-10 flex flex-col">
          <div className="w-4/5 px-8 flex flex-col mx-auto">
            <Chart
              type="line"
              className="w-full h-auto"
              data={data}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: 'bottom' as const,
                  },
                  title: {
                    display: true,
                    text: 'Water Usage',
                  },
                },
                scales: {
                  x: {
                    type: 'time',
                    time: {
                      unit: mode.unit,
                      tooltipFormat: 'DD MMM YYYY',
                    },
                  },
                },
              }}
            />
          </div>
          <div className="w-full inline-flex items-center justify-around h-1/5 mt-auto">
            <div className="w-1/5 inline-flex items-center my-2">
              <span className="font-semibold">Starting Date: </span>
              <input
                className="ml-auto px-4 py-1 rounded-lg border-2 border-black"
                type="date"
                onBlur={(event) => setBeginDate(event.currentTarget.value)}
                defaultValue={moment().startOf('year').format('YYYY-MM-DD')}
              />
            </div>
            <div className="w-1/5 inline-flex items-center my-2">
              <span className="font-semibold">End Date: </span>
              <input
                className="ml-auto px-4 py-1 rounded-lg border-2 border-black"
                type="date"
                onBlur={(event) => setEndDate(event.currentTarget.value)}
                defaultValue={moment().format('YYYY-MM-DD')}
              />
            </div>
            <div className="w-1/5 inline-flex items-center justify-center my-2">
              <SelectTimeFrameLabel
                value={mode}
                onChange={setMode}
                list={MODES}
              />
            </div>
            <div className="w-1/5 inline-flex items-center my-2">
              <span className="font-semibold">Total Cost: ${getTotal()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WaterUsage;
