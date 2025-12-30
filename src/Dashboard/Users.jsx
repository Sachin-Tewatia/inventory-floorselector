import {
  Button,
  Space,
  Table,
  Form,
  Input,
  Select,
  message,
  Modal,
  Popconfirm,
  Tag,
} from "antd";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";
import { useInventories } from "../Hooks";

// import { inventories } from "../Data/inventories";
import { Link, useNavigate } from "react-router-dom";
import {
  baseURL,
  exportBookingsAPI,
  updateBookingAPI,
  updateInventoryAPI,
  PROJECT_ID,
  UNIT_TYPE,
} from "../APIs";
import DashboardWrapper from ".";
import ImportExport from "./ImportExport";
import TextArea from "antd/es/input/TextArea";
import { AppContext } from "../Contexts/AppContext";
import LogoutBtn from "./LogoutBtn";
import { SelectOutlined } from "@ant-design/icons";
import DocumentsInfo from "./DocumentsInfo";
import UserForm from "./UserForm";

const Search = ({ value, setValue }) => {
  return (
    <Form
      name="basic"
      initialValues={{ remember: true }}
      autoComplete="off"
      style={{
        display: "flex",
        alignItems: "center",
        padding: "1rem 0",
      }}
    >
      <Form.Item
        style={{ margin: 0, marginRight: "1rem", padding: "0" }}
        name="FlatId"
      >
        <Input
          placeholder={`${UNIT_TYPE} Id or Email`}
          // onChange={(e) => onSearch(e.target.value)}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </Form.Item>
    </Form>
  );
};

const Users = () => {
  const { inventories } = useInventories();
  const [isOpen, setIsOpen] = useState(false);
  const [filteredInfo, setFilteredInfo] = useState({});
  const [sortedInfo, setSortedInfo] = useState({});
  const [data, setData] = useState();
  const [tableData, setTableData] = useState([]);
  const [justEditedField, setJustEditedField] = useState(false);
  const [tableLoading, setTableLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  //   const [remark1, setRemark1] = useState("");
  //   const [remark2, setRemark2] = useState("");
  //   const [remark3, setRemark3] = useState("");
  const { Option } = Select;
  const navigate = useNavigate();
  const { user } = useContext(AppContext);
  const [searchText, setSearchText] = useState("");
  const [documents, setDocuments] = useState({});

  const getUser = async () => {
    try {
      setTableLoading(true);
      const userFromServer = await axios.get(`${baseURL}/admin/${PROJECT_ID}`, {
        headers: {
          authorization: localStorage.getItem("token"),
        },
      });

      let data = userFromServer.data;

      //   if (user.role == "rm")
      //     data = data.filter((item) => item.rm_name == user.firstName);

      setData(data);
      setTableData(data);
    } catch (error) {
    } finally {
      setTableLoading(false);
    }
  };
  const handleDetailsFilledSuccess = () => {
    getUser();
  };

  //to Disable user
  const handleStatus = async (email, status) => {
    setUpdating(true);
    const res_status = await axios.post(
      `${baseURL}/admin/${PROJECT_ID}`,
      {
        email: email,
        project_id: PROJECT_ID,
        is_active: status,
      },
      {
        headers: {
          authorization: localStorage.getItem("token"),
          contentType: "application/json",
        },
      }
    );

    if (res_status == 401) {
      localStorage.removeItem("token");
      navigate("/admin/login");
    } else if (res_status?.status !== 200) {
      message.error(`Failed to ${status ? "Enable" : "Disable"} user`);
    }

    if (res_status?.status == 200) {
      message.success(`User ${status ? "Enable" : "Disable"} Successfully`);
    }
    setUpdating(false);
    getUser();
  };

  const handleRefresh = async () => {
    setTableLoading(true);
    await getUser();
    setTableLoading(false);
  };

  useEffect(() => {
    getUser();
  }, []);

  useEffect(() => {
    setTableData(data);
    setTimeout(() => {
      handleSearch();
    }, 200);
  }, [data]);

  const handleChange = (pagination, filters, sorter) => {
    setFilteredInfo(filters);
    setSortedInfo(sorter);
  };
  const clearFilters = () => {
    setFilteredInfo({});
  };
  const clearAll = () => {
    setFilteredInfo({});
    setSortedInfo({});
  };

  const handleUpadeBooking = async (id, details) => {
    setUpdating(true);
    const res_status = await updateBookingAPI(id, details);
    if (res_status == 401) {
      localStorage.removeItem("token");
      navigate("/admin/login");
    } else if (res_status !== 200) message.error("Failed to update inventory");
    setUpdating(false);
  };

  const getChangedColumn = (old_row, row) => {
    let changed_column;
    Object.keys(row).forEach((key) => {
      if (old_row[key] !== row[key]) {
        changed_column = key;
        return;
      }
    });
    return changed_column;
  };

  //   const handleFieldUpdate = async () => {
  //     const { editedField, row } = justEditedField;

  //     const { id } = row;
  //     const details = {
  //       [editedField]: row[editedField],
  //     };

  //     await handleUpadeBooking(id, {
  //       status: details.status,
  //       remark1: remark1,
  //       remark2: remark2,
  //       remark3: remark3,
  //     });

  //     const newData = [...data];
  //     const index = newData.findIndex((item) => row.id === item.id);
  //     const item = newData[index];

  //     newData.splice(index, 1, { ...item, ...row });

  //     setData(newData);

  //     setJustEditedField(false);
  //     getUser();
  //   };

  const handleDocsDownload = (urls) => {
    function download(urls) {
      let url = urls.pop();

      let a = document.createElement("a");
      a.setAttribute("href", url);
      a.setAttribute("download", "");
      a.setAttribute("target", "_blank");
      a.click();

      if (urls.length == 0) {
        clearInterval(interval);
      }
    }

    let interval = setInterval(download, 300, urls);
  };

  const columns = [
    // {
    //   title: `First Name`,
    //   dataIndex: "firstName",
    //   key: "firstName",
    // },
    // {
    //   title: "Booking Status",
    //   dataIndex: "status",
    //   width: 150,
    //   key: "status",
    //   filters: [
    //     {
    //       text: "Pending",
    //       value: "pending",
    //     },
    //     {
    //       text: "Cancelled",
    //       value: "cancelled",
    //     },
    //     {
    //       text: "Confirmed",
    //       value: "confirmed",
    //     },
    //   ],
    //   filteredValue: filteredInfo.status || null,
    //   onFilter: (value, record) => record?.status?.includes(value),
    //   ellipsis: true,
    //   render: (_, record) => (
    //     <Select
    //       style={{ width: "100%" }}
    //       defaultValue={record.status}
    //       onChange={(value) => {
    //         setJustEditedField({
    //           row: { ...record, status: value },
    //           oldRow: record,
    //           editedField: "status",
    //         });

    //         // setUnitIdForBooking(justEditedField.row.id);
    //       }}
    //       value={record.status}
    //     >
    //       <Option disabled value={"pending"}>
    //         Pending
    //       </Option>
    //       <Option disabled={record.status !== "pending"} value={"cancelled"}>
    //         Cancelled
    //       </Option>
    //       <Option disabled={record.status !== "pending"} value={"confirmed"}>
    //         Confirmed
    //       </Option>
    //     </Select>
    //   ),
    // },
    {
      title: "First Name",
      dataIndex: "firstName",
      key: "firstName",
      sorter: (a, b) => a.firstName - b.firstName,
      sortOrder: sortedInfo.columnKey === "firstName" ? sortedInfo.order : null,
      ellipsis: true,
      render: (_, record) =>
        // <Link to={`/booking-success/${record.id}`}>{record.firstName}</Link>
        record.firstName,
    },
    // {
    //   title: "Last Name",
    //   dataIndex: "lastName",
    //   key: "lastName",
    // },

    // {
    //   title: "Remark1",
    //   dataIndex: "remark1",
    //   key: "remark1",
    //   render: (_, record) => (record.remark1 ? <>{record.remark1}</> : <>-</>),
    // },
    // {
    //   title: "Remarks",
    //   dataIndex: "remark2",
    //   key: "remark2",
    //   render: (_, record) => (record.remark2 ? <>{record.remark2}</> : <>-</>),
    // },
    // {
    //   title: "Remark3",
    //   dataIndex: "remark3",
    //   key: "remark3",
    //   render: (_, record) => (record.remark3 ? <>{record.remark3}</> : <>-</>),
    // },
    {
      title: "Mobile",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },

    {
      title: `Project Id`,
      dataIndex: "project_id",
      key: "project_id:",
    },

    // {
    //   title: `Channel Partner`,
    //   dataIndex: "partner_details",
    //   key: "partner_details",
    // },

    {
      title: `Role`,
      dataIndex: "role",
      key: "role::",
    },
    {
      title: "Manage Users",
      key: "action",
      render: (_, record) => {
        return (
          <Space style={{ width: "20%" }}>
            <Popconfirm
              title={`Sure want to Disable ${record.firstName}`}
              onConfirm={() => handleStatus(record.email, false)}
              okButtonProps={{ loading: updating }}
            >
              <Space size="middle">
                <Button type="primary" danger>
                  Disable{" "}
                </Button>
              </Space>
            </Popconfirm>
            <Popconfirm
              title={`Sure want Enable ${record.firstName}`}
              onConfirm={() => handleStatus(record.email, true)}
              okButtonProps={{ loading: updating }}
            >
              <Space size="middle">
                <Button type="primary" style={{ margin: "5px" }}>
                  Enable{" "}
                </Button>
              </Space>
            </Popconfirm>
          </Space>
        );
      },
    },
    {
      title: `User Status`,
      dataIndex: "is_active",
      key: "status::",
      render: (_, record) =>
        record?.is_active === true ? (
          <Tag color="green"> Active</Tag>
        ) : (
          <Tag color="red"> Inactive</Tag>
        ),
    },
    // {
    //   title: `Block Time`,
    //   dataIndex: "createdAt",
    //   key: "createdAt",
    //   render: (text) => {
    //     return new Date(text).toLocaleString();
    //   },
    //   sorter: (a, b) => {
    //     return new Date(a.createdAt) - new Date(b.createdAt);
    //   },
    //   sortOrder: sortedInfo.columnKey === "createdAt" ? sortedInfo.order : null,
    // },
    // {
    //   title: `Documents`,
    //   dataIndex: "documents",
    //   key: "documents",
    //   render: (_, record) => (
    //     <Button
    //       onClick={() =>
    //         setDocuments({
    //           otherDocuments: record.documents,
    //           aadhar: record.aadhar,
    //           pancard: record.pancard,
    //         })
    //       }
    //     >
    //       <SelectOutlined />
    //     </Button>
    //   ),
    // render: (docs) => {
    //   return docs?.length > 0 ? (
    //     <a onClick={() => handleDocsDownload(docs)}>
    //       <Button type="primary">Download</Button>
    //     </a>
    //   ) : (
    //     "No Document Found"
    //   );
    // },
    // },
  ];

  const handleSearch = () => {
    const value = searchText;
    if (!data || !data.length) return;
    const filterByEmail = data.filter((item) => {
      return item.email.toLowerCase().includes(value.toLowerCase());
    });
    const filterByFlatId = data.filter((item) => {
      return item.unit_id?.toLowerCase().includes(value.toLowerCase());
    });

    setTableData([...new Set([...filterByEmail, ...filterByFlatId])]);
  };

  useEffect(() => {
    handleSearch();
  }, [searchText]);
  if (user?.role !== "admin") return navigate("/dashboard");

  return (
    <DashboardWrapper>
      {Object.keys(documents).length > 0 && (
        <Modal open={documents} onCancel={() => setDocuments({})}>
          {documents && <DocumentsInfo documents={documents} />}
        </Modal>
      )}
      {justEditedField && (
        // if the status is changed, show payment form
        // confirmation model for any other field is changed
        <Modal
          title={`Are you sure to update Booking with Id ${justEditedField.row.id} ?`}
          // visible={justEditedField}
          open={justEditedField}
          //   onOk={handleFieldUpdate}
          okButtonProps={{ loading: updating, className: "btn-primary-ok" }}
          onCancel={() => setJustEditedField(null)}
        ></Modal>
      )}
      <div className="title1"> Manage Users</div>
      <div className="row center">
        <Search value={searchText} setValue={setSearchText} />
        <Button
          loading={tableLoading}
          onClick={handleRefresh}
          style={{
            margin: "0",
            color: "white !important",
            background: "#3f608fea",
          }}
        >
          Refresh
        </Button>
        {/* {selectedRowIds.length > 0 && (
            <SelectBulkStatus
              onChange={(status) => setBulkUpdateConfirmation(status)}
            />
          )} */}
      </div>
      <div className="head">
        <div>
          {/* <Button
            onClick={clearFilters}
            type="primary"
            className="filterbutton buttonHover"
          >
            Clear filters
          </Button> */}
          <Button
            onClick={clearAll}
            type="primary"
            className="filterbutton buttonHover"
          >
            Clear filters and sorters
          </Button>
        </div>

        <div className="datafield ml-[8%]">
          <div className="actualdata">Total : {data?.length}</div>
        </div>

        <div>
          <Button
            type="link"
            className="buttonHover filterbutton"
            onClick={() => navigate("/dashboard")}
          >
            Manage Inventory
          </Button>

          <Button
            type="link"
            className="buttonHover filterbutton"
            onClick={() => setIsOpen(true)}
          >
            Create New User
          </Button>
        </div>
        {/* <ImportExport exportOnly exportAPI={exportBookingsAPI} /> */}
      </div>
      <Table
        // components={components}
        loading={tableLoading}
        rowClassName={() => "editable-row"}
        bordered
        columns={columns}
        dataSource={tableData}
        onChange={handleChange}
        pagination={{
          defaultPageSize: parseInt(window.innerHeight / 65) - 3,
        }}
        onRow={(record) => ({
          className: record.status,
        })}
      />
      {isOpen && (
        <UserForm
          isOpen={isOpen}
          setIsOpen={(val) => setIsOpen(val)}
          // unitDetails={unitDetails}
          // handleBooking={handleBooking}
          handleDetailsFilledSuccess={handleDetailsFilledSuccess}
        />
      )}
    </DashboardWrapper>
  );
};
export default Users;