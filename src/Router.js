import React, { useEffect } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Loading from "./Components/Atoms/Loading";
import Navigator from "./Components/Molecules/Navigator";
import AdminOnlyPage from "./Components/Molecules/AdminOnlyPage";
import { useInventories } from "./Hooks";
import Apartment from "./Pages/Apartment";
// import Inventories from "./Pages/Inventories";
import Inventories from "./Dashboard/Inventories";
import Customer from "./Dashboard/Customer";
import Floor from "./Pages/Floor";
import DwarkaExpresswayMap from "./Pages/DwarkaExpresswayMap";
import Tower from "./Pages/Tower";
import { useBookings } from "./Hooks/booking";
import Bookings from "./Pages/Bookings";
import Users from "./Dashboard/Users";
import Unit from "./Pages/Unit";
import VRTour from "./Pages/VRTour";
// import PaymentSuccess from "./Pages/PaymentSuccess";
import PaymentSuccess from "./Components/Moecules/PaymentSuccess";
import DelhiMap from "./Pages/DelhiMap";
import HomePage from "./Pages/HomePage";
import IndiaMap from "./Pages/IndiaMap";
import Loader from "./Components/Atoms/Loader";
import RotateTower from "./Pages/RotateTower";
import UserOnlyPage from "./Components/Molecules/UserOnlyPage";
import IntroVideoPage from "./Pages/IntroVideoPage";
import LoginRequired from "./Pages/LoginRequired";
import Login from "./Dashboard/Login";
import UpdateBooking from "./Dashboard/UpdateBooking";
import VRTours from "./VRTours/App";
import VrHome from "./Pages/VrHome";
import SocketRoomManager from "./Components/SocketRoomManager";
import Disclaimer from "./Components/Molecules/Disclaimer";

import TwentyKm from "./Map/pages/TwentyKm.jsx";
import Earth_Video from "./Map/pages/Earth_Video.jsx";
import MapAdminDashboard from "./Dashboard/MapAdmin/MapAdminDashboard";
import MapAdminManagement from "./Dashboard/MapAdmin/MapAdminManagement";

function Router(props) {
  const { fetchInventories, inventoriesList, getAllUnitsInFloor } =
    useInventories();
  const { fetchBookings, fetchUsers } = useBookings();

  useEffect(() => {
    // saveUserToDB(dummyUser);
  }, []);

  useEffect(() => {
    fetchInventories();
    // fetchBookings();
    // fetchUsers();
  }, []);

  return inventoriesList.length > 0 ? (
    <BrowserRouter>
      {/* Manages socket room connections based on URL roomId */}
      <SocketRoomManager />
      <Disclaimer />
      <Routes>
        <Route
          path="/dashboard"
          element={
            <LoginRequired>
              <Inventories />
            </LoginRequired>
          }
        />
        <Route path="/admin/login" element={<Login />} />

        <Route
          path="/dashboard/inventories"
          element={
            <LoginRequired>
              <Inventories />
            </LoginRequired>
          }
        />
        <Route
          path="/dashboard/customers"
          element={
            <LoginRequired>
              <Customer />
            </LoginRequired>
          }
        />
        <Route
          path="/dashboard/users"
          element={
            <LoginRequired>
              <Users />
            </LoginRequired>
          }
        />


         {/* Map Dashboard */}
        {/* <Route
          path="/dashboard"
          element={
            <LoginRequired>
              <MapAdminDashboard />
            </LoginRequired>
          }
        />
        <Route
          path="/dashboard/:category"
          element={
            <LoginRequired>
              <MapAdminManagement />
            </LoginRequired>
          }
        /> */}
         <Route
          path=""
          element={
            <Navigate to="/inspire" />
          }
        />
        {/* <Route
          path="/earth"
          element={
            <Earth_Video />
          }
        />

          <Route
          path="/twentykm"
          element={
            <TwentyKm />
          }
        />

        <Route
          path="/delhi"
          element={
            // <UserOnlyPage>
            <IndiaMap />
            // </UserOnlyPage>
          }
        />
        <Route
          path="/india/delhi"
          element={
            // <UserOnlyPage>
            <DelhiMap />
            // </UserOnlyPage>
          }
        /> */}
        {/* <Route
          path=""
          element={
            // <AdminOnlyPage>
            <Navigate to="/salarpuria" />
            // </AdminOnlyPage>
          }
        /> */}
        {/* <Route
          path=""
          element={
            <UserOnlyPage>
              <DwarkaExpresswayMap />
            </UserOnlyPage>
          }
        /> */}
        <Route
          path="/inspire"
          element={
            // <AdminOnlyPage>

            <HomePage />

            // </AdminOnlyPage>
          }
        />
        <Route path="/vr-home" element={<VrHome />} />
        <Route
          path="/inspire/tower/:tower"
          element={
            // <AdminOnlyPage>

            <Tower />

            // </AdminOnlyPage>
          }
        />
        <Route
          path="/inspire/tower/:tower/floor/:floor"
          element={
            // <AdminOnlyPage>

            <Floor />

            // </AdminOnlyPage>
          }
        />
        <Route
          path="/inspire/unit/:unit"
          element={
            // <AdminOnlyPage>

            <Unit />

            // </AdminOnlyPage>
          }
        />
        <Route
          path="/inspire/vr-tour"
          element={
            // <AdminOnlyPage>
            //
            <VRTours />
            //
            // </AdminOnlyPage>
          }
        />
        <Route
          path="/inspire/unit/:unit/payment-success/:orderId/:paymentId"
          element={
            // <AdminOnlyPage>

            <PaymentSuccess />

            // </AdminOnlyPage>
          }
        />
        <Route
          path="/inspire/unit/:unit/vr-tour"
          element={
            // <AdminOnlyPage>

            <VRTour />

            // </AdminOnlyPage>
          }
        />
        <Route
          path="/booking-success/:bookingId"
          element={<PaymentSuccess />}
        />
        {/* <Route path="/rotate-tower" element={<RotateTower />} /> */}
      </Routes>
    </BrowserRouter>
  ) : (
    <BrowserRouter>
      <Disclaimer />
      <Loader />
      {/* <DelhiMap /> */}
    </BrowserRouter>
  );
}

export default Router;
