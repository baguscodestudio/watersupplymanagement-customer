import { useState, createContext } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import './App.css';
import 'react-toastify/dist/ReactToastify.css';

import { Chart, registerables } from 'chart.js';
import UserType from './type/User';
import Home from './pages/Home';
import Login from './pages/Login';
import ProtectedRoutes from './ProtectedRoutes';
import UpdatePassword from './pages/UpdatePassword';
import WaterUsageCurrent from './pages/WaterUsageCurrent';
import 'chartjs-adapter-moment';
Chart.register(...registerables);

const userObj = {
  user: {
    userId: '',
    username: '',
    password: '',
    createdAt: '',
    fullName: '',
    gender: 'M',
    email: '',
    phone: '',
    type: '',
    lastMaintenance: '',
  },
  setUser: (user: UserType) => {},
};

export const UserContext = createContext(userObj);

function App() {
  const [user, setUser] = useState(userObj.user);

  return (
    <div className="h-screen flex flex-col bg-[#AFEEEE]">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        pauseOnFocusLoss={false}
        closeOnClick
        rtl={false}
        draggable
        pauseOnHover
      />
      <ToastContainer />
      <Router>
        <UserContext.Provider value={{ user, setUser }}>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route element={<ProtectedRoutes />}>
              <Route path="/dashboard" element={<Home />} />
              <Route
                path="/waterusage/current"
                element={<WaterUsageCurrent />}
              />
              <Route path="/account/password" element={<UpdatePassword />} />
            </Route>
          </Routes>
        </UserContext.Provider>
      </Router>
    </div>
  );
}

export default App;
