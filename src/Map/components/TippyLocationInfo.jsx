import { distaces } from "../data/distance";
import { mapDataManager } from "../services/mapDataManager";

// Cache for titles and distances to avoid repeated API calls
let titlesCache = {};
let distancesCache = {};
let dataCachePromise = null;

const getDataForMapElement = async (mapElementId) => {
  // Return cached data if available
  if (titlesCache[mapElementId] && distancesCache[mapElementId] !== undefined) {
    return { title: titlesCache[mapElementId], distance: distancesCache[mapElementId] };
  }

  // If already fetching, wait for the existing promise
  if (dataCachePromise) {
    await dataCachePromise;
    return { 
      title: titlesCache[mapElementId] || mapElementId, 
      distance: distancesCache[mapElementId] || null 
    };
  }

  // Fetch titles and distances from API
  dataCachePromise = (async () => {
    try {
      const [titlesResult, distancesResult] = await Promise.all([
        mapDataManager.getTitles(),
        mapDataManager.getDistances()
      ]);
      
      if (titlesResult.success && titlesResult.data) {
        titlesCache = { ...titlesCache, ...titlesResult.data };
      }
      
      if (distancesResult.success && distancesResult.data) {
        distancesCache = { ...distancesCache, ...distancesResult.data };
      }
    } catch (error) {
      console.error('Failed to fetch data for tooltip:', error);
    } finally {
      dataCachePromise = null;
    }
  })();

  await dataCachePromise;
  return { 
    title: titlesCache[mapElementId] || mapElementId, 
    distance: distancesCache[mapElementId] || null 
  };
};

export const tippyLocationInfo = async (mapElementId) => {
  const formattedTitle = mapElementId?.toLowerCase().replace(/\s+/g, "_");
  const foundDetails = distaces[formattedTitle];

  if (!foundDetails) return ``;
  
  // Get the proper title and distance from API
  const { title: displayTitle, distance: apiDistance } = await getDataForMapElement(mapElementId);
  const time = foundDetails.time;
  // Use API distance if available, otherwise fallback to static distance
  const finalDistance = apiDistance || foundDetails.distance;

  return `<div class="overlay-can-hide route-details flex flex-col gap-2  bg-[rgba(0,0,0,0.0)]  text-slate-200 rounded-md px-3 py-2">
            <div class="flex gap-2 font-light">
            <div class="distance flex flex-col items-center justify-center ">
            <div class="time font-medium" style="color:white ">${displayTitle}</div>
            <div class="time font-medium" style="color:white ">${finalDistance} KM</div>
            </div>
          </div>`;
};


export const tippyLocationInfofornotlandmark = (title) => {
  const formattedTitle = title?.toLowerCase().replace(/\s+/g, "_");
  const foundDetails = distaces[formattedTitle];

  if (!foundDetails) return ``;
  const time = foundDetails.time;
  const distance = foundDetails.distance;

  return `<div class="overlay-can-hide route-details flex flex-col gap-2 bg-[rgba(0,0,0,0.0)] text-slate-200 rounded-md px-3 py-2">
    <div class="flex gap-2 font-light justify-center items-center">
        <div class="distance flex gap-2 items-center justify-center">
            <div class="time font-medium" style="color:white">${title}</div>
        </div>
    </div>
    <div class="distance flex gap-2 items-center justify-center">
        <div class="time font-medium" style="color:white">${time} Min</div>
        <div class="time font-medium" style="color:white"> | </div>
        <div class="time font-medium" style="color:white">${distance} KM</div>
    </div>
</div>`;
};


// export const tippyLocationInfoForData = (
//   distance,
//   time,
//   tippyText,
//   isDriving,
//   className
// ) => {
//   const renderContent = () => {
//     if (isDriving) {
//       return (
//         `<div class="flex flex-col gap-2 justify-center bg-[rgba(0,0,0,0.3)] text-slate-100 backdrop-blur-sm px-2 py-1 rounded-md text-[10px]">
//           <div class="flex gap-2 font-light">
//            <div class="distance flex gap-2 items-center justify-center ">
//            <div class="w-[15px] h-[15px] object-contain"><svg viewBox="0 0 31 26" fill="none" xmlns="http://www.w3.org/2000/svg">
//             <path fill-rule="evenodd" clip-rule="evenodd" d="M30.4601 8.48698H27.0751C26.2491 5.41798 25.0041 1.53499 21.9061 1.00199C18.7531 0.457994 12.2471 0.457994 9.09308 1.00199C5.99308 1.53499 4.75005 5.41798 3.92505 8.48698H0.537048C0.411048 8.48798 0.29005 8.53697 0.20105 8.62297C0.11105 8.70997 0.0610586 8.82695 0.0600586 8.94895V10.253C0.0610586 10.375 0.11105 10.492 0.20105 10.579C0.29005 10.665 0.411048 10.714 0.537048 10.715C1.27605 10.672 2.05708 10.672 2.79608 10.672C2.31808 11.136 1.92706 11.935 1.92706 12.481V19.841V23.961C1.92606 24.1 1.95308 24.237 2.00708 24.365C2.06108 24.493 2.14009 24.609 2.24109 24.707C2.34209 24.805 2.46203 24.883 2.59503 24.935C2.72703 24.988 2.86805 25.014 3.01105 25.013H7.26807C7.41107 25.014 7.55306 24.988 7.68506 24.936C7.81806 24.883 7.93806 24.806 8.03906 24.708C8.14006 24.61 8.22005 24.494 8.27405 24.365C8.32805 24.237 8.35506 24.1 8.35406 23.961V21.649C13.1031 21.144 17.8941 21.144 22.6431 21.649V23.961C22.6421 24.1 22.6691 24.237 22.7231 24.366C22.7771 24.494 22.8571 24.61 22.9581 24.708C23.0601 24.806 23.18 24.884 23.313 24.936C23.445 24.988 23.587 25.014 23.73 25.013H27.988C28.131 25.014 28.2731 24.988 28.4061 24.936C28.5381 24.883 28.658 24.806 28.759 24.708C28.86 24.61 28.9401 24.494 28.9941 24.365C29.0491 24.237 29.076 24.1 29.074 23.961V12.481C29.074 11.935 28.6831 11.136 28.2061 10.673C28.9441 10.673 29.6821 10.673 30.4601 10.716C30.5901 10.715 30.71 10.666 30.8 10.579C30.89 10.493 30.9401 10.376 30.9401 10.254V8.94999C30.9401 8.82699 30.89 8.70997 30.8 8.62297C30.71 8.53597 30.5901 8.48698 30.4601 8.48698ZM9.44104 16.771C7.87804 16.981 6.13403 17.424 4.70703 16.771C4.01303 16.453 3.57007 15.424 3.70807 14.374C3.84407 13.345 4.80806 12.506 5.83606 12.692C7.49706 12.992 11.3041 13.67 11.6431 15.347C11.7991 16.119 10.049 16.602 9.44104 16.771ZM6.57404 9.58C5.53204 8.277 6.09108 3.225 9.00708 2.684C13.2831 1.895 17.6741 1.895 21.9501 2.684C24.8651 3.225 25.4681 8.277 24.3821 9.58C18.4811 10.463 12.475 10.463 6.57404 9.58ZM25.488 16.86C23.799 16.808 19.9311 16.698 19.3331 15.09C19.0581 14.35 20.7111 13.615 21.2861 13.359C22.7981 12.921 24.4511 12.226 25.9641 12.664C26.7011 12.879 27.3001 13.828 27.3281 14.886C27.3561 15.923 26.534 16.893 25.488 16.86Z" fill="white"/>
//           </svg></div>
//           <div class="time font-strong" style="color:white"> | </div>
//         <div class="time">${time} Min</div>
//         <div class="time font-strong" style="color:white"> | </div>
//       <div class="time">${distance} KM</div>
//       </div>
//       </div>
//     </div>`
//       );
//     } else {
//       return (
//         `<div class="flex flex-col gap-2 justify-center bg-[rgba(0,0,0,0.3)] text-slate-100 backdrop-blur-sm px-2 py-1 rounded-md text-[10px]">
//           <div class="flex gap-2 font-light">
//            <div class="distance flex gap-2 items-center justify-center ">
//             <div class="w-[15px] h-[15px] object-contain">
//               <svg viewBox="0 0 31 26" fill="none" xmlns="http://www.w3.org/2000/svg">
//                 <g>
//                 <path d="M9.21784 4.84235C10.8122 4.84235 12.1046 3.75835 12.1046 2.42117C12.1046 1.084 10.8122 0 9.21784 0C7.62351 0 6.33105 1.084 6.33105 2.42117C6.33105 3.75835 7.62351 4.84235 9.21784 4.84235Z" fill="white"/>
//                 <path d="M27.3643 23.206C23.9241 18.8996 19.9904 13.2902 19.3292 12.3433C19.2693 12.1715 19.1902 11.9972 19.0812 11.8219C18.2955 10.5375 17.4737 9.26762 16.6353 8.0063C17.524 8.06457 18.4152 8.12234 19.3034 8.1801C19.9143 9.18976 20.5222 10.1999 21.1319 11.2091C22.1136 12.8351 25.0189 11.4045 24.0397 9.783C23.2539 8.48049 22.3226 5.55097 20.294 5.41886C18.1355 5.27821 15.9776 5.13756 13.8197 4.99741C13.767 4.9939 13.7221 4.99993 13.6718 4.99993C12.0404 4.63373 10.128 5.59919 9.78183 6.99413C8.67863 8.99788 7.09449 10.5626 4.43649 11.2156C2.35585 11.726 3.24225 14.4521 5.33187 13.9397C7.95933 13.2947 9.84652 12.0319 11.2773 10.3697C12.144 11.6657 12.9902 12.9697 13.8012 14.2918C12.0182 15.3231 10.4604 16.5703 9.09547 18.0095C8.71456 18.4108 8.64928 18.8237 8.77745 19.1869C8.77266 19.3225 8.78284 19.4632 8.82896 19.6159C9.35421 21.3599 9.87886 23.101 10.4047 24.843C10.9623 26.6996 14.4666 26.1721 13.9042 24.3035C13.4041 22.6434 12.9034 20.9832 12.4033 19.322C13.6574 18.0818 15.1362 17.0028 16.8257 16.1971C17.2234 16.0072 17.4737 15.7455 17.6127 15.4572C19.9239 18.4279 22.2357 22.5379 24.5458 25.0289C25.9556 26.5489 28.7759 24.729 27.3643 23.206Z" fill="white"/>
//                 </g>
//                 </svg>
//             </div>
//             <div class="time font-strong" style="color:white"> | </div>
//           <div class="time">${time} Min </div>
//           <div class="time font-strong" style="color:white"> | </div>
//         <div class="time">${distance} KM</div>
//       </div>
//       </div>
//     </div>`
//       );
//     }
//   };

//   return renderContent();
// };

export const tippyLocationInfoForData = (
  distance,
  time,
  tippyText,
  isDriving,
  className
) => {
  const renderContent = () => {
    const textColor = className == "hospital " ? "#D41F26" : "white"; // Conditional text color

    const blur = className == "hospital " ? "" : "bg-[rgba(0,0,0,0.3)]";
    

    if (isDriving) {
      return (
        `<div class="flex flex-col gap-2 justify-center ${blur} text-slate-100 backdrop-blur-sm px-2 py-1 rounded-md text-[10px]">
          <div class="flex gap-2 font-light">
           <div class="distance flex gap-2 items-center justify-center ">
           <div class="w-[15px] h-[15px] object-contain">
            <svg viewBox="0 0 31 26" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M30.4601 8.48698H27.0751C26.2491 5.41798 25.0041 1.53499 21.9061 1.00199C18.7531 0.457994 12.2471 0.457994 9.09308 1.00199C5.99308 1.53499 4.75005 5.41798 3.92505 8.48698H0.537048C0.411048 8.48798 0.29005 8.53697 0.20105 8.62297C0.11105 8.70997 0.0610586 8.82695 0.0600586 8.94895V10.253C0.0610586 10.375 0.11105 10.492 0.20105 10.579C0.29005 10.665 0.411048 10.714 0.537048 10.715C1.27605 10.672 2.05708 10.672 2.79608 10.672C2.31808 11.136 1.92706 11.935 1.92706 12.481V19.841V23.961C1.92606 24.1 1.95308 24.237 2.00708 24.365C2.06108 24.493 2.14009 24.609 2.24109 24.707C2.34209 24.805 2.46203 24.883 2.59503 24.935C2.72703 24.988 2.86805 25.014 3.01105 25.013H7.26807C7.41107 25.014 7.55306 24.988 7.68506 24.936C7.81806 24.883 7.93806 24.806 8.03906 24.708C8.14006 24.61 8.22005 24.494 8.27405 24.365C8.32805 24.237 8.35506 24.1 8.35406 23.961V21.649C13.1031 21.144 17.8941 21.144 22.6431 21.649V23.961C22.6421 24.1 22.6691 24.237 22.7231 24.366C22.7771 24.494 22.8571 24.61 22.9581 24.708C23.0601 24.806 23.18 24.884 23.313 24.936C23.445 24.988 23.587 25.014 23.73 25.013H27.988C28.131 25.014 28.2731 24.988 28.4061 24.936C28.5381 24.883 28.658 24.806 28.759 24.708C28.86 24.61 28.9401 24.494 28.9941 24.365C29.0491 24.237 29.076 24.1 29.074 23.961V12.481C29.074 11.935 28.6831 11.136 28.2061 10.673C28.9441 10.673 29.6821 10.673 30.4601 10.716C30.5901 10.715 30.71 10.666 30.8 10.579C30.89 10.493 30.9401 10.376 30.9401 10.254V8.94999C30.9401 8.82699 30.89 8.70997 30.8 8.62297C30.71 8.53597 30.5901 8.48698 30.4601 8.48698ZM9.44104 16.771C7.87804 16.981 6.13403 17.424 4.70703 16.771C4.01303 16.453 3.57007 15.424 3.70807 14.374C3.84407 13.345 4.80806 12.506 5.83606 12.692C7.49706 12.992 11.3041 13.67 11.6431 15.347C11.7991 16.119 10.049 16.602 9.44104 16.771ZM6.57404 9.58C5.53204 8.277 6.09108 3.225 9.00708 2.684C13.2831 1.895 17.6741 1.895 21.9501 2.684C24.8651 3.225 25.4681 8.277 24.3821 9.58C18.4811 10.463 12.475 10.463 6.57404 9.58ZM25.488 16.86C23.799 16.808 19.9311 16.698 19.3331 15.09C19.0581 14.35 20.7111 13.615 21.2861 13.359C22.7981 12.921 24.4511 12.226 25.9641 12.664C26.7011 12.879 27.3001 13.828 27.3281 14.886C27.3561 15.923 26.534 16.893 25.488 16.86Z" fill="${textColor}"/>
            </svg>
          </div>
          <div class="time font-strong" style="color:${textColor}"> | </div>
        <div class="time" style="color:${textColor}">${time} Min</div>
        <div class="time font-strong" style="color:${textColor}"> | </div>
      <div class="time" style="color:${textColor}">${distance} KM</div>
      </div>
      </div>
    </div>`
      );
    } else {
      return (
        `<div class="flex flex-col gap-2 justify-center bg-[rgba(0,0,0,0.3)] text-slate-100 backdrop-blur-sm px-2 py-1 rounded-md text-[10px]">
          <div class="flex gap-2 font-light">
           <div class="distance flex gap-2 items-center justify-center ">
            <div class="w-[15px] h-[15px] object-contain">
              <svg viewBox="0 0 31 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g>
                <path d="M9.21784 4.84235C10.8122 4.84235 12.1046 3.75835 12.1046 2.42117C12.1046 1.084 10.8122 0 9.21784 0C7.62351 0 6.33105 1.084 6.33105 2.42117C6.33105 3.75835 7.62351 4.84235 9.21784 4.84235Z" fill="white"/>
                <path d="M27.3643 23.206C23.9241 18.8996 19.9904 13.2902 19.3292 12.3433C19.2693 12.1715 19.1902 11.9972 19.0812 11.8219C18.2955 10.5375 17.4737 9.26762 16.6353 8.0063C17.524 8.06457 18.4152 8.12234 19.3034 8.1801C19.9143 9.18976 20.5222 10.1999 21.1319 11.2091C22.1136 12.8351 25.0189 11.4045 24.0397 9.783C23.2539 8.48049 22.3226 5.55097 20.294 5.41886C18.1355 5.27821 15.9776 5.13756 13.8197 4.99741C13.767 4.9939 13.7221 4.99993 13.6718 4.99993C12.0404 4.63373 10.128 5.59919 9.78183 6.99413C8.67863 8.99788 7.09449 10.5626 4.43649 11.2156C2.35585 11.726 3.24225 14.4521 5.33187 13.9397C7.95933 13.2947 9.84652 12.0319 11.2773 10.3697C12.144 11.6657 12.9902 12.9697 13.8012 14.2918C12.0182 15.3231 10.4604 16.5703 9.09547 18.0095C8.71456 18.4108 8.64928 18.8237 8.77745 19.1869C8.77266 19.3225 8.78284 19.4632 8.82896 19.6159C9.35421 21.3599 9.87886 23.101 10.4047 24.843C10.9623 26.6996 14.4666 26.1721 13.9042 24.3035C13.4041 22.6434 12.9034 20.9832 12.4033 19.322C13.6574 18.0818 15.1362 17.0028 16.8257 16.1971C17.2234 16.0072 17.4737 15.7455 17.6127 15.4572C19.9239 18.4279 22.2357 22.5379 24.5458 25.0289C25.9556 26.5489 28.7759 24.729 27.3643 23.206Z" fill="white"/>
                </g>
                </svg>
            </div>
            <div class="time font-strong" style="color:${textColor}"> | </div>
          <div class="time" style="color:${textColor}">${time} Min </div>
          <div class="time font-strong" style="color:${textColor}"> | </div>
        <div class="time" style="color:${textColor}">${distance} KM</div>
      </div>
      </div>
    </div>`
      );
    }
  };

  return renderContent();
};

export const tippyLocationInfoForMark = (distance, time, tippyText) => {
  // Conditional rendering based on tippyText
  const renderContent = () => {
    if (tippyText === "Dev sthal mandir") {
      return (
        `<div class="flex flex-col gap-2 justify-center bg-[rgba(0,0,0,0.3)] text-slate-100 backdrop-blur-sm px-2 py-1 rounded-md text-[10px]">
          <div class="flex gap-2 font-light">
           <div class="distance flex gap-2 items-center justify-center ">
           <div class="w-[15px] h-[15px] object-contain"><svg width="283" height="283" viewBox="0 0 283 283" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_2341_7590)">
<path d="M84.1456 52.7071C98.7002 52.7071 110.499 40.9082 110.499 26.3536C110.499 11.7989 98.7002 0 84.1456 0C69.5909 0 57.792 11.7989 57.792 26.3536C57.792 40.9082 69.5909 52.7071 84.1456 52.7071Z" fill="white"/>
<path d="M249.807 252.605C218.401 205.732 182.49 144.676 176.454 134.369C175.908 132.499 175.186 130.602 174.191 128.694C167.017 114.714 159.516 100.892 151.861 87.1626C159.975 87.7969 168.111 88.4256 176.219 89.0544C181.796 100.044 187.346 111.039 192.912 122.024C201.873 139.722 228.396 124.151 219.457 106.501C212.283 92.324 203.781 60.4373 185.262 58.9993C165.557 57.4684 145.858 55.9375 126.158 54.4121C125.677 54.3738 125.267 54.4394 124.808 54.4394C109.914 50.4536 92.4564 60.9622 89.2962 76.1455C79.225 97.9556 64.7633 114.987 40.4984 122.095C21.5041 127.65 29.5961 157.322 48.6723 151.745C72.6585 144.725 89.8867 130.98 102.949 112.887C110.86 126.994 118.586 141.187 125.989 155.578C109.712 166.803 95.4909 180.379 83.0304 196.043C79.553 200.412 78.9571 204.906 80.1271 208.859C80.0834 210.335 80.1763 211.866 80.5973 213.528C85.3924 232.512 90.1819 251.462 94.9824 270.424C100.073 290.632 132.063 284.891 126.929 264.552C122.364 246.481 117.793 228.411 113.228 210.33C124.677 196.831 138.176 185.086 153.6 176.316C157.23 174.25 159.516 171.401 160.784 168.263C181.884 200.598 202.988 245.333 224.077 272.447C236.947 288.992 262.694 269.183 249.807 252.605Z" fill="white"/>
</g>
</svg>
</div>
        <div class="time">${time} Min</div>
      <div class="time">${distance} KM</div>
      </div>
      </div>
    </div>`
      );
    } else {
      return (
        `<div class="flex flex-col gap-2 justify-center bg-[rgba(0,0,0,0.3)] text-slate-100 backdrop-blur-sm px-2 py-1 rounded-md text-[10px]">
          <div class="flex gap-2 font-light">
           <div class="distance flex gap-2 items-center justify-center ">
           <div class="w-[15px] h-[15px] object-contain"><svg viewBox="0 0 31 26" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M30.4601 8.48698H27.0751C26.2491 5.41798 25.0041 1.53499 21.9061 1.00199C18.7531 0.457994 12.2471 0.457994 9.09308 1.00199C5.99308 1.53499 4.75005 5.41798 3.92505 8.48698H0.537048C0.411048 8.48798 0.29005 8.53697 0.20105 8.62297C0.11105 8.70997 0.0610586 8.82695 0.0600586 8.94895V10.253C0.0610586 10.375 0.11105 10.492 0.20105 10.579C0.29005 10.665 0.411048 10.714 0.537048 10.715C1.27605 10.672 2.05708 10.672 2.79608 10.672C2.31808 11.136 1.92706 11.935 1.92706 12.481V19.841V23.961C1.92606 24.1 1.95308 24.237 2.00708 24.365C2.06108 24.493 2.14009 24.609 2.24109 24.707C2.34209 24.805 2.46203 24.883 2.59503 24.935C2.72703 24.988 2.86805 25.014 3.01105 25.013H7.26807C7.41107 25.014 7.55306 24.988 7.68506 24.936C7.81806 24.883 7.93806 24.806 8.03906 24.708C8.14006 24.61 8.22005 24.494 8.27405 24.365C8.32805 24.237 8.35506 24.1 8.35406 23.961V21.649C13.1031 21.144 17.8941 21.144 22.6431 21.649V23.961C22.6421 24.1 22.6691 24.237 22.7231 24.366C22.7771 24.494 22.8571 24.61 22.9581 24.708C23.0601 24.806 23.18 24.884 23.313 24.936C23.445 24.988 23.587 25.014 23.73 25.013H27.988C28.131 25.014 28.2731 24.988 28.4061 24.936C28.5381 24.883 28.658 24.806 28.759 24.708C28.86 24.61 28.9401 24.494 28.9941 24.365C29.0491 24.237 29.076 24.1 29.074 23.961V12.481C29.074 11.935 28.6831 11.136 28.2061 10.673C28.9441 10.673 29.6821 10.673 30.4601 10.716C30.5901 10.715 30.71 10.666 30.8 10.579C30.89 10.493 30.9401 10.376 30.9401 10.254V8.94999C30.9401 8.82699 30.89 8.70997 30.8 8.62297C30.71 8.53597 30.5901 8.48698 30.4601 8.48698ZM9.44104 16.771C7.87804 16.981 6.13403 17.424 4.70703 16.771C4.01303 16.453 3.57007 15.424 3.70807 14.374C3.84407 13.345 4.80806 12.506 5.83606 12.692C7.49706 12.992 11.3041 13.67 11.6431 15.347C11.7991 16.119 10.049 16.602 9.44104 16.771ZM6.57404 9.58C5.53204 8.277 6.09108 3.225 9.00708 2.684C13.2831 1.895 17.6741 1.895 21.9501 2.684C24.8651 3.225 25.4681 8.277 24.3821 9.58C18.4811 10.463 12.475 10.463 6.57404 9.58ZM25.488 16.86C23.799 16.808 19.9311 16.698 19.3331 15.09C19.0581 14.35 20.7111 13.615 21.2861 13.359C22.7981 12.921 24.4511 12.226 25.9641 12.664C26.7011 12.879 27.3001 13.828 27.3281 14.886C27.3561 15.923 26.534 16.893 25.488 16.86Z" fill="white"/>
          </svg></div>
        <div class="time">${time} Min</div>
      <div class="time">${distance} KM</div>
      </div>
      </div>
    </div>`
      );
    }
  };

  return renderContent();
};
