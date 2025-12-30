import React from "react";
import styled from "styled-components";
import { Button, Descriptions, Image, message } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import { useState } from "react";
import { useEffect } from "react";
// import { getPaymentDetails } from "../APIs";
// import Loading from "../Components/Atoms/Loading";
import { Link } from "react-router-dom";
import { async } from "q";

function DocumentsInfo({ documents }) {
  const [loading, setLoading] = useState(false);

  const { data } = documents;
  console.log("data: ", data);
  let aadhar = [];
  //adding aadhar cards
  if (data?.kyc?.adhaar1?.length > 0) {
    data?.kyc?.adhaar1.map((url) => {
      aadhar.push(url);
    });
  }
  if (data?.kyc?.adhaar2?.length > 0) {
    data?.kyc?.adhaar2.map((url) => {
      aadhar.push(url);
    });
  }
  if (data?.aadhar.length > 0) {
    data?.aadhar.map((url) => {
      aadhar.push(url);
    });
  }

  //adding pancards
  let pancard = [];
  if (data?.kyc?.pan1?.length > 0) {
    data?.kyc?.pan1.map((url) => {
      pancard.push(url);
    });
  }
  if (data?.kyc?.pan2?.length > 0) {
    data?.kyc?.pan2.map((url) => {
      pancard.push(url);
    });
  }
  if (data?.pancard.length > 0) {
    data?.pancard.map((url) => {
      pancard.push(url);
    });
  }

  //adding other documents
  const otherDocuments = [...data.documents, ...data.cheque_pic];

  const handleDocsDownload = async (urls) => {
    setLoading(true);

    function download(urls) {
      let url = urls.pop();

      let a = document.createElement("a");
      a.setAttribute("href", url);
      a.setAttribute("download", "");
      //   a.setAttribute("target", "_blank");
      a.click();

      if (urls.length == 0) {
        clearInterval(interval);
      }
    }

    let interval = setInterval(download, 300, urls);

    setLoading(false);
  };
  //   useEffect(() => {
  // if (!documents) return;
  // (async () => {
  //   const details = await getPaymentDetails(paymentId);
  //   setDocuments(details);
  // })();
  //   }, []);

  if (!documents) return <div>Loading..</div>;

  return (
    <Style>
      <Descriptions title="Documents Info" size="default" column={1}>
        <Descriptions.Item label="Aadhar Number">
          {data?.kyc?.aadhar_number1.length > 0
            ? data?.kyc?.aadhar_number1
            : "Not Uploaded"}
        </Descriptions.Item>
        <Descriptions.Item label="Aadhar Card">
          {aadhar?.length > 0
            ? aadhar?.map((url) => {
                return (
                  // <Link onClick={() => handleDocsDownload([url])}>
                  <Button
                    type="primary"
                    icon={<DownloadOutlined />}
                    shape="round"
                    loading={loading}
                    onClick={() => handleDocsDownload([url])}
                  >
                    Download
                  </Button>
                  // </Link>
                );
              })
            : "Not Uploaded"}
        </Descriptions.Item>
        <Descriptions.Item label="Pancard Number">
          {data?.kyc?.pan_number1.length > 0
            ? data?.kyc?.pan_number1
            : "Not Uploaded"}
        </Descriptions.Item>
        <Descriptions.Item label="Pancard">
          {pancard.length > 0
            ? pancard.map((url) => {
                return (
                  // <Link onClick={() => handleDocsDownload([url])}>
                  <Button
                    type="primary"
                    icon={<DownloadOutlined />}
                    shape="round"
                    loading={loading}
                    onClick={() => handleDocsDownload([url])}
                  >
                    Download
                  </Button>
                  // </Link>
                );
              })
            : "Not Uploaded"}
        </Descriptions.Item>
        <Descriptions.Item label="Cheque">
          {otherDocuments.length > 0
            ? otherDocuments.map((url) => {
                return (
                  // <Link onClick={() => handleDocsDownload([url])}>
                  <Button
                    type="primary"
                    icon={<DownloadOutlined />}
                    shape="round"
                    loading={loading}
                    onClick={() => handleDocsDownload([url])}
                  >
                    Download
                  </Button>
                  // </Link>
                );
              })
            : "Not Uploaded"}
        </Descriptions.Item>
      </Descriptions>
    </Style>
  );
}

const Style = styled.div``;

export default DocumentsInfo;
