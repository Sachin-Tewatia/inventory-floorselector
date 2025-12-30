import axios from "axios";
import { baseURL } from ".";

export const fetchPolicyAPI = async (filePath) => {
  const config = {
    method: "post",
    url: `${baseURL}/filemanager/upload-policy/`,
    headers: {
      "Content-Type": "application/json",
    },
    data: JSON.stringify({
      fileName: filePath,
    }),
  };
  return await axios(config);
};

export const getS3FormData = (policyData, file) => {
  const {
    key: policyKey,
    policy,
    "x-amz-algorithm": algorithm,
    "x-amz-credential": credential,
    "x-amz-date": date,
    "x-amz-signature": signature,
    bucket,
    contentId,
  } = policyData;
  const fd = new FormData();
  fd.append("key", policyKey);
  fd.append("Policy", policy);
  fd.append("X-Amz-Algorithm", algorithm);
  fd.append("X-Amz-Credential", credential);
  fd.append("X-Amz-Date", date);
  fd.append("X-Amz-Signature", signature);
  fd.append("x-amz-meta-contentid", contentId);
  // fd.append("x-amz-meta-tag", contentId);
  // fd.append("x-amz-meta-tag", "some value");
  // file field must be the last field in the form.
  fd.append("file", file);
  return { form: fd, bucket, policyKey };
};

export const uploadFileOnS3 = async (form, bucket, onUploadProgress) =>
  await axios({
    method: "post",
    url: `https://${bucket}.s3.amazonaws.com/`,
    data: form,
    headers: {
      "Content-Type": "multipart/form-data",
    },
    onUploadProgress: (e) => {
      const progress = Math.round((e.loaded * 100) / e.total);
      onUploadProgress(progress);
    },
  });

export const createNewContent = async (filePath, contentId) => {
  const config = {
    method: "post",
    url: `${baseURL}/filemanager/content`,
    headers: {
      "Content-Type": "application/json",
    },
    data: JSON.stringify({
      filePath,
      contentId,
    }),
  };

  return await axios(config);
};

export const getCDNUrl = async (content_id) => {
  const config = {
    method: "post",
    url: `${baseURL}/filemanager/content/getcdnurl`,
    headers: {
      "Content-Type": "application/json",
    },
    data: JSON.stringify({
      content_id,
    }),
  };
  return await axios(config);
};

export const fileUpload = async (file, onUploadProgress) => {
  try {
    const response = await fetchPolicyAPI(file.name);

    const policyData = response.data;

    const { form, bucket, policyKey } = getS3FormData(policyData, file);

    const s3Response = await uploadFileOnS3(form, bucket, onUploadProgress);

    if (s3Response.status === 204) {
      const contentCreateResponse = await createNewContent(
        policyKey,
        policyData.contentId
      );
      console.log("contentCreateResponse: ", contentCreateResponse);
      const { contentid } = contentCreateResponse.data;
      const CDNUrlResponse = await getCDNUrl(contentid);
      return CDNUrlResponse.data.url;
    }
    return false;
  } catch (error) {
    return false;
  }
};
