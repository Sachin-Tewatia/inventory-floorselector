import "antd/dist/antd.css";
import {
  Button,
  Form,
  Input,
  Popconfirm,
  Table,
  Modal,
  Alert,
  message,
  Checkbox,
} from "antd";
import React, { useContext, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { useInventories } from "../Hooks";
import { Select } from "antd";
import { TOWERS, TOWERS_LIST, UNIT_STATUS, UNIT_STATUS_LIST } from "../Data";
import { formatTimeStr } from "antd/lib/statistic/utils";
import Login from "./Login";
import BookingForm from "../Components/Molecules/BookingForm";
import { useBookings } from "../Hooks/booking";
import { useNavigate } from "react-router-dom";
import Loading from "../Components/Atoms/Loading";
const { Option } = Select;

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

// list of unit status for which user details are to be fetched
const USER_DETAILS_FOR_UNIT_STATUS = [UNIT_STATUS.BOOKED, UNIT_STATUS.BLOCKED];

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
      inputRef.current.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({
      [dataIndex]: record[dataIndex],
    });
  };

  const save = async () => {
    try {
      const values = await form.validateFields();
      toggleEdit();
      handleSave({ ...record, ...values });
    } catch (errInfo) {
      console.log("Save failed:", errInfo);
    }
  };

  let childNode = children;

  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{
          margin: 0,
        }}
        name={dataIndex}
        rules={[
          {
            required: true,
            message: `${title} is required.`,
          },
        ]}
      >
        <Input ref={inputRef} onPressEnter={save} onBlur={save} />
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{
          paddingRight: 24,
        }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};

const Search = ({ onSearch }) => {
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
          placeholder="Flat Id"
          onChange={(e) => onSearch(e.target.value)}
        />
      </Form.Item>
    </Form>
  );
};

const SelectBulkStatus = ({ onChange }) => (
  <Select
    style={{ width: "200px", marginLeft: "1rem" }}
    onChange={onChange}
    placeholder={"Change Status in Bulk"}
  >
    {UNIT_STATUS_LIST.map((status) => (
      <Option value={UNIT_STATUS[status]}>{UNIT_STATUS[status]}</Option>
    ))}
  </Select>
);

const Inventories = () => {
  const { inventoriesList, updateInventory, fetchInventories } =
    useInventories();
  const [dataSource, setDataSource] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [justEditedField, setJustEditedField] = useState(false);
  const { saveBookingToDB, saveUserToDB, changeStatusInBulk } = useBookings();
  const [loading, setLoading] = useState(false);
  const [selectedRowIds, setSelectedRowIds] = useState([]);
  const [bulkUpdateConfirmation, setBulkUpdateConfirmation] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchInventories(setLoading);
  }, []);

  useEffect(() => {
    if (dataSource.length > 0) setTableData(dataSource);
  }, [dataSource]);

  useEffect(() => {
    if (inventoriesList.length > 0) {
      setDataSource(
        inventoriesList.map((inventory) => ({
          ...inventory,
          key: inventory.id,
          id: inventory.id,
        }))
      );
    }
  }, [inventoriesList]);

  const saveFlatBookingDetails = async (values) => {
    setLoading(true);

    const flatId = justEditedField.row.id;
    const transactionId = "-";
    const { firstName, lastName, email, mobile, amount, mode } = values;

    // store user

    const userDetails = {
      firstName,
      lastName,
      email,
      mobile,
      flatId,
    };

    // save user details
    const userId = await saveUserToDB(userDetails);

    const bookingDetails = {
      amount,
      mode,
      flatId,
      transactionId,
      userId,
    };

    // save booking details
    await saveBookingToDB(bookingDetails);

    // update table
    handleSave();
    setLoading(false);
  };

  const handleSave = () => {
    const { row } = justEditedField;
    const newData = [...tableData];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, { ...item, ...row });
    setTableData(newData);
    setJustEditedField(null);
    const property = justEditedField.editedField;
    updateInventory(row.id, property, row[property]);
    message.success("Flat Details Updated Successfully");
  };

  const handleSearch = (flatId) => {
    if (flatId == "") {
      setTableData(dataSource);
      return;
    }

    setTableData(
      dataSource.filter((flat) =>
        flat.id.toUpperCase().includes(flatId.toUpperCase())
      )
    );
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

  // show model when field is edited
  const handleFieldEdit = (field) => {
    const row = field;
    const newData = [...tableData];
    const index = newData.findIndex((item) => row.key === item.key);
    const old_row = newData[index];
    const changedColumn = getChangedColumn(old_row, row);

    // (changedColumn);

    // confirm if user wants to save changes
    if (changedColumn)
      setJustEditedField({
        editedField: changedColumn,
        row: row,
        oldRow: old_row,
      });
    return;
  };

  const handleStatusChangeInBulk = () => {
    const status = bulkUpdateConfirmation;
    changeStatusInBulk(selectedRowIds, status);
    message.success("Inventories updated in bulk");
    fetchInventories(setLoading);
    setBulkUpdateConfirmation(null);
    setSelectedRowIds([]);
  };

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedRowIds(selectedRows.map((row) => row.id));
    },
    getCheckboxProps: (record) => ({
      disabled: [UNIT_STATUS.BOOKED].includes(record.Status),
      // Column configuration not to be checked
      name: record.name,
    }),
  };

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };

  const defaultColumns = [
    {
      title: formalTitles.FlatId,
      dataIndex: "id",
      width: "10%",
    },
    {
      title: formalTitles.TowerName,
      dataIndex: "TowerName",
      filters: TOWERS_LIST.map((tower) => ({
        text: tower.toUpperCase(),
        value: tower.toUpperCase(),
      })),
      onFilter: (value, record) => record.TowerName == value,
      width: "10%",
    },
    {
      title: formalTitles.FlatNumber,
      dataIndex: "FlatNumber",
      sorter: (a, b) => a.FlatNumber - b.FlatNumber,
    },
    {
      title: formalTitles.FloorNumber,
      dataIndex: "FloorNumber",
      sorter: (a, b) => a.FloorNumber - b.FloorNumber,
    },
    {
      title: formalTitles.SBU,
      dataIndex: "SBU",
    },

    {
      title: formalTitles.Status,
      dataIndex: "Status",
      width: "200px",
      filters: UNIT_STATUS_LIST.map((status) => ({
        text: UNIT_STATUS[status],
        value: UNIT_STATUS[status],
      })),
      onFilter: (value, record) => record.Status == value,
      render: (_, record) => (
        <Select
          style={{ width: "100%" }}
          defaultValue={record.Status}
          onChange={(value) =>
            setJustEditedField({
              row: { ...record, Status: value },
              oldRow: record,
              editedField: "Status",
            })
          }
          value={record.Status}
        >
          {UNIT_STATUS_LIST.map((status) => (
            <Option value={UNIT_STATUS[status]}>{UNIT_STATUS[status]}</Option>
          ))}
        </Select>
      ),
    },
    {
      title: formalTitles.TotalCost,
      dataIndex: "TotalCost",
      editable: true,
      width: "200px",
    },

    {
      title: formalTitles.UnitType,
      dataIndex: "UnitType",
    },
  ];

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
    <Style>
      <div className="title">Manage Inventories</div>

      <div className="row center">
        <Search onSearch={handleSearch} />
        <Button
          loading={loading}
          onClick={() => fetchInventories(setLoading)}
          style={{ margin: "0" }}
        >
          Refresh
        </Button>
        {selectedRowIds.length > 0 && (
          <SelectBulkStatus
            onChange={(status) => setBulkUpdateConfirmation(status)}
          />
        )}
      </div>
      <Table
        rowSelection={{
          type: "checkbox",
          ...rowSelection,
          selectedRowKeys: selectedRowIds,
        }}
        components={components}
        rowClassName={() => "editable-row"}
        bordered
        dataSource={tableData}
        columns={columns}
      />

      {/* if any field is changes show model */}
      {justEditedField &&
        // if the status is changed, show payment form
        (justEditedField?.editedField === "Status" &&
        // taking user details for some unit status
        USER_DETAILS_FOR_UNIT_STATUS.includes(justEditedField?.row?.Status) ? (
          <Modal
            title={
              <div className="booking-modal-title">
                BOOKING DETAILS FOR FLATID
                <span style={{ marginLeft: "0.5rem", color: "Highlight" }}>
                  {justEditedField.row.id}
                </span>
              </div>
            }
            visible={justEditedField}
            // onOk={() => setShowBookingFormModal(false)}
            cancelText="Cancel"
            okText="Book"
            onCancel={() => setJustEditedField(null)}
            footer={false}
          >
            <BookingForm onSubmit={saveFlatBookingDetails} />
          </Modal>
        ) : (
          // confirmation model for any other field is changed
          <Modal
            title={`Are you sure to update Flat with Id ${justEditedField.row.id} ?`}
            visible={justEditedField}
            onOk={handleSave}
            onCancel={() => setJustEditedField(null)}
          >
            <p>{`You are updating ${
              formalTitles[justEditedField.editedField]
            } from ${justEditedField.oldRow[justEditedField.editedField]} to ${
              justEditedField.row[justEditedField.editedField]
            }`}</p>
          </Modal>
        ))}
      {bulkUpdateConfirmation && ( // confirmation model for any other field is changed
        <Modal
          title={`Are you sure to Update Flats in Bulk?`}
          visible={bulkUpdateConfirmation}
          onOk={handleStatusChangeInBulk}
          onCancel={() => setBulkUpdateConfirmation(null)}
        >
          <p>
            You are changing
            <b style={{ color: "Highlight" }}> All Flats </b>
            status to{" "}
            <b style={{ color: "Highlight" }}>{bulkUpdateConfirmation}</b>
          </p>
          <p style={{ marginTop: "1rem" }}>
            Flats with following Ids will be affected :{" "}
          </p>
          <p style={{ color: "Highlight" }}>{selectedRowIds.join(", ")}</p>
        </Modal>
      )}
      <Button
        type="link"
        style={{ float: "left" }}
        onClick={() => navigate("/dashboard/bookings")}
      >
        Manage Bookings
      </Button>

      <Button
        type="link"
        style={{ float: "left" }}
        onClick={() => navigate("/dashboard/users")}
      >
        Manage Users
      </Button>
    </Style>
  );
};

export default Inventories;

const Style = styled.div`
  .row {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
  }

  .center {
    align-items: center;
  }
  /* font-family: "Roboto", sans-serif; */
  /* font-family: "lato" !important; */
  color: var(--input_label_text_color);
  font-weight: normal;
  padding: 1rem;
  .title {
    font-size: 1.3rem;
    font-weight: 400;
    margin-bottom: 1rem;
    text-align: center;
  }
`;

const formalTitles = {
  FlatId: "Flat Id",
  TowerName: "Tower Name",
  FlatNumber: "Flat Number",
  FloorNumber: "Floor Number",
  SBU: "SBU",
  Status: "Status",
  TotalCost: "Total Cost",
  UnitType: "Unit Type",
};
