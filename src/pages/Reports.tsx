import axios from 'axios';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Header from '../components/Header';
import NavTab from '../components/NavTab';
import ReportType from '../type/Report';

import { ChevronThinLeft } from '@styled-icons/entypo/ChevronThinLeft';
import { ChevronThinRight } from '@styled-icons/entypo/ChevronThinRight';
import { useNavigate } from 'react-router-dom';

const Reports = () => {
  const [reports, setReports] = useState<ReportType[]>([]);
  const [page, setPage] = useState(0);
  const navigate = useNavigate();

  const rightPage = () => {
    if (page < Math.ceil(reports.length / 10)) setPage(page + 1);
  };
  const leftPage = () => {
    if (page > 0) setPage(page - 1);
  };

  useEffect(() => {
    axios
      .get('http://localhost:5000/api/ReportTicket/MyInfo', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      })
      .then((response) => {
        setReports(response.data.result);
      })
      .catch((err) => {
        console.log(err);
        toast.error('An error occured while fetching your reports!');
      });
  }, []);

  return (
    <div className="m-auto w-11/12 h-5/6 bg-white rounded-xl flex flex-col border-2 border-black">
      <Header />
      <div className="w-full h-full flex">
        <NavTab />
        <div className="w-4/5 h-full px-8 py-10 flex flex-col">
          <div className="h-[85%] border-black rounded-xl border-2 overflow-clip">
            <table className="w-full">
              <thead>
                <tr className="border-black border-b-2 bg-[#B0C4DE] h-10">
                  <th className="w-[5%]">No.</th>
                  <th className="w-[15%]">Date</th>
                  <th>Report Title</th>
                  <th className="w-[15%]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {reports
                  .slice(page * 10, page * 10 + 10)
                  .map((report, index) => (
                    <tr
                      key={index}
                      className="border-y-2 border-black hover:text-white hover:bg-gray-500 hover:cursor-pointer"
                      onClick={() => navigate(`/report/${report.reportId}`)}
                    >
                      <td className="border-r-2 border-black text-center">
                        {index + 1}
                      </td>
                      <td className="border-x-2 border-black px-4">
                        {moment(report.createdAt).format('HH:mm:ss DD/MM/YYYY')}
                      </td>
                      <td className="border-x-2 border-black px-4">
                        {report.title}
                      </td>
                      <td className="text-center border-l-2 border-black">
                        {report.status == 'active' ? (
                          <div className="mx-auto w-1/2 py-1 rounded-lg bg-amber-300">
                            Active
                          </div>
                        ) : (
                          <div className="mx-auto w-1/2 py-1 rounded-lg bg-gray-400 text-white">
                            Closed
                          </div>
                        )}
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
  );
};

export default Reports;
