import {
  Button,
  Space,
  Table,
  Form,
  Input,
  Select,
  Modal,
  message,
} from "antd";
import axios from "axios";
import React, { useContext, useEffect, useRef, useState } from "react";
import {
  baseURL,
  updateInventoryAPI,
  UNIT_TYPE,
  getInventories,
  fetchAndGetInventories,
} from "../APIs";
import DashboardWrapper from ".";
import { useInventories } from "../Hooks";
import ImportExport from "./ImportExport";
import { AppContext } from "../Contexts/AppContext";
import { useNavigate } from "react-router-dom";
import BookNow from "../Components/Molecules/BookNow";

const EditableContext = React.createContext(null);

const EditableRow = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

const Search = ({ floor, setFloorValue, flat, setFlatValue, tower, setTowerValue, form }) => {
  return (
    <Form
      form={form}
      name="search"
      initialValues={{ Tower: "", Floor: "", FlatId: "" }}
      autoComplete="off"
      style={{
        display: "flex",
        alignItems: "center",
        padding: "0.5rem 0",
        width: "20%",
      }}
    >
      <Form.Item
        style={{ margin: "1rem 0.5rem", padding: "0" }}
        name="Tower"
      >
        <Input
          placeholder="Tower"
          value={tower}
          onChange={(e) => setTowerValue(e.target.value)}
        />
      </Form.Item>
      <Form.Item
        style={{ margin: "1rem 0.5rem", padding: "0" }}
        name="Floor"
      >
        <Input
          placeholder="Floor"
          value={floor}
          onChange={(e) => setFloorValue(e.target.value)}
        />
      </Form.Item>
      <Form.Item
        style={{ margin: "1rem 0.5rem", padding: "0" }}
        name="FlatId"
      >
        <Input
          placeholder="Flat"
          value={flat}
          onChange={(e) => setFlatValue(e.target.value)}
        />
      </Form.Item>
    </Form>
  );
};

const Inventories = () => {
  const { getShopById, fetchInventories } = useInventories();
  const { inventories, setInventories } = useContext(AppContext);
  const { Option } = Select;
  const [searchForm] = Form.useForm(); // Form instance for Search
  const [filteredInfo, setFilteredInfo] = useState({});
  const [sortedInfo, setSortedInfo] = useState({});
  const [data, setData] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [justEditedField, setJustEditedField] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [tableLoading, setTableLoading] = useState(false);
  const [unitIdForBooking, setUnitIdForBooking] = useState(null);
  const [flatValue, setFlatValue] = useState("");
  const [floorValue, setFloorValue] = useState("");
  const [towerValue, setTowerValue] = useState("");
  const navigate = useNavigate();
  const { user } = useContext(AppContext);

  const UNIT_STATUS = {
    AVAILABLE: "available",
    SOLD: "sold",
    HOLD: "hold",
  };
  const UNIT_STATUS_LIST = Object.keys(UNIT_STATUS);
  const USER_DETAILS_FOR_UNIT_STATUS = ["hold"];

  useEffect(() => {
    setData(inventories || []);
  }, [inventories]);

  const handleRefresh = async () => {
    setTableLoading(true);
    try {
      await fetchAndGetInventories(setInventories);
      setData(inventories || []);
      setTowerValue("");
      setFloorValue("");
      setFlatValue("");
      searchForm.resetFields(); // Reset form fields
    } catch (error) {
      console.error("Error refreshing inventories:", error);
      message.error("Failed to refresh inventories");
    } finally {
      setTableLoading(false);
    }
  };

  useEffect(() => {
    handleRefresh();
  }, []);

  const handleSearch = () => {
    if (!data || !data.length) {
      setTableData([]);
      return;
    }

    setTableLoading(true);
    const filteredData = data.filter((shop) => {
      if (!shop?.id) {
        console.warn("Invalid shop entry:", shop);
        return false;
      }

      const isFilterActive = flatValue || towerValue || floorValue;
      if (!isFilterActive) {
        return true;
      }

      const matchesFlat = !flatValue ||
        (shop.unit_number?.toString().toLowerCase().includes(flatValue.toLowerCase()));
      const matchesTower = !towerValue ||
        (shop.tower?.toString().toLowerCase().includes(towerValue.toLowerCase()));
      const matchesFloor = !floorValue ||
        (shop.floor?.toString() === floorValue.toString());

      return matchesFlat && matchesTower && matchesFloor;
    });

    setTableData(filteredData);
    setTableLoading(false);
  };

  useEffect(() => {
    handleSearch();
  }, [flatValue, towerValue, floorValue, data]);

  const HandleInventory = async (unit_id, details) => {
    setUpdating(true);
    const status = await updateInventoryAPI({ unit_id, ...details });
    if (status === 401) {
      localStorage.removeItem("token");
      navigate("/admin/login");
    } else if (status !== 200) {
      message.error("Failed to update inventory");
    }
    setUpdating(false);
  };

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

  const getChangedColumn = (old_row, row) => {
    return Object.keys(row).find((key) => old_row[key] !== row[key]);
  };

  const handleFieldEdit = (field) => {
    if (user.role !== "admin") {
      message.error("You are not authorized to edit this field");
      return;
    }
    const row = field;
    const newData = [...tableData];
    const index = newData.findIndex((item) => row.id === item.id);
    const old_row = newData[index];
    const changedColumn = getChangedColumn(old_row, row);

    if (changedColumn) {
      setJustEditedField({
        editedField: changedColumn,
        row: row,
        oldRow: old_row,
      });
    }
  };

  const handleFieldUpdate = async () => {
    if (user.role !== "admin") {
      message.error("You are not authorized to edit this field");
      return;
    }
    const { editedField, row } = justEditedField;
    const { id } = row;
    const details = { [editedField]: row[editedField] };

    await HandleInventory(id, details);

    const newData = [...data];
    const index = newData.findIndex((item) => row.id === item.id);
    const item = newData[index];
    newData.splice(index, 1, { ...item, ...row });

    setData(newData);
    setJustEditedField(null);
  };

  // Compute dynamic unitTypes based on filtered tableData
  const unitTypes = [...new Set(tableData?.map((item) => item.unit_type).filter(Boolean))];
  const towerNames = [...new Set(tableData?.map((item) => item.tower).filter(Boolean))];

  const defaultColumns = [
    {
      filteredValue: filteredInfo.tower || null,
      title: formalTitles.Tower,
      dataIndex: "tower",
      key: "tower",
      onFilter: (value, record) => record.tower?.includes(value),
      filters: towerNames.map((tower) => ({
        text: tower,
        value: tower,
      })),
    },
    {
      title: "Floor",
      dataIndex: "floor",
      key: "floor",
      editable: user.role === "admin",
      sorter: (a, b) => (a.floor || 0) - (b.floor || 0),
      sortOrder: sortedInfo.columnKey === "floor" ? sortedInfo.order : null,
      ellipsis: true,
    },
    {
      title: formalTitles.id,
      dataIndex: "id",
      key: "id",
      render: (_, text) => text.unit_number,
      fixed: "left",
    },
    {
      title: "Flat Id",
      dataIndex: "id",
      key: "id",
      render: (_, text) => text.id,
      fixed: "left",
    },
    
    {
      filteredValue: filteredInfo.unit_type || null,
      title: formalTitles.ShopType,
      dataIndex: "unit_type",
      key: "unit_type",
      filters: unitTypes.map((unit) => ({
        text: unit,
        value: unit,
      })),
      onFilter: (value, record) => record.unit_type === value,
    },
    {
      title: "Area",
      dataIndex: "area",
      key: "area",
      editable: user.role === "admin",
      sorter: (a, b) => (a.area || 0) - (b.area || 0),
      sortOrder: sortedInfo.columnKey === "area" ? sortedInfo.order : null,
      ellipsis: true,
    },
    {
      title: formalTitles.Status,
      dataIndex: "status",
      key: "status",
      filters: [
        { text: "Hold", value: "hold" },
        { text: "Sold", value: "sold" },
        { text: "Available", value: "available" },
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
          }}
          value={record.status}
          disabled={user.role !== "admin"}
        >
          {UNIT_STATUS_LIST.map((status) => (
            <Option key={status} value={UNIT_STATUS[status]}>
              {formalTitles[UNIT_STATUS[status]]}
            </Option>
          ))}
        </Select>
      ),
    },
    {
      title: formalTitles.remarks,
      dataIndex: "remarks",
      key: "remarks",
      editable: user.role === "admin",
      render: (_, record) => record.remarks?.length > 0 ? record.remarks : "No Remarks",
    },
  ];

  const EditableCell = ({
    title,
    editable,
    children,
    dataIndex,
    record,
    handleSave,
    ...restProps
  }) => {
    const [editing, setEditing] = useState(false);
    const inputRef = useRef(null);
    const form = useContext(EditableContext);

    useEffect(() => {
      if (editing) {
        inputRef.current?.focus();
      }
    }, [editing]);

    const toggleEdit = () => {
      if (user.role !== "admin") return;
      setEditing(!editing);
      form.setFieldsValue({ [dataIndex]: record[dataIndex] });
    };

    const save = async () => {
      try {
        const values = await form.validateFields();
        toggleEdit();
        handleSave({ ...record, ...values });
      } catch (errInfo) {
        console.error("Validation failed:", errInfo);
      }
    };

    let childNode = children;
    if (editable && user.role === "admin") {
      childNode = editing ? (
        <Form.Item style={{ margin: 0 }} name={dataIndex}>
          <Input ref={inputRef} onPressEnter={save} onBlur={save} />
        </Form.Item>
      ) : (
        <div
          className="editable-cell-value-wrap"
          style={{ paddingRight: 24, cursor: user.role === "admin" ? "pointer" : "default" }}
          onClick={toggleEdit}
        >
          {children}
        </div>
      );
    }
    return <td {...restProps}>{childNode}</td>;
  };

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };

  const columns = defaultColumns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave: (field) => handleFieldEdit(field),
      }),
    };
  });
  return (
    <DashboardWrapper>
      {justEditedField &&
        (justEditedField.editedField === "status" &&
        USER_DETAILS_FOR_UNIT_STATUS.includes(justEditedField.row.status) &&
        user?.role === "admin" ? (
          // <Modal
          //   title={false}
          //   open={!!justEditedField}
          //   cancelText={false}
          //   okText={false}
          //   onCancel={() => setJustEditedField(null)}
          //   footer={false}
          //   closeIcon={<></>}
          // >
          //  <BookNow
          //     isOpen
          //     unitDetails={getShopById(justEditedField.row.id)}
          //     setIsOpen={setJustEditedField}
          //     handleDetailsFilledSuccess={async () => {
          //       await HandleInventory(justEditedField.row.id, {
          //         status: justEditedField.row.status,
          //       });
          //       await handleRefresh();
          //     }}
          //     additionalDetails={{ check: true }}
          //   /> 
            <BookNow
              isOpen
              setIsOpen={setJustEditedField}
              unitDetails={getShopById(justEditedField.row.id)}
              onSubmitSuccess={handleRefresh}
            />
          // </Modal>
        ) : (
          <Modal
            title={`Are you sure to update ${UNIT_TYPE} with Id ${justEditedField.row.id}?`}
            open={!!justEditedField}
            onOk={handleFieldUpdate}
            okButtonProps={{ loading: updating, className: "btn-primary-ok" }}
            onCancel={() => setJustEditedField(null)}
          >
            <p>{`You are updating ${justEditedField.editedField} from ${
              justEditedField.oldRow[justEditedField.editedField]
            } to ${justEditedField.row[justEditedField.editedField]}`}</p>
          </Modal>
        ))}
      <div className="title1">Manage Inventories</div>
      <div className="row center">
        <Search
          floor={floorValue}
          setFloorValue={setFloorValue}
          tower={towerValue}
          setTowerValue={setTowerValue}
          flat={flatValue}
          setFlatValue={setFlatValue}
          form={searchForm}
        />
        <Button
          onClick={handleRefresh}
          loading={tableLoading}
          style={{
            margin: "1rem",
            color: "white",
            background: "#3f608fea",
          }}
        >
          Refresh
        </Button>
      </div>
      <div className="head">
        <div>
          {/* <Button
            onClick={clearFilters}
            type="primary"
            className="filterbutton buttonHover"
          >
            Clear Filters
          </Button> */}
          <Button
            onClick={clearAll}
            type="primary"
            className="filterbutton buttonHover"
          >
            Clear Filters and Sorters
          </Button>
        </div>
        <div className="datafield ml-[15%]">
          <div className="actualdata">Total: {data?.length || 0}</div>
          <div className="actualdata">
            Available: {data?.filter((item) => item.status === "available").length || 0}
          </div>
          <div className="actualdata">
            Sold: {data?.filter((item) => item.status === "sold").length || 0}
          </div>
        </div>
        <div>
          <Button
            type="link"
            className="buttonHover filterbutton"
            onClick={() => navigate("/dashboard/customers")}
          >
            Manage Bookings
          </Button>
        </div>
        {user?.role === "admin" && <ImportExport />}
      </div>
      <Table
        loading={tableLoading}
        style={{ width: "100%" }}
        components={components}
        rowClassName={() => "editable-row"}
        bordered
        columns={columns}
        dataSource={tableData}
        onChange={handleChange}
        pagination={{ defaultPageSize: 10 }}
        onRow={(record) => ({
          className: record.status,
        })}
      />
    </DashboardWrapper>
  );
};

export default Inventories;

const formalTitles = {
  id: `${UNIT_TYPE.charAt(0).toUpperCase() + UNIT_TYPE.slice(1)}`,
  ShopType: `${UNIT_TYPE.charAt(0).toUpperCase() + UNIT_TYPE.slice(1)} Type`,
  Tower: "Tower",
  Status: "Status",
  hold_by_management: "Hold By Management",
  TotalCost: "Total Cost",
  Area: "Super Area",
  hold: "Hold",
  available: "Available",
  sold: "Sold",
  leased_to: "Leased To",
  Carpet_area: "Carpet Area",
  PLC: "PLC",
  remarks: "Remarks",
  rm_name: "RM Name",
  cp_name: "CP Name",
  remarks2: "Remarks 2",
  customer_name: "Customer Name",
  booking_date: "Date",
  hold_management: "Hold By Management",
  tcv: "TCV",
  block: "Tower",
};