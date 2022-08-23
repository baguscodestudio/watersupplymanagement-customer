import axios from 'axios';
import moment from 'moment';
import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { UserContext } from '../App';
import Header from '../components/Header';
import NavTab from '../components/NavTab';
import ReportType from '../type/Report';

const ViewReport = () => {
  const [report, setReport] = useState<ReportType>();
  const [prevReport, setPrevReport] = useState<ReportType>();
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const params = useParams();

  const checkChanges = () => {
    return prevReport === report;
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    axios
      .put(
        `${import.meta.env.VITE_REST_URL}/ReportTicket/MyInfo`,
        {
          ...report,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        }
      )
      .then((response) => {
        toast('Successfully updated report');
        navigate('/report');
      })
      .catch((err) => {
        toast.error('An error occured while updating report');
      });
  };

  useEffect(() => {
    axios
      .get(
        `${import.meta.env.VITE_REST_URL}/ReportTicket/MyInfo/${params.id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        }
      )
      .then((response) => {
        setReport(response.data);
        setPrevReport(response.data);
      })
      .catch((err) => {
        console.log(err);
        toast.error('An error occured while fetching report');
      });
  }, []);

  return (
    <div className="m-auto w-11/12 h-5/6 bg-white rounded-xl flex flex-col border-2 border-black">
      <Header />
      <div className="w-full h-full flex">
        <NavTab />
        <div className="w-4/5 h-full px-8 py-10 flex flex-col">
          <form className="w-1/2 flex flex-col" onSubmit={handleSubmit}>
            <div className="w-full rounded-xl px-6 py-8 border-2 border-black">
              <span className="text-gray-500 mb-4">
                {moment(report?.createdAt).format('hh:mm:ss A DD/MM/YYYY')}
              </span>
              <div className="inline-flex items-end justify-between w-full">
                <div className="flex flex-col w-1/3 mb-4">
                  <span>Title of Issue</span>
                  <input
                    className="border-2 border-black px-2"
                    required
                    value={report?.title}
                    onChange={(event) => {
                      if (!report) return;
                      setReport({
                        ...report,
                        title: event.currentTarget.value,
                      });
                    }}
                  />
                </div>
                <div className="flex flex-col w-1/3 mb-4 items-center">
                  <span>Status</span>
                  {report?.status == 'Active' ? (
                    <div className="mx-auto w-1/2 py-1 rounded-lg bg-amber-300 text-center">
                      Active
                    </div>
                  ) : (
                    <div className="mx-auto w-1/2 py-1 rounded-lg bg-gray-400 text-white text-center">
                      Closed
                    </div>
                  )}
                </div>
              </div>
              <div className="flex flex-col w-full">
                <span>Description</span>
                <textarea
                  className="border-2 border-black px-2 w-full"
                  rows={10}
                  required
                  value={report?.description}
                  onChange={(event) => {
                    if (!report) return;
                    setReport({
                      ...report,
                      description: event.currentTarget.value,
                    });
                  }}
                />
              </div>
            </div>
            <div className="inline-flex">
              <Link
                to="/report"
                className="px-4 py-1 border-2 border-black rounded-lg mt-4 hover:bg-slate-200 transition-colors mx-4"
              >
                Back
              </Link>
              <button
                type="submit"
                disabled={checkChanges()}
                className="disabled:bg-gray-200 px-4 py-1 border-2 border-black rounded-lg mt-4 hover:bg-slate-200 transition-colors mx-4"
              >
                Update
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ViewReport;
