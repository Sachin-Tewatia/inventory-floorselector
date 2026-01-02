import LandMark from "../Components/Atoms/LandMark";
import MarkWithTippy from "../Components/Atoms/MarkWithTippy";
import LandMarks from "../Components/Molecules/LandMarks";
import {
  hartland_mark_green_space,
  screen2_mark_malls,
  screen2_mark_religios,
  screen2_mark_schools,
  hartland_metro_line,
  hartland_site_waves,
  hartland_site_waves_grande,
  screen2_mark_hotels,
  screen2_mark_highways,
} from "./Screen2PageSvgs";
import {
  highway_icon,
  hotel_icon,
  malls_icon,
  school_icon,
  hospital_icon,
} from "./icons";
import {
  mark_cinemas,
  mark_highways,
  mark_hospitals,
  mark_hotels,
  mark_malls,
  mark_metro_line,
  mark_schools,
} from "./Screen1PageSvg";
import {
  screen1_landmarks_with_routes,
  screen2_landmarks_with_routes,
} from "./landmarksRoutes";
import { COMBINED_TOWERS_MAP } from "../Utility/Constants";
import { s } from "framer-motion/client";

export const COMMBINED_TOWERS_LIST = [
  "cluster5",
  "cluster6", "cluster7", "cluster8", "cluster9", "cluster10",
  "cluster11"
];
// export const COMMBINED_TOWERS_LIST = [
//   "cluster1", "cluster2", "cluster3", "cluster4", "cluster5", 
//   "cluster6", "cluster7", "cluster8", "cluster9", "cluster10",
//   "cluster11", "cluster12", "cluster13", "cluster14"
// ];

export const TOWERS_SVGS = {
  T1: "M560.5 387L502.5 456L498 460.5V467L493 469L489 471.5L422.5 539.5L403 561.5L407 568.5L445 600H452L460 604.5L463.5 606L489 612.5L484 618.5L487 626.5L488 631.5L489.5 635L530.5 667.5L534 668.5H536L539.5 667.5L543 664L547.5 663.5L551.5 666L555 665H557.5L560.5 667.5L596.5 673.5L688 690L688.5 690.5L693.5 695.5L697 698L699.5 699.5H701L706 701H710.5L716.5 698.5L801 594L793 586.5L791 583.5L709 508.5L694 495.5L691.5 492L692.5 490V486L652 453.5L646 449H642L640.5 447.5L620 428.5L566.5 387L563.5 386L560.5 387Z",
  T2: "M841 303L797.5 269H797.295L790.5 267.5L789.5 266.5L789 264L779.5 239L777 231L770.5 223.5L764.5 219L726.5 190H723.5L720.5 192.5L668.5 260.5L652 282L651 290H650.5L647.5 290.5L643 293L586 359L581.5 365V368L583 370L617.5 397L624.5 399.5L627 402L629.5 406L730.5 507L737.5 513L739.5 514.5L758 533.5H762L778 549.5L780.5 551L785 552.5L788 555H790.5L791.5 556L806 567.5L816.5 576.5L892.5 487L885 474L883.5 470L845 335.5L842 327L839.5 325L841 321.5L838.5 315.5V312.5L841 308.5V306V303Z",
  T3: "M1008 163.5L903.5 155.5H899.5L897 156L894.5 158V165L893.5 219L896.5 240.5L916.5 400.5L917 402L918 412L921 416.5H927L933.5 478L933 489.5L1054.5 491.5L1055 480.5L1055.5 478L1064.5 453L1077 420L1090 384.5L1098 362L1099.5 357L1101 352L1103 350V345.5L1104.5 344.5L1105.5 340L1107 339L1108 331.5L1111.5 326L1113 325L1117.5 323.5L1120 320L1118.5 265.5L1113 256L1110 255L1117 231L1118.5 218L1117.5 167.5L1115 164.5L1096 163.5H1024L1016 167L1008 163.5Z",
  T4: "M1236 165H1149L1143 167.5V172.5L1140 199L1136.5 208L1133 221L1126 241L1120.5 259L1118.5 264H1117.5V267.5L1118.5 272V323.5L1115.5 326H1113.5L1112 328L1107.5 333.5V338.5L1089.5 386L1074.5 426.5L1076 429L1080.5 424L1076 438L1073.5 446L1077.5 456V471.5L1076 490.5L1180.5 493H1217V476L1220 473.5L1222 471L1230.5 463.5L1238 454L1243.5 449L1249 443L1254.5 437L1258.5 433L1262 428.5L1268 423L1271 419.5L1277 413L1282.5 409L1290 401L1295.5 394L1297.5 392.5L1301 390L1302.5 388L1303.5 386.5L1305.5 384L1308 381.5L1310 380C1310.33 379.667 1311.7 377.9 1312.5 377.5C1313.3 377.1 1314.83 375.833 1314.5 375.5L1318.5 370.5L1320.5 369L1323 365.5L1326.5 363.5L1328.5 359L1329.5 358.5L1333 357.5V353.5H1335.5L1337.5 352.5L1338.5 349L1341.5 348L1345.5 343.5L1349 340.5L1350 336L1351.5 335L1359 331V325.5H1362.5L1366.5 322.5L1373 322L1375.5 320.5L1377 318L1376 296.5L1375 273.5V266L1367.5 253H1359.5H1348.5L1349.5 252L1357 243.5L1364.5 234.5L1371 225L1372 216L1371 191.5L1370.5 173.5L1370 163L1368 160H1353L1303 163L1252.5 165L1242 169.5L1236 165Z",
  T5: "M1218 1012.5L1322.5 1013.5L1326 1010.5L1324.5 957.5L1322.5 941.5L1317.5 931.5L1313.5 926.5L1270.5 904H1283.5V900L1285 899.5L1297 905.5H1315.5L1322 888.5L1320 831.5L1318.5 826.5L1315 824L1301.5 823L1295.5 822L1181 793L1172.5 790.5L1172 784.5L1020.5 786V920H1031L1042 914.5L1078.5 992.5L1080 994.5V1001.5V1012L1084.5 1015L1204 1012.5L1212 1010L1218 1012.5Z",
  T6: "M1569.5 827L1338.5 793V785.5L1335.5 781L1330 778L1184 774V790.5V793.5L1300 823L1304.5 824H1313.5H1317L1320 828L1321.5 886.5V891L1318 899.5L1315 906L1297 905.5L1284 899V904.5H1272.5L1315 927.5L1316.5 930L1320.5 937L1324 946L1324.5 949L1326 988.5L1345.5 1001H1349L1351.5 1004.5V1009L1352.5 1010.5L1357.5 1014L1457 1015L1462.5 1013L1465 1014.5L1552 1018.5L1604.5 1020L1607 1019.5L1609 1017L1608 991.5L1604 950L1597.5 938L1593.5 933L1525 912.5V899H1532L1533 899.5L1573 910.5H1593.5L1596.5 906L1601 895L1596.5 832.5L1593.5 828.5L1569.5 827Z",
};

export const ALL_TOWERS_SVGS = {
  0: {
    "T5": "M1053 515L1066.5 499.5L1191.5 540.5L1178 692L1164 712.5V718L1102.5 803L999 764V754.5L995.5 753.5L998 603L1029 565.5L1037 568.5V533.5L1048 520.5L1054.5 522.5L1058.5 517L1053 515Z",
    "T6": "M905 465.5L920 451L1037 489.5L1034.5 567.5L1029 565.5L997.5 603L996.5 679.5L976 704.5V709.5L949 743.5L857 707.5V698.5L851 696L844.5 547.5L877.5 512.5L889.5 516.5V490L891.5 487V484.5L888.5 483L900.5 470.5L906 472.5L910.5 467.5L905 465.5Z",
    "T7": "M662 478.5L726 421L776 438L774.5 441L808.5 453L814.5 447L858 462L861.5 530L844.5 548L847.5 635.5L802 687L679.5 637L662 478.5Z",
    "T8": "M743.5 405.5L812.5 343.5L834.5 351L831.5 354L839.5 356.5L842.5 353.5L860.5 359.5L858 363V371L881 379L878.5 381.5V390.5L890.5 378.5L941.5 393.5L941 458L920 451L905 465.5L910.5 467.5L906 472.5L900.5 470.5L888.5 483L891.5 484.5V487L889.5 490V516.5L877.5 512.5L861.5 529.5L858 461.5L814.5 447L808.5 453L774.5 441L776 438L745.5 427.5L743.5 405.5Z",
    "T9": "M828 329.5L888.5 275.5L909.5 282.5L907.5 285L914.5 287L917 284.5L935 289.5L932 293V302L934.5 303L936 302L955 307.5L953 310V318.5L964.5 306.5L1012.5 321L1011.5 472.5L1005 479L941.5 458V393.5L890.5 378.5L878.5 390V381.5L881 379L858 371V363L860.5 359.5L842.5 353.5L839.5 356.5L831.5 354L834.5 351L829 349L828 329.5Z",
    "T10": "M903.5 262L952 218.5L1024.5 240.5L1022.5 242.5V246.5L1031 238L1070.5 249L1066 388L1063.5 391V398.5L1018.5 448.5L1012.5 447.5V321L964.5 306.5L953 318.5V310L955 307.5L936 302L934.5 303L932 302V293L935 289.5L917 284.5L914.5 287L907.5 285L909.5 282.5L903.5 280.5V262Z",
    "T11": "M965.5 206.5L1017.5 160L1037.5 165.5L1036 167.5L1042 169.5L1044.5 167L1061.5 171.5V172.5L1058 175.5V180L1063 181L1064.5 180L1082.5 185L1080 187V195.5L1089.5 185.5L1136 198L1128 331.5L1124.5 343.5L1086.5 386L1066.5 380L1070.5 249L1031 238L1022.5 246.5V242.5L1024.5 240.5L965.5 222.5V206.5Z",
  },
  1: {
    "T5": "M579 556.5L563 417L629.5 371.5L674 386.5L672 388.5L691 395.5L688 398.5V411L700.5 414.5L706 411L697 409V406.5L717.5 392L735.5 397.5L733 400L739 403L743 400L763.5 406.5L773.5 566.5L754.5 583L702 627L658.5 610.5L655.5 612.5L644 609L642 575.5L595 561.5L583 557.5L579 556.5Z",
    "T6": "M662.5 382.5L659.5 351.5L720.5 309.5L764.5 323L761.5 325L772.5 328.5L771 330L792.5 337.5L805.5 328L823 333.5L820 335.5L827 338L830 335.5L851.5 341.5L856.5 498L790.5 552.5L772.5 545L763.5 406.5L743 400L739 403L733 400L735.5 397.5L717.5 392L697 406.5V409L706 411L700.5 414.5L688 410.671V398.5L691 395.5L672 388.5L674 386.5L662.5 382.5Z",
    "T7": "M750.5 288L776 270.5L791.5 275L790.5 283L793 284L793.5 288L795 287.5L794.5 271L791.5 270.5V269L802.5 261L799.5 258.5L829.5 238L908.5 260V284L903 288L903.5 300L901 302.5L904.5 303.5V309L902 310.5L885 305.5L855 328L855.5 342.5L830 335.5L827 338L820 335.5L823 333.5L805.5 328L792.5 337.5L771 330L772.5 328.5L761.5 325L764.5 323L752 319L750.5 288Z",
    "T8": "M859.5 482L855 328L885 305.5L902 310.5L904.5 309V303.5L901 302.5L903.5 299.5L903 288L931.5 267L1029.5 294.5L1029 325L1026.5 327V333.5L1021.5 338L1022.5 339.5V346L1007.5 341.5L978 364V474L944 510.5L859.5 482Z",
    "T9": "M1030.5 321.5C1039.87 313.69 1044.63 309.81 1054 302L1154.5 330L1151 381.5L1134 376.5L1111 397L1106 512L1063.5 550.5L978 521.5V364L1007.5 341.5L1022.5 346V339.5L1021.5 338L1026.5 333.5L1030.5 330V325V321.5Z",
    "T10": "M1156 362.5L1182 338L1274.5 364L1270 419L1264.5 417L1239 443L1228.5 560L1205 590L1104.5 556.5L1111 397L1134 376.5L1151 381.5V389.5L1156 392V377.5L1153.5 376L1158.5 371V364L1156 363.5V362.5Z",
    "T11": "M1277.5 398L1302.5 372.5L1417.5 405.5L1397.5 567L1374 591L1357.5 585.5V598.5L1349 609.5L1341.5 606.5L1327 623V636.5L1225 604.5L1239 443L1264.5 417L1276 421L1277.5 398Z",
  },
  2: {
    "T5": "M1140.5 419.5L1252.5 364L1300.5 399.5L1295.5 402L1298.5 407L1293 409.5V411.5H1296.5L1316 426L1311 428.5L1310 437L1331 426L1381 462L1354 609.5L1347 615L1353 619V621L1348.5 624L1347 632L1261.5 682L1258.5 679.5L1256.5 680.5L1225 653.5L1239 537.5L1190.5 498.5L1180.5 504L1173 508L1170 505V499.5L1173 498L1153 482V473L1160 469L1140.5 453.5V426.5L1144.5 423L1140.5 419.5Z",
    "T6": "M992 491L1112.5 432L1160 469L1153 473V482L1173 498L1170 499.5V505L1173 508L1190.5 498.5L1238.5 537.5L1222 674L1215 678.5L1221 686L1215 689.5L1220 696L1211 702V706L1214 708.5L1121.5 762.5L1097 740.5V730.5L1089.5 723L1072 732.5L1077 625.5L992 548.5V491Z",
    "T7": "M932.5 566L983 540.5L1076.5 625.5L1070 786.5L1066.5 788L1071.5 792.5L1043 810L1037.5 804L1021.5 814L1016 817V825L998.5 835L989 825L975.5 833V845.5L918 878L845 799V777L841 772.5L833.5 629.5L836 628L832 622.5L894.5 590.5L913 609L922.5 604V594L918 589.5L937 579L932.5 573.5L937 571L932.5 566Z",
    "T8": "M726.5 517L722.5 512.5L750.5 498.5L754.5 502.5L764 498.5L760.5 494.5L783 483.5L807.5 507.5L795.5 513.5L801.5 519L814 513.5L820 519L818.5 497L814 492L843.5 478L838.5 472.5L897 445L974 514V521L975 544.5L932.5 566L937 571L932.5 573.5L937 579L918 589L922.5 594V604L913 609L894.5 590.5L831.5 622.5L835.5 628L833 629.5L840 758.5L821.5 770.5L743 684.5L744 680.5L739 674.5L723.5 519.5L726.5 517Z",
    "T9": "M630 420L627 416L654 404L657.5 407.5L667 403.5L664 400L685.5 390.5L708 411.5L695.5 417L701 422.5L712.5 418V407.5L708 403L726.5 394L725.5 393L744 384.5L739 380L796 356L865.5 418V459.5L838.5 472.5L843.5 478L814 492L818.5 497L820 519L814 513.5L801.5 519L795.5 513.5L807.5 507.5L783 483.5L760.5 494.5L764 498.5L754.5 502.5L750.5 498.5L722.5 512.5L726.5 517L723.5 519.5L737 652.5L722 660.5L650.5 587L628.5 423.5L630 420Z",
    "T10": "M574 495.5L547.5 336.5L605 313L620 327L612 331L617 336L625 333L630 337L636.5 334L628 325L627 315.5L622.5 310L645.5 300L641 295L687 276L756.5 338.5L758 371.5L739 380L744 384.5L725.5 393L726.5 394L708 403L712.5 407.5V418L701 422.5L696 417L708 411.5L685.5 390.5L664 400L667 403.5L657.5 407.5L654 404L627 416L630 420L628.5 423.5L646.5 557L632.5 564L626 559L578.5 506.5V501L574 495.5Z",
    "T11": "M496.5 411.5L466 254.5L492 245L495 248L504 245L501 241.5L522 233.5L541 251.5L538 253.5V258.5L545 256L544.5 246.5L540 242.5V241.5L557 235V233.5L571.5 228V225L624.5 204.5L684 256V277L641 295L645.5 300L622.5 310L627 315.5L628 325L636.5 334L630 337L625 333L617 336L612 331L620 327L605 313L547.5 336.5L571 479.5L559 484.5L544 469.5V467L501 420.5V416L496.5 411.5Z",
  },

};

// Clubhouse overlay path per aerial image index (0,1,2)
// TODO: Fill these with the precise polygon path data for the club
export const CLUB_SVGS = {
  0: "M1154 758L1151 795.5L1167 801L1165.5 822.5L1164 825.5L1260 863L1261 861.5L1263 862L1274.5 843L1316 858.5L1347.5 804V796L1352.5 788L1359 744H1357L1358 734L1305 714.5V709L1302 708V705L1233.5 680L1232 682.5L1227 681L1225.5 683L1224.5 698.5L1195.5 688V674.5L1191 673L1165 711L1162.5 744.5L1154 758Z",
  1: "M460.5 599L466.5 640L480.5 645L475 649.5L480.5 688L541.5 712L646.5 628L642 576L583 558V564.5L573.5 572L523 552L514 558.5L513.5 550.5L512 549.5L485 569.5L486.5 579.5L460.5 599Z",
  2: "M1381.5 462.5L1358 592L1392.5 572.5L1419.5 593.5L1490.5 552L1499 512.5V510L1496.5 508V506L1482 495.5L1483.5 487L1457 467.5L1461.5 444L1441 429L1443 419.5L1429.5 410.5L1403 425L1401.5 424L1392 429.5V427V424.5L1386.5 427L1384.5 425L1354 441.5L1381.5 462.5Z",
};

export const TOWERS_LIST = Object.keys(ALL_TOWERS_SVGS[0]);

export const TOWERS = {};
export const UNIT_STATUS = {
  AVAILABLE: "available",
  BOOKED: "sold",
  BLOCKED: "hold",
  HOLD: "hold",
};

export const getTowerNumberFromName = (tower) => parseInt(tower.split("-")[1]);

export const UNIT_STATUS_LIST = Object.keys(UNIT_STATUS);

export const BOOKING_MODES = {
  ONLINE: "Online",
  OFFLINE: "Offline",
};

export const BOOKING_MODES_LIST = Object.keys(BOOKING_MODES);

export const PAGES = ["World", "Dubai", "Hartland", "Waves", "Floor"];

export const USER_DETAILS_FEILDS = {
  firstName: "firstName",
  lastName: "lastName",
  email: "email",
  mobile: "mobile",
  timestamp: "timestamp",
  flatId: "flatId",
};

export const BOOKING_DETAILS_FEILDS = {
  transactionID: "transactionID",
  amount: "amount",
  mode: "mode",
  timestamp: "timestamp",
  flatId: "flatId",
};

export const dummyUser = {
  [USER_DETAILS_FEILDS.firstName]: "John",
  [USER_DETAILS_FEILDS.lastName]: "Doe",
  [USER_DETAILS_FEILDS.email]: "johndoe@gmail.com",
  [USER_DETAILS_FEILDS.mobile]: "1234567892",
  [USER_DETAILS_FEILDS.timestamp]: new Date().getTime(),
  [USER_DETAILS_FEILDS.flatId]: "A-101",
};

export const screen1_landMarks = [
  ...Object.keys(screen1_landmarks_with_routes).map((landmark) => ({
    icon: screen1_landmarks_with_routes[landmark].icon,
    id: landmark,
    route: screen1_landmarks_with_routes[landmark].route,
    routeDetails: screen1_landmarks_with_routes[landmark].routeDetails,
  })),
];

export const screen2_landMarks = [
  ...Object.keys(screen2_landmarks_with_routes).map((landmark) => ({
    icon: screen2_landmarks_with_routes[landmark].icon,
    id: landmark,
    route: screen2_landmarks_with_routes[landmark].route,
    routeDetails: screen2_landmarks_with_routes[landmark].routeDetails,
  })),
];

export const screen1PageMapFilters = [
  {
    id: "map-filter-highways",
    title: "Highways",
    className: "highway",
    icon: highway_icon,
    landmarks: (
      <g className="overlay-can-hide">
        <MarkWithTippy>{mark_highways}</MarkWithTippy>
      </g>
    ),
  },
  {
    id: "map-filter-malls",
    title: "Malls",
    className: "retail",
    icon: malls_icon,
    landmarks: (
      <g className="overlay-can-hide">
        <MarkWithTippy>{mark_malls}</MarkWithTippy>
      </g>
    ),
  },
  {
    id: "map-filter-hospitals",
    title: "Hospitals",
    className: "hospitals",
    icon: hospital_icon,
    landmarks: (
      <g className="overlay-can-hide">
        <MarkWithTippy>{mark_hospitals}</MarkWithTippy>
      </g>
    ),
  },
  {
    id: "map-filter-schools",
    title: "Schools",
    className: "education",
    icon: school_icon,
    landmarks: (
      <g className="overlay-can-hide">
        <MarkWithTippy>{mark_schools}</MarkWithTippy>
      </g>
    ),
  },
  {
    id: "map-filter-hotels",
    title: "Hotels",
    className: "hotels",
    icon: hotel_icon,
    landmarks: (
      <g className="overlay-can-hide">
        <MarkWithTippy>{mark_hotels}</MarkWithTippy>
      </g>
    ),
  },
  {
    id: "map-filter-landmarks",
    title: "Landmarks",
    className: "landmarks",
    icon: (
      <svg
        width="17"
        height="17"
        viewBox="0 0 17 17"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          clip-rule="evenodd"
          d="M8.5 0C3.79933 0 0 3.79933 0 8.5C0 13.2007 3.79933 17 8.5 17C13.2007 17 17 13.2007 17 8.5C17 3.79933 13.2007 0 8.5 0ZM3.58663 7.21096C3.53042 7.15506 3.47421 7.09916 3.39551 7.00972C3.82021 6.94939 4.23716 6.8852 4.64797 6.82196C5.22678 6.73286 5.7934 6.64563 6.35233 6.5737C6.73459 6.52898 6.95944 6.39482 7.12808 6.02588C7.50014 5.2159 7.89919 4.43275 8.31718 3.61243C8.36651 3.51561 8.41611 3.41827 8.46596 3.32031C8.48133 3.34705 8.49538 3.36988 8.50812 3.39057C8.53267 3.43044 8.55234 3.46239 8.56714 3.49919C8.792 3.96316 9.02247 4.42434 9.25295 4.88552C9.48342 5.34669 9.7139 5.80787 9.93875 6.27184C10.0175 6.42836 10.1074 6.49544 10.2873 6.5178C11.1463 6.63594 11.9904 6.76146 12.8439 6.88837C13.0404 6.91759 13.2374 6.94689 13.4352 6.97618C13.4521 6.98177 13.469 6.98457 13.4858 6.98736C13.5027 6.99016 13.5195 6.99295 13.5364 6.99854C13.5477 7.00972 13.5589 7.0237 13.5701 7.03767C13.5814 7.05165 13.5926 7.06562 13.6039 7.0768C13.5875 7.0838 13.5711 7.0903 13.5549 7.09672C13.4933 7.12112 13.4348 7.14436 13.3903 7.1886C13.0192 7.54078 12.6539 7.89575 12.2885 8.25071C11.9231 8.60568 11.5577 8.96064 11.1867 9.31281C11.063 9.42461 11.0293 9.53641 11.063 9.70411C11.1904 10.3824 11.3079 11.0606 11.4253 11.7389C11.484 12.078 11.5427 12.4171 11.6027 12.7563C11.6099 12.785 11.6078 12.8229 11.6054 12.8671C11.6041 12.8918 11.6027 12.9183 11.6027 12.9463C11.5511 12.9271 11.507 12.9042 11.4638 12.8818C11.4317 12.8652 11.4002 12.8488 11.3666 12.8345C10.4674 12.3651 9.56751 11.8953 8.65709 11.4147C8.53342 11.3476 8.43223 11.3476 8.30856 11.4147C7.39792 11.8842 6.48729 12.3649 5.57665 12.8457C5.54038 12.8697 5.50082 12.8873 5.45631 12.9071C5.41802 12.9242 5.37604 12.9428 5.32925 12.9687C5.38546 12.6557 5.43042 12.3762 5.47539 12.0967C5.59257 11.3879 5.71823 10.6874 5.845 9.98079C5.86419 9.87381 5.88341 9.7667 5.90263 9.65939C5.93636 9.53641 5.90263 9.45815 5.81269 9.36871C5.07067 8.65319 4.32865 7.93767 3.58663 7.21096Z"
          fill="#959697"
        ></path>
      </svg>
    ),
    landmarks: (
      <g className="overlay-can-hide">
        <LandMarks landmarks={screen1_landMarks} />
      </g>
    ),
  },
];

export const screen2PageMapFilters = [
  {
    id: "map-filter-highways",
    title: "Highways",
    className: "highway",
    icon: highway_icon,
    landmarks: (
      <g className="overlay-can-hide">
        <MarkWithTippy>{screen2_mark_highways}</MarkWithTippy>
      </g>
    ),
  },
  {
    id: "map-filter-malls",
    title: "Malls",
    className: "retail",
    icon: malls_icon,
    landmarks: (
      <g className="overlay-can-hide">
        <MarkWithTippy>{screen2_mark_malls}</MarkWithTippy>
      </g>
    ),
  },
  {
    id: "map-filter-schools",
    title: "Schools",
    className: "education",
    icon: school_icon,
    landmarks: (
      <g className="overlay-can-hide">
        <MarkWithTippy>{screen2_mark_schools}</MarkWithTippy>
      </g>
    ),
  },
  {
    id: "map-filter-hotels",
    title: "Hotels",
    className: "hotels",
    icon: hotel_icon,
    landmarks: (
      <g className="overlay-can-hide">
        <MarkWithTippy>{screen2_mark_hotels}</MarkWithTippy>
      </g>
    ),
  },
  {
    id: "map-filter-landmarks",
    title: "Landmarks",
    className: "landmarks",
    icon: (
      <svg
        width="17"
        height="17"
        viewBox="0 0 17 17"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M8.5 0C3.79933 0 0 3.79933 0 8.5C0 13.2007 3.79933 17 8.5 17C13.2007 17 17 13.2007 17 8.5C17 3.79933 13.2007 0 8.5 0ZM3.58663 7.21096C3.53042 7.15506 3.47421 7.09916 3.39551 7.00972C3.82021 6.94939 4.23716 6.8852 4.64797 6.82196C5.22678 6.73286 5.7934 6.64563 6.35233 6.5737C6.73459 6.52898 6.95944 6.39482 7.12808 6.02588C7.50014 5.2159 7.89919 4.43275 8.31718 3.61243C8.36651 3.51561 8.41611 3.41827 8.46596 3.32031C8.48133 3.34705 8.49538 3.36988 8.50812 3.39057C8.53267 3.43044 8.55234 3.46239 8.56714 3.49919C8.792 3.96316 9.02247 4.42434 9.25295 4.88552C9.48342 5.34669 9.7139 5.80787 9.93875 6.27184C10.0175 6.42836 10.1074 6.49544 10.2873 6.5178C11.1463 6.63594 11.9904 6.76146 12.8439 6.88837C13.0404 6.91759 13.2374 6.94689 13.4352 6.97618C13.4521 6.98177 13.469 6.98457 13.4858 6.98736C13.5027 6.99016 13.5195 6.99295 13.5364 6.99854C13.5477 7.00972 13.5589 7.0237 13.5701 7.03767C13.5814 7.05165 13.5926 7.06562 13.6039 7.0768C13.5875 7.0838 13.5711 7.0903 13.5549 7.09672C13.4933 7.12112 13.4348 7.14436 13.3903 7.1886C13.0192 7.54078 12.6539 7.89575 12.2885 8.25071C11.9231 8.60568 11.5577 8.96064 11.1867 9.31281C11.063 9.42461 11.0293 9.53641 11.063 9.70411C11.1904 10.3824 11.3079 11.0606 11.4253 11.7389C11.484 12.078 11.5427 12.4171 11.6027 12.7563C11.6099 12.785 11.6078 12.8229 11.6054 12.8671C11.6041 12.8918 11.6027 12.9183 11.6027 12.9463C11.5511 12.9271 11.507 12.9042 11.4638 12.8818C11.4317 12.8652 11.4002 12.8488 11.3666 12.8345C10.4674 12.3651 9.56751 11.8953 8.65709 11.4147C8.53342 11.3476 8.43223 11.3476 8.30856 11.4147C7.39792 11.8842 6.48729 12.3649 5.57665 12.8457C5.54038 12.8697 5.50082 12.8873 5.45631 12.9071C5.41802 12.9242 5.37604 12.9428 5.32925 12.9687C5.38546 12.6557 5.43042 12.3762 5.47539 12.0967C5.59257 11.3879 5.71823 10.6874 5.845 9.98079C5.86419 9.87381 5.88341 9.7667 5.90263 9.65939C5.93636 9.53641 5.90263 9.45815 5.81269 9.36871C5.07067 8.65319 4.32865 7.93767 3.58663 7.21096Z"
          fill="#959697"
        ></path>
      </svg>
    ),
    landmarks: (
      <g className="overlay-can-hide">
        <LandMarks landmarks={screen2_landMarks} />
      </g>
    ),
  },
];

export const VR_TOUR_LINKS = {
  "2.5 BHK":
    "https://btvrprojects.s3.ap-south-1.amazonaws.com/Smart_World+2.5BHK+-+Integrated_Tour/index.htm",
  "3.5 BHK":
    "https://btvrprojects.s3.ap-south-1.amazonaws.com/Smart_World+3BHK+-+Integrated_Tour/index.htm",
  "4.5 BHK":
    "https://btvrprojects.s3.ap-south-1.amazonaws.com/Smart_World+4.5BHK+-+Integrated_Tour/index.htm",
};

export const USER_TYPES = {
  ADMIN: "ADMIN",
  USER: "USER",
};

export const getImageSource = (floorId, unitnumber) => {
  let numId = Number(floorId);

  if (
    [
      2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 15, 16, 17, 18, 19, 20, 21,
    ].includes(numId)
  )
    numId = 2;

  if ([14, 22].includes(numId)) numId = 22;
  if ([23, 24, 25, 26, 27, 28].includes(numId)) numId = 23;
  if ([30, 32].includes(numId)) numId = 32;
  const imageMap = {
    2: {
      1: `4bhk_2_21`,
      2: `4bhk_2_21`,
      3: `3bhk_2_21`,
      4: `3bhk_2_21`,
    },
    22: {
      1: `4bhk_14and22`,
      2: `4bhk_14and22`,
      3: `3bhk_refuge_14and22`,
      4: `3bhk_14and22`,
    },
    23: {
      1: `4bhk_23_28`,
      2: `4bhk_23_28`,
      3: `3bhk_23_28`,
      4: `3bhk_23_28`,
    },
    29: {
      1: `4bhk_29`,
      2: `4bhk_29`,
      3: `3bhk_29`,
      4: `3bhk_29`,
    },
    32: {
      1: `4bhk_30and32`,
      2: `4bhk_30and32`,
      3: `3bhk_30and32`,
      4: `3bhk_30and32`,
    },
    31: {
      1: `4bhk_31`,
      2: `4bhk_31`,
      3: `3bhk_reguge_31`,
      4: `3bhk_31`,
    },
  };
  if (imageMap[numId] && imageMap[numId][unitnumber]) {
    return imageMap[numId][unitnumber];
  } else {
    return `31-32flor_1`;
  }
};

export const floorTypeMapping = {

}


export const getFloorType = (tower, floor) => {

  switch (tower) {
    case "T1":
    case "T12":
      return ["type1a"];
    case "T2":
      if (floor == "G") return ["g2type1"];
      if (floor == 1) return ["1type1"];
      if (floor == 7) return ["7type1"];
      return ["type1"];
    case "T7":
      if (floor == "G") return ["g7type1"];
      if (floor == 1) return ["1type1"];
      if (floor == 7) return ["7type1"];
      return ["type1"];
    case "T10":
      if (floor == "G") return ["g10type1"];
      if (floor == 1) return ["1type1"];
      if (floor == 7) return ["7type1"];
      return ["type1"];
    case "T4":
    case "T8":
      if (floor == "G") return ["g8type2"];
      if (floor == 1) return ["8type2f1"];
      if (floor == 7) return ["8type2f7"];
      if (floor == 11) return ["8type2f11"];
      if (floor == 12) return ["8type2f12"];
      return ["8type2"];
    case "T5":
      if (floor == "G") return ["g5type2"];
      if (floor == 1) return ["1type2"];
      if (floor == 7) return ["7type2"];
      if (floor == 11) return ["11type2"];
      if (floor == 12) return ["12type2"];
      return ["type2"];
    case "T3":
      if (floor == "G") return ["g6type2a"];
      if (floor == 1) return ["1type2a"];
      if (floor == 7) return ["7type2a"];
      if (floor == 11) return ["11type2a"];
      if (floor == 12) return ["12type2a"];
      return ["type2a"];
    case "T6":
      if (floor == "G") return ["g6type2a"];
      if (floor == 1) return ["6type2af1"];
      if (floor == 7) return ["6type2af7"];
      if (floor == 11) return ["6type2af11"];
      if (floor == 12) return ["6type2af12"];
      return ["6type2a"];
    case "T11":
      if (floor == "G") return ["g11type2a"];
      if (floor == 1) return ["1type2a"];
      if (floor == 7) return ["7type2a"];
      if (floor == 11) return ["11type2a"];
      if (floor == 12) return ["12type2a"];
      return ["type2a"];
    case "T13":
    case "T14":
    case "T9":
      if (floor == "G") return ["g9type3a"];
      if (floor == 1) return ["1type3a"];
      if (floor == 7) return ["7type3a"];
      if (floor == 11) return ["11type3a"];
      if (floor == 12) return ["12type3a"];
      return ["type3a"];
    default:
      return ["unknown"];
  }
};

export const getFloorTypeUnit = (tower, floor) => {

  switch (tower) {
    case "T1":
    case "T12":
      return ["type1a"];
    case "T2":
    case "T7":
    case "T10":
      return ["type1"];
    case "T4":
    case "T8":
      return ["type2"];
    case "T5":
      return ["5type2"];
    case "T3":
    case "T11":
      return ["type2a"];
    case "T6":
      return ["6type2a"];
    case "T13":
    case "T14":
    case "T9":
      return ["type3a"];
    default:
      return ["unknown"];
  }
};


export const getFloorName = (tower, floor, upperUnit) => {
  // let floorG;
  // switch (tower) {
  //   case "T5":
  //     floorG = "g5floor";
  //     break;
  //   case "T6":
  //     floorG = "g6floor";
  //     break;
  //   case "T7":
  //     floorG = "g7floor";
  //     break;
  //   case "T8":
  //     floorG = "g8floor";
  //     break;
  //   case "T9":
  //     floorG = "g9floor";
  //     break;
  //   case "T10":
  //     floorG = "g10floor";
  //     break;
  //   default:
  //     floorG = undefined;
  // }
  const floor1 = ["1", "g", "G"];
  const floor2ndTo10th = ["2", "3", "4", "5", "6", "8", "9", "10"];
  const floor7 = ["7"];
  const floor11 = ["11"];
  const floor12 = ["12"];

  if (upperUnit == 12 && !(tower == "T7" || tower == "T10")) {
    return "12thfloorplanupperduplex";
  }
  if ((tower === "T7" || tower === "T10") && (floor11.includes(floor) || floor12.includes(floor))) {
    return "2ndto6th&8thto10thfloor";
  }
  if (floor1.includes(floor)) {
    return "1stfloor";
  } else if (floor2ndTo10th.includes(floor)) {
    return "2ndto6th&8thto10thfloor";
  } else if (floor11.includes(floor)) {
    return "11thfloorplanlowerduplex";
  } else if (floor12.includes(floor)) {
    return "12thfloorplanupperduplex";
  } else if (floor7.includes(floor)) {
    return "7thfloor";
  }

  //  else if (floorG && (floor === "G" || floor.includes("g"))) {
  //   return floorG;
  // }
  else {
    return "unknownfloor";
  }
}

export const towerNumberMapping = {
  "cluster1": "cluster1",
  "cluster2": "cluster2",
  "cluster3": "cluster3",
  "cluster4": "cluster4",
  "cluster5": "cluster4",
  "cluster6": "cluster3",
  "cluster7": "cluster2",
  "cluster8": "cluster4",
  "cluster9": "cluster9",
  "cluster10": "cluster2",
  "cluster11": "cluster3",
  "cluster12": "cluster1",
  "cluster13": "cluster13",
  "cluster14": "cluster13",
}



export const towerNumberMappingForFlat = {
  "T1": "T1",
  "T2": "T2",
  "T3": "T3",
  "T4": "T4",
  "T5": "T4",
  "T6": "T3",
  "T7": "T2",
  "T8": "T4",
  "T9": "T9",
  "T10": "T2",
  "T11": "T3",
  "T12": "T1",
  "T13": "T13",
  "T14": "T13",
}
export const getTowerNumberForFlat = (tower, floor) => {
  if (['g', "G"].includes(floor)) {
    return tower
  }
  return towerNumberMappingForFlat[tower];
}


export const getTowerNumber = (tower, floor) => {
  if (['g', "G"].includes(floor)) {
    return tower
  }
  return towerNumberMapping[tower];
};
