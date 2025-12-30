import React from "react";
import { useState } from "react";
import styled from "styled-components";
import { fileUpload } from "../../APIs/upload.utils";
import { UploadOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { Image, message } from "antd";
import { useEffect } from "react";
import { useId } from "react";

function DocUploader({ title, onChange, value }) {
  const id = useId();

  const [docs, setDocs] = useState([]);

  const handleFileUpload = async (files) => {
    //validate file type

    for (const file of files)
      if (!["application/pdf", "image/png", "image/jpeg"].includes(file.type)) {
        message.error(`Invalid File Type : ${file.type}`);
        return;
      }

    for (const file of files) {
      file.id = `${Date.now()}${Math.random()}`;
      setDocs((prev) => [
        ...prev,
        {
          id: file.id,
          url: null,
          uploaded: false,
          isImg: file.type.includes("image"),
        },
      ]);
    }
    for (const file of files) {
      const url = await fileUpload(file, (e) => console.log(e));
      setDocs((prev) => [
        ...prev.map((doc) =>
          doc.id == file.id ? { ...doc, url, uploaded: true } : doc
        ),
      ]);
    }
  };

  const removeDoc = (id) =>
    setDocs((prev) => prev.filter((doc) => doc.id != id));

  useEffect(() => {
    onChange(docs.map((doc) => doc.url));
  }, [docs]);

  return (
    <Style>
      <div
        className={`input-group docs-uploader ${docs.length > 0 && "valid"}`}
      >
        <label class="input-group-label">
          <span className="title">{title}</span>{" "}
        </label>

        <input
          multiple
          type="file"
          id={`file-uploader-${id}`}
          style={{ display: "none" }}
          // regex="/[-!$%^&amp;*()_+|~=`{}\[\]:&quot;;'<>?,.\/0-9]/g"
          placeholder=""
          onChange={(e) => handleFileUpload(e.target.files)}
        />
        <br />
        <div className="docs">
          {docs.map((doc) => (
            <div className="doc-wrapper" key={doc.id}>
              <div className="close" onClick={() => removeDoc(doc.id)}>
                <CloseCircleOutlined
                  style={{
                    color: "rgba(175, 207, 255, 0.89)",
                    fontSize: "23px",
                  }}
                />
              </div>
              {doc.uploaded && (
                <div className="doc">
                  {/* <img  /> */}
                  {doc.isImg ? (
                    <Image width={70} height={70} src={doc.url} />
                  ) : (
                    <>No Preview</>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        <label id="file-uploader-btn" htmlFor={`file-uploader-${id}`}>
          <UploadOutlined
            style={{
              height: "30px",
              width: "100px",
            }}
          />
        </label>
      </div>
      {/* {cheque_pic && <img src={cheque_pic} />} */}

      {/* )} */}
    </Style>
  );
}

const Style = styled.div`
  #file-uploader-btn {
    background: #3333332d;
    padding: 5px;
    border-radius: 5px;
    cursor: pointer;
    color: white;
    font-weight: 600;
    margin-top: 10px;
    display: grid;
    place-items: center;
    width: fit-content;
    border: 1px solid #f3efefd8;
  }
  .docs-uploader {
    border: 1px solid #b4b3b383;
    border-radius: 5px;
    padding: 10px;
    &.valid {
      border-color: #0ad476dd !important;
    }
  }
  .docs {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    padding: 1rem;
    .doc-wrapper {
      border: 1px solid #2b2b2b83;
      width: 170px;
      height: 170px;
      border-radius: 5px;
      position: relative;
      .close {
        position: absolute;
        top: 0.2rem;
        right: 0.2rem;
        cursor: pointer;
      }
      .doc {
        width: 100%;
        height: 100%;
        display: grid;
        place-items: center;
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }
    }
  }
`;

export default DocUploader;
