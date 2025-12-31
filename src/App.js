import "./App.css";
import Router from "./Router";
import "./Attributes.css";
import "animate.css";
import "./Global.css";
import "tippy.js/dist/tippy.css";
import { AppContextProvider } from "./Contexts/AppContext";
import { SyncContextProvider } from "./Contexts/SyncContext";
import Blackout from "./Components/Atoms/Blackout";
import { useEffect, useState } from "react";
import "./firebaseConfig";
import { getDateFromTimestamp, jsonToFormalObject } from "./Utility/function";
import Payment from "./Pages/Payment";
import RotateInstruction from "./Components/Atoms/RotateInstruction";
import HoverInfo from "./Components/Molecules/HoverInfo";
import FullScreenModeAlert from "./Components/Atoms/FullScreenModeAlert";
import dataToUpdate from "./newData.json";
import { getDatabase, ref, child, get, set } from "firebase/database";
import ChatContainer from "./Components/Chat/ChatContainer";

function App() {
  // do not call this function
  // it is just for updating the data

  // expecting new data to be in this format
  // {
  //   "101": {
  //     "status": "Available"
  //   },
  // }

  useEffect(() => {
    // const newData = {};
    // Object.keys(dataToUpdate).forEach((flatNumber) => {
    //   const forMatedFlatNumber = `${flatNumber.slice(0, 1)}-${flatNumber.slice(
    //     1
    //   )}`;
    //   const db = getDatabase();
    //   set(
    //     ref(db, `inventories-list/${forMatedFlatNumber}/Status`),
    //     dataToUpdate[flatNumber].status
    //   );
    //   set(
    //     ref(db, `inventories-list/${forMatedFlatNumber}/SBU`),
    //     parseInt(dataToUpdate[flatNumber].SBU)
    //   );
    //   console.log(
    //     "updated",
    //     forMatedFlatNumber,
    //     dataToUpdate[flatNumber].status,
    //     dataToUpdate[flatNumber].SBU
    //   );
    // });
  }, []);




  useEffect(() => {
    const handleOrientationChange = () => {
      // Force viewport reset
      document.documentElement.style.display = "none";
      setTimeout(() => {
        document.documentElement.style.display = "";
      }, 0);

      // Optionally, update viewport meta tag dynamically
      const viewportMeta = document.querySelector('meta[name="viewport"]');
      if (viewportMeta) {
        viewportMeta.setAttribute("content", "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no");
      }
    };

    window.addEventListener("orientationchange", handleOrientationChange);
    return () => window.removeEventListener("orientationchange", handleOrientationChange);
  }, []);

  return (
    <AppContextProvider>
      <SyncContextProvider>
        {/* <FullScreenModeAlert /> */}
        <RotateInstruction />
        <Router />
        {/* <Payment /> */}
        {/* <HoverInfo features={["3 BHK", "Available", "232342"]}/> */}
        <Blackout />
      </SyncContextProvider>
    </AppContextProvider>
  );
}

export default App;
