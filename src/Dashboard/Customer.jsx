import {
  Button,
  Space,
  Table,
  Form,
  Input,
  Select,
  message,
  Modal,
} from "antd";
import { useContext, useEffect, useState, useCallback } from "react";
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

const Search = ({ value, setValue,form }) => {
  return (
    <Form
      form={form}
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
          placeholder={`Flat Id or Email`}
          // onChange={(e) => onSearch(e.target.value)}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </Form.Item>
    </Form>
  );
};

const Customers = () => {
  const { inventories } = useInventories();
  const [filteredInfo, setFilteredInfo] = useState({});
  const [sortedInfo, setSortedInfo] = useState({});
  const [data, setData] = useState();
  const [tableData, setTableData] = useState([]);
  const [justEditedField, setJustEditedField] = useState(false);
  const [tableLoading, setTableLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [remark1, setRemark1] = useState("");
  const [remark2, setRemark2] = useState("");
  const [remark3, setRemark3] = useState("");
  const { Option } = Select;
  const navigate = useNavigate();
  const { user } = useContext(AppContext);
  const [searchText, setSearchText] = useState("");
  const [searchForm] = Form.useForm(); // Form instance for Search
  const [documents, setDocuments] = useState({});

  const getUser = async () => {
    try {
      setTableLoading(true);
      const userFromServer = await axios.get(
        `${baseURL}/bookings/detailed/${PROJECT_ID}`,
        {
          headers: {
            authorization: localStorage.getItem("token"),
          },
        }
      );

      let data = userFromServer.data;

      if (user.role == "rm")
        data = data.filter((item) => item.rm_name == user.firstName);

      setData(data);
      setTableData(data);
    } catch (error) {
    } finally {
      setTableLoading(false);
    }
  };

  const handleRefresh = async () => {
    setTableLoading(true);
    setSearchText("");
    searchForm.resetFields(); // Reset form fields
    await getUser();
    setTableLoading(false);
  };

  useEffect(() => {
    getUser();
  }, []);

  useEffect(() => {
    setTableData(data);
    // Note: handleSearch will be triggered by searchText useEffect
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
    if (user.role !== "admin") {
      message.error("You are not authorized to edit this field");
      return;
    }
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

  const handleFieldUpdate = async () => {
    const { editedField, row } = justEditedField;

    const { id } = row;
    const details = {
      [editedField]: row[editedField],
    };

    await handleUpadeBooking(id, {
      status: details.status,
      remark1: remark1,
      remark2: remark2,
      remark3: remark3,
    });

    const newData = [...data];
    const index = newData.findIndex((item) => row.id === item.id);
    const item = newData[index];

    newData.splice(index, 1, { ...item, ...row });

    setData(newData);

    setJustEditedField(false);
    getUser();
  };

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
    {
      title: `${UNIT_TYPE.charAt(0).toUpperCase() + UNIT_TYPE.slice(1)} Id`,
      dataIndex: "unit_id",
      key: "unit_id",
      fixed: "left",
    },
    {
      title: "Booking Status",
      dataIndex: "status",
      width: 150,
      key: "status",
      filters: [
        {
          text: "Pending",
          value: "pending",
        },
        {
          text: "Cancelled",
          value: "cancelled",
        },
        {
          text: "Confirmed",
          value: "confirmed",
        },
      ],
      filteredValue: filteredInfo.status || null,
      onFilter: (value, record) => record?.status?.includes(value),
      ellipsis: true,
      render: (_, record) => (
        <Select
          style={{ width: "100%" }}
          defaultValue={record.status}
          onChange={(value) => {
            setJustEditedField({
              row: { ...record, status: value },
              oldRow: record,
              editedField: "status",
            });

            // setUnitIdForBooking(justEditedField.row.id);
          }}
          value={record.status}
        >
          <Option disabled value={"pending"}>
            Pending
          </Option>
          <Option disabled={record.status !== "pending"} value={"cancelled"}>
            Cancelled
          </Option>
          <Option disabled={record.status !== "pending"} value={"confirmed"}>
            Confirmed
          </Option>
        </Select>
      ),
    },
    {
      title: "First Name",
      dataIndex: "firstName",
      key: "firstName",
      sorter: (a, b) => a.firstName - b.firstName,
      sortOrder: sortedInfo.columnKey === "firstName" ? sortedInfo.order : null,
      ellipsis: true,
      render: (_, record) =>
        // <Link to={`/booking-success/${record.id}`}>{record.firstName}</Link>
        record.firstName + " " + record.lastName,
    },
    // {
    //   title: "Last Name",
    //   dataIndex: "lastName",
    //   key: "lastName",
    // },

    {
      title: "Remarks",
      dataIndex: "remarks",
      key: "remarks",
      render: (_, record) => (record.remark1 ? <>{record.remark1}</> : <>-</>),
    },
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
      title: `RM (Sales Person)`,
      dataIndex: "rm_name",
      key: "rm_details:",
    },

    {
      title: `Channel Partner`,
      dataIndex: "partner_details",
      key: "partner_details",
    },

    {
      title: `Ref Or Cheque`,
      dataIndex: "ref_or_cheque",
      key: "ref_or_check::",
    },
    {
      title: `TCV`,
      dataIndex: "tcb",
      key: "tcv::",
    },
    {
      title: `Block Time`,
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text) => new Date(text).toLocaleString(),

      //   const dateDiff = parseInt(new Date() - new Date(text));
      //   const hours = 48 - Math.floor(dateDiff / 1000 / 60 / 60);
      //   console.log("dateDiff: ", dateDiff);
      //   return {
      //     props: {
      //       style: {
      //         background: hours < 0 ? "red" : "green",
      //         color: "white",
      //       },
      //     },
      //     children: (
      //       <div>
      //         <div> {new Date(text).toLocaleString()}</div>
      //         <span>
      //           {hours > 0 ? "Left: " + hours + "hrs" : "Update Status"}
      //         </span>
      //       </div>
      //     ),
      //   };

      sorter: (a, b) => {
        return new Date(a.createdAt) - new Date(b.createdAt);
      },
      sortOrder: sortedInfo.columnKey === "createdAt" ? sortedInfo.order : null,
    },
    {
      title: `Documents`,
      dataIndex: "documents",
      key: "documents",
      render: (_, record) => (
        <Button
          onClick={() => {
            setDocuments({
              data: record,
            });
          }}
        >
          <SelectOutlined />
        </Button>
      ),
    },
  ];

  const handleSearch = useCallback(() => {
    const value = searchText;
    if (!data || !data.length) return;
    const filterByEmail = data.filter((item) => {
      return item.email.toLowerCase().includes(value.toLowerCase());
    });
    const filterByFlatId = data.filter((item) => {
      return item.unit_id.toLowerCase().includes(value.toLowerCase());
    });

    setTableData([...new Set([...filterByEmail, ...filterByFlatId])]);
  }, [searchText, data]);

  useEffect(() => {
    handleSearch();
  }, [handleSearch]);

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
          onOk={handleFieldUpdate}
          okButtonProps={{ loading: updating, className: "btn-primary-ok" }}
          onCancel={() => setJustEditedField(null)}
        >
          <div>
            <p>{`You are updating ${justEditedField.editedField} from ${
              justEditedField.oldRow[justEditedField.editedField]
            } to ${justEditedField.row[justEditedField.editedField]}`}</p>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
                padding: "2rem 0",
                alignItems: "flex-start",
              }}
            >
              <label>Remark </label>
              <TextArea
                onChange={(e) => setRemark1(e.target.value)}
                placeholder="Enter Remarks"
                value={remark1}
              />
            </div>
          </div>
        </Modal>
      )}
      <div className="title1"> Manage Bookings</div>
      <div className="row center">
        <Search value={searchText} setValue={setSearchText} form={searchForm} />
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

        <div className="datafield ml-[15%]">
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

          {/* {user?.role === "admin" && (
            <Button
              type="link"
              className="buttonHover filterbutton"
              onClick={() => navigate("/dashboard/update-booking")}
            >
              Update Booking
            </Button>
          )} */}
        </div>
        <ImportExport
          isBooking={true}
          exportOnly
          exportAPI={exportBookingsAPI}
        />
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
        scroll={{
          x: 2500,
          // y: 300,
        }}
      />
    </DashboardWrapper>
  );
};
export default Customers;
