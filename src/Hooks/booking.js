import { message } from "antd";
import { getDatabase, ref, child, get, set, push } from "firebase/database";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../Contexts/AppContext";
import { v4 as uuidv4 } from "uuid";
import { BOOKING_MODES, UNIT_STATUS } from "../Data";
import { getUniquId } from "../Utility/function";
import { useInventories } from "./index";

const isUserExists = (db_details, userDetails) => {
  const { email, firstName, flatId, lastName } = userDetails;
  const {
    email: db_email,
    firstName: db_firstName,
    flatId: db_flatId,
    lastName: db_lastName,
  } = db_details;

  if (
    db_email === email &&
    db_firstName === firstName &&
    db_flatId === flatId &&
    db_lastName === lastName
  )
    return true;
  return false;
};

export const useBookings = () => {
  const { bookings, setBookings, users, setUsers } = useContext(AppContext);
  const [bookingsList, setBookingsList] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const { updateInventory } = useInventories();
  useEffect(() => {
    if (bookings)
      setBookingsList(
        Object.keys(bookings).map((id) => ({
          ...bookings[id],
          id,
        }))
      );
  }, [bookings]);

  useEffect(() => {
    if (users)
      setUsersList(
        Object.keys(users).map((id) => ({
          ...users[id],
          id,
        }))
      );
  }, [users]);

  const changeStatusInBulk = (ids = [], status) =>
    ids.forEach((id) => updateInventory(id, "Status", status));

  const saveBookingToDB = async (bookingDetails) => {
    // const { flatId } = bookingDetails;
    const db = getDatabase();
    const details = {
      ...bookingDetails,
      timestamp: new Date().getTime(),
    };
    // delete details.flatId;

    await set(ref(db, `bookings/${getUniquId()}`), details);
  };

  const saveUserToDB = async (userDetails) => {
    const db = getDatabase();

    // adding timestamp

    const details = {
      ...userDetails,
      timestamp: new Date().getTime(),
    };

    // deleting mobile number from details as it is used as id
    // delete details.mobile;

    // const snapshot = await get(child(ref(db), `users/${userDetails.mobile}`));

    // check if user exists
    // if (snapshot.exists()) {
    //   const db_details = snapshot.val();
    //   if (isUserExists(db_details, userDetails)) {
    //     message.error("user already exists");
    //     return;
    //   }
    // }

    const user_id = getUniquId();
    await set(ref(db, `users/${user_id}`), details);
    return user_id;
  };

  const fetchBookings = (setLoading = () => {}) => {
    setLoading(true);
    const dbRef = ref(getDatabase());
    get(child(dbRef, `bookings`))
      .then((snapshot) => {
        if (snapshot.exists()) {
          setBookings(snapshot.val());
          setLoading(false);
        } else {
          setLoading(false);
        }
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  };

  const fetchUsers = (setLoading = () => {}) => {
    setLoading(true);
    const dbRef = ref(getDatabase());
    get(child(dbRef, `users`))
      .then((snapshot) => {
        if (snapshot.exists()) {
          setUsers(snapshot.val());
          setLoading(false);
        } else {
          setLoading(false);
        }
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  };

  return {
    saveBookingToDB,
    fetchBookings,
    fetchUsers,
    bookingsList,
    usersList,
    bookings,
    setBookingsList,
    saveUserToDB,
    changeStatusInBulk,
  };
};
