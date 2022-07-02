import { useState, createContext } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "./App.css";

import { Chart, registerables } from "chart.js";
import UserType from "./type/User";
Chart.register(...registerables);

const userObj = {
  user: {
    userId: "",
    username: "",
    password: "",
    createdAt: "",
    fullName: "",
    gender: "M",
    email: "",
    phone: "",
    type: "",
    lastMaintenance: "",
  },
  setUser: (user: UserType) => {},
};

export const UserContext = createContext(userObj);

function App() {
  const [user, setUser] = useState(userObj.user);

  return (
    <div className="h-screen flex flex-col">
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
            {/* <Route path="/" element={<Login />} />
            <Route element={<ProtectedRoutes />}>
              <Route path="/dashboard" element={<Dashboard />} />
            </Route> */}
          </Routes>
        </UserContext.Provider>
      </Router>
    </div>
  );
}

export default App;
