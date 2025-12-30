import axios from "axios";
import { message } from "antd";
import inventoryJSON from "./inventories.json";
import { inventories, setInventories } from "../Data/inventories";
import { getPublicLandmarks, getPublicNearbyPlacesByCategory, getAllPublicMapData } from "./mapAdmin";
import {
  hospital_icon,
  hotel_icon,
  landmark_icon,
  malls_icon,
  school_icon,
} from "../Map/components/Icons";
// const inventories = [];

const OTP_TOKEN = "";
export const PROJECT_ID = "salarpuria";
export const UNIT_TYPE = "flat";
export const getInventories = () => inventories;

/**
 * Fetch map landmarks data from API with fallback to static data
 * @returns {Promise<Object>} Map landmarks data
 */
export const fetchMapLandmarks = async () => {
  try {
    const allData = await getAllPublicMapData();

    if (allData && allData.landmarks && Array.isArray(allData.landmarks)) {
      const transformedData = {};
      allData.landmarks.forEach(landmark => {
        // ONLY use map_element_id (title-independent!)
        if (landmark.map_element_id) {
          transformedData[landmark.map_element_id] = landmark.description || "No description available";
        }
      });

      return { success: true, data: transformedData };
    }
  } catch (error) {
    console.error("API fetch failed for landmarks:", error.message);
  }

  return { success: false, data: null };
};

export const fetchMapDistances = async () => {
  try {
    const allData = await getAllPublicMapData();

    if (allData) {
      const transformedData = {};

      // Process landmarks first (they have both distance and description)
      if (allData.landmarks && Array.isArray(allData.landmarks)) {
        allData.landmarks.forEach(item => {
          if (item.distance !== undefined && item.map_element_id) {
            transformedData[item.map_element_id] = item.distance;
          }
        });
      }

      // Process other categories - only add if not already exists (landmarks take priority)
      Object.entries(allData).forEach(([category, items]) => {
        if (category !== 'landmarks' && Array.isArray(items)) {
          items.forEach(item => {
            if (item.distance !== undefined && item.map_element_id && !transformedData[item.map_element_id]) {
              transformedData[item.map_element_id] = item.distance;
            }
          });
        }
      });

      if (Object.keys(transformedData).length > 0) {
        return { success: true, data: transformedData };
      }
    }
  } catch (error) {
    console.error("API fetch failed for distances:", error.message);
  }

  return { success: false, data: null };
};

export const fetchMapDescriptions = async () => {
  try {
    const allData = await getAllPublicMapData();

    if (allData) {
      const transformedData = {};

      // Process landmarks first (they have descriptions)
      if (allData.landmarks && Array.isArray(allData.landmarks)) {
        allData.landmarks.forEach(item => {
          if (item.map_element_id) {
            transformedData[item.map_element_id] = item.description || "No description available";
          }
        });
      }

      // Process other categories - only add if not already exists (landmarks take priority)
      Object.entries(allData).forEach(([category, items]) => {
        if (category !== 'landmarks' && Array.isArray(items)) {
          items.forEach(item => {
            // Only add if not already exists (landmarks take priority)
            if (item.map_element_id && !transformedData[item.map_element_id]) {
              transformedData[item.map_element_id] = "No description available";
            }
          });
        }
      });

      if (Object.keys(transformedData).length > 0) {
        return { success: true, data: transformedData };
      }
    }
  } catch (error) {
    console.error("API fetch failed for descriptions:", error.message);
  }

  return { success: false, data: null };
};

/**
 * Fetch map titles data from API with fallback to static data
 * @returns {Promise<Object>} Map titles data (map_element_id -> title mapping)
 */
export const fetchMapTitles = async () => {
  try {
    const allData = await getAllPublicMapData();

    if (allData) {
      const transformedData = {};

      // Process all categories to get titles
      Object.entries(allData).forEach(([category, items]) => {
        if (Array.isArray(items)) {
          items.forEach(item => {
            if (item.map_element_id && item.title) {
              // Use the first occurrence (landmarks will be processed first due to API structure)
              if (!transformedData[item.map_element_id]) {
                transformedData[item.map_element_id] = item.title;
              }
            }
          });
        }
      });

      if (Object.keys(transformedData).length > 0) {
        return { success: true, data: transformedData };
      }
    }
  } catch (error) {
    console.error("API fetch failed for titles:", error.message);
  }

  return { success: false, data: null };
};

export const fetchMapFilters = async () => {
  try {
    const allData = await getAllPublicMapData();

    if (allData) {
      const transformedFilters = [];
      const categoryConfig = {
        landmarks: { title: "Landmarks", className: "landmark", icon: landmark_icon },
        hotels: { title: "Hotels", className: "hotel", icon: hotel_icon },
        schools: { title: "Education", className: "education", icon: school_icon },
        hospitals: { title: "Healthcare", className: "hospital", icon: hospital_icon },
        malls: { title: "Shopping", className: "retail", icon: malls_icon }
        // Removed metros - they shouldn't be in filters
      };

      Object.keys(categoryConfig).forEach(category => {
        if (allData[category] && Array.isArray(allData[category]) && allData[category].length > 0) {
          const config = categoryConfig[category];
          transformedFilters.push({
            id: `map-filter-${category}`,
            title: config.title,
            className: config.className,
            icon: config.icon,
            landmarks: () => []
          });
        }
      });

      if (transformedFilters.length > 0) {
        return { success: true, data: transformedFilters };
      }
    }
  } catch (error) {
    console.error("API fetch failed for filters:", error.message);
  }

  return { success: false, data: null };
};


export const testMapAPIConnectivity = async () => {
  const results = {};
  const testEndpoints = [
    { key: 'landmarks', fn: () => getPublicLandmarks() },
    { key: 'allData', fn: () => getAllPublicMapData() },
  ];

  for (const { key, fn } of testEndpoints) {
    try {
      const data = await fn();
      results[key] = {
        success: true,
        dataLength: Array.isArray(data) ? data.length : (data ? Object.keys(data).length : 0),
        fullData: data
      };
    } catch (error) {
      results[key] = {
        success: false,
        error: error.response?.status || error.code,
        message: error.response?.data?.message || error.message
      };
    }
  }

  return results;
};

export const baseURL = "https://api.floorselector.convrse.ai/api";
// export const baseURL = "http://localhost:8000/api";

export const fetchUserFromToken = async () => {
  const token = localStorage.getItem("token");
  if (!token) return false;
  try {
    const res = await axios.get(`${baseURL}/admin/me`, {
      headers: {
        authorization: token,
      },
    });
    const { status, data } = res;
    if (status !== 200)
      if (status == 401) return false;
      else message.error("something went wrong");

    return data.user;
  } catch (error) {
    console.log(error);
    // message.error("something went wrong");
    return false;
  }
};

export const fetchAndGetInventories = async () => {
  // setInventories(inventoryJSON);
  // return true;
  try {
    const res = await axios.get(`${baseURL}/inventories/${PROJECT_ID}`, {
      headers: {
        authorization: localStorage.getItem("token"),
      },
    });
    const { status, data } = res;
    if (status == 200) {
      setInventories([...data.filter((data) => data.id)]);
      return true;
    }
    if (status == 401) return false;
    // setInventories([...inventoryJSON]);
  } catch (error) {
    console.log(error);
    message.error("something went wrong");
    return false;
  }
};

export const adminLogin = async (email, password) => {
  try {
    const res = await axios.post(`${baseURL}/admin/login`, {
      email,
      password,
      project_id: PROJECT_ID,
    });

    const { status, data } = res;

    const jwt = data.data.jwt;

    localStorage.setItem("token", jwt);

    if (status !== 200) {
      throw new Error("Error logging in");
    }
    return data.data;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const updateInventoryAPI = async (inventory) => {
  try {
    const { unit_id } = inventory;
    const headers = {
      "Content-Type": "application/json",
      authorization: localStorage.getItem("token"),
    };

    const res = await axios.put(
      `${baseURL}/inventories/${unit_id}`,
      {
        ...inventory,
        project_id: PROJECT_ID,
      },
      { headers }
    );
    const { status } = res;
    return status;
  } catch (error) {
    const { status } = error?.response;
    return status;
  }
};

export const updateBookingAPI = async (id, details) => {
  try {
    const headers = {
      "Content-Type": "application/json",
      authorization: localStorage.getItem("token"),
    };

    const res = await axios.put(
      `${baseURL}/bookings/${PROJECT_ID}/${id}`,
      details,
      { headers }
    );
    const { status: resStatus } = res;
    return resStatus;
  } catch (error) {
    const { status } = error?.response;
    return status;
  }
};

export const exportInventoryAPI = async () => {
  try {
    const headers = {
      "Content-Type": "application/json",
      authorization: localStorage.getItem("token"),
      responseType: "arraybuffer",
    };

    const res = await axios.get(
      `${baseURL}/csv/download?project_id=${PROJECT_ID}`,
      { headers }
    );
    const { status } = res;
    return { status, data: res.data };
  } catch (error) {
    const { status } = error?.response;
    return { status };
  }
};

export const exportBookingsAPI = async () => {
  try {
    const headers = {
      "Content-Type": "application/json",
      authorization: localStorage.getItem("token"),
      responseType: "arraybuffer",
    };

    const res = await axios.get(
      `${baseURL}/csv/download-bookings?project_id=${PROJECT_ID}`,
      { headers }
    );
    const { status } = res;
    return { status, data: res.data };
  } catch (error) {
    const { status } = error?.response;
    return { status };
  }
};

export const ImportInventoryAPI = async (file, onProgress) => {
  const data = new FormData();
  data.append("file", file);

  var config = {
    method: "post",
    maxBodyLength: Infinity,
    url: `${baseURL}/csv?project_id=${PROJECT_ID}`,
    headers: {
      Authorization: localStorage.getItem("token"),
      "Content-Type": "multipart/form-data",
    },
    data: data,
    onUploadProgress: function (progressEvent) {
      console.log(progressEvent);
    },
  };

  const res = await axios(config);
  const { status } = res;
  return { status };
};

export const generateOtp = async (phone) => {
  const verificationCode = Math.floor(1000 + Math.random() * 9000);
  console.log("verificationCode: ", verificationCode);
  const options = {
    method: "POST",
    url: "https://d7-verify.p.rapidapi.com/verify/v1/otp/send-otp",
    headers: {
      "content-type": "application/json",
      Token: OTP_TOKEN,
      "X-RapidAPI-Key": "cb280771fdmsh8bb8d7f33223720p17a499jsn0f17ad0fa936",
      "X-RapidAPI-Host": "d7-verify.p.rapidapi.com",
    },
    data: {
      originator: "SignOTP",
      recipient: "+91" + phone,
      content: "Greetings from M3M, your mobile verification code is: {}",
      expiry: "600",
      data_coding: "text",
    },
  };
  console.log("options: ", options);
  // return;
  axios
    .request(options)
    .then(function (response) {
      console.log("response data from generate otp", response.data);
    })
    .catch(function (error) {
      console.error(error);
    });
};

export const resendOtp = async (phone) => {
  const options = {
    method: "POST",
    url: "https://d7-verify.p.rapidapi.com/verify/v1/otp/resend-otp",
    headers: {
      "content-type": "application/json",
      Token: OTP_TOKEN,
      "X-RapidAPI-Key": "cb280771fdmsh8bb8d7f33223720p17a499jsn0f17ad0fa936",
      "X-RapidAPI-Host": "d7-verify.p.rapidapi.com",
    },
    data: { otp_id: "8d963dbf-d655-4fe6-9157-48885a036050" },
  };

  axios
    .request(options)
    .then(function (response) {
      console.log("resposne from resend otp", response.data);
    })
    .catch(function (error) {
      console.error(error);
    });
};

export const verifyOtp = async (otp) => {
  const options = {
    method: "POST",
    url: "https://d7-verify.p.rapidapi.com/verify/v1/otp/verify-otp",
    headers: {
      "content-type": "application/json",
      Token: OTP_TOKEN,
      "X-RapidAPI-Key": "cb280771fdmsh8bb8d7f33223720p17a499jsn0f17ad0fa936",
      "X-RapidAPI-Host": "d7-verify.p.rapidapi.com",
    },
    data: {
      otp_id: "8d963dbf-d655-4fe6-9157-48885a036050",
      otp_code: otp,
    },
  };

  await axios
    .request(options)
    .then(function (response) {
      console.log("response from verifing otp", response.data);
    })
    .catch(function (error) {
      console.error(error);
    });
};

export const getOtpStatus = async (phone, otp) => {
  const options = {
    method: "GET",
    url: "https://d7-verify.p.rapidapi.com/verify/v1/report/%7Botp_id%7D",
    headers: {
      Token: OTP_TOKEN,
      "X-RapidAPI-Key": "cb280771fdmsh8bb8d7f33223720p17a499jsn0f17ad0fa936",
      "X-RapidAPI-Host": "d7-verify.p.rapidapi.com",
    },
  };

  await axios
    .request(options)
    .then(function (response) {
      console.log("opt status ", response.data);
    })
    .catch(function (error) {
      console.error(error);
    });
};
