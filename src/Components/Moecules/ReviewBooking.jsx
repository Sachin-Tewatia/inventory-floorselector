import { Button, Descriptions, Image, message } from "antd";
import styled from "styled-components";
import { EditOutlined } from "@ant-design/icons";
import axios from "axios";
import { baseURL, fetchAndGetInventories, PROJECT_ID } from "../../APIs";
import { Navigate, useNavigate, useParams } from "react-router";
import React, { useState } from "react";

const ReviewBooking = ({
  bookingDetails,
  onBookingSuccess,
  onEdit,
  bookingIds,
}) => {
  const {
    firstName,
    lastName,
    email,
    phone,
    unit_id,
    area,
    partner_details,
    rm_name,
    ref_or_cheque,
    documents,
    cheque_amount,
    kyc,
  } = bookingDetails;

  const navigate = useNavigate();

  const [submitting, setSubmitting] = useState(false);

  const handleFormSubmit = async () => {
    setSubmitting(true);

    let res = null;

    if (bookingIds) {
      res = Promise.all(
        bookingIds.map(
          async (id) =>
            await axios.post(
              `${baseURL}/bookings/withCustomer/${PROJECT_ID}`,
              {
                ...bookingDetails,
                unit_id: id,
                project_id: PROJECT_ID,
              },
              {
                headers: {
                  authorization: localStorage.getItem("token"),
                },
              }
            )
        )
      );

      await fetchAndGetInventories();
      setSubmitting(false);
      message.success("Details submitted successfully");
      onBookingSuccess();
    } else {
      res = await axios.post(
        `${baseURL}/bookings/withCustomer/${PROJECT_ID}`,
        {
          ...bookingDetails,
          unit_id,
          project_id: PROJECT_ID,
        },
        {
          headers: {
            authorization: localStorage.getItem("token"),
          },
        }
      );

      await fetchAndGetInventories();
      setSubmitting(false);

      if (res.status == 201) {
        message.success("Details submitted successfully");
        navigate(`/booking-success/${res.data.id}`);
        onBookingSuccess();
      }
    }
  };

  return (
    <Style>
      <Descriptions title="Review Booking" size="default" column={2}>
        <Descriptions.Item label="First Name">{firstName}</Descriptions.Item>
        <Descriptions.Item label="Last Name">{lastName}</Descriptions.Item>
        <Descriptions.Item label="Email">{email}</Descriptions.Item>
        <Descriptions.Item label="Phone">{phone}</Descriptions.Item>
        {unit_id ? (
          <Descriptions.Item label="Unit Id">{unit_id}</Descriptions.Item>
        ) : (
          <Descriptions.Item label="Area Selected">
            {area} Sq. Ft.
          </Descriptions.Item>
        )}
        <Descriptions.Item label="Channel Partner">
          {partner_details}
        </Descriptions.Item>
        <Descriptions.Item label="RM (Saleperson)">{rm_name}</Descriptions.Item>
        <Descriptions.Item label="Ref or Cheque">
          {ref_or_cheque}
        </Descriptions.Item>
        <Descriptions.Item label="Cheque Amount">
          {cheque_amount}
        </Descriptions.Item>
        <Descriptions.Item label="Aadhar Number">
          {kyc?.aadhar_number1}
        </Descriptions.Item>
        <Descriptions.Item label="Pan Number">
          {kyc?.pan_number1}
        </Descriptions.Item>
        <Descriptions.Item label="Documents">
          {documents?.length > 0 ? (
            <div className="docs">
              {documents.map((doc) => (
                <Image
                  style={{ objectFit: "contain" }}
                  src={doc}
                  width={100}
                  height={100}
                />
              ))}
            </div>
          ) : (
            <span>No Documents Uploaded</span>
          )}
        </Descriptions.Item>
      </Descriptions>
      {/* <div className="footer">
        <Button icon={<EditOutlined />} onClick={onEdit}>
          Edit Booking
        </Button>
        <Button type="primary" onClick={handleFormSubmit} loading={submitting}>
          Confirm Booking
        </Button>
      </div> */}
    </Style>
  );
};

const Style = styled.div`
  padding: 2rem;
  height: 50vh;
  overflow-y: auto;
  .ant-descriptions-title {
    color: #c0c0c0;
    font-size: 1.5rem;
    margin-bottom: 2rem;
  }

  .ant-descriptions-item-label {
    color: #c0c0c0;
    font-size: 1rem;
  }
  .ant-descriptions-item-content {
    color: #b4b3b3;
    font-size: 1rem;
  }
  .docs {
    display: flex;
    gap: 1rem;
    border: 1px solid #bbbaba;
    border-radius: 4px;
  }

  .footer {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    margin-top: 2rem;
  }
`;
export default ReviewBooking;
