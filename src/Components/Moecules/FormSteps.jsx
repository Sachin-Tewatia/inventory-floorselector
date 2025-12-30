import React from "react";
import { Steps } from "antd";
import styled from "styled-components";

const FormSteps = ({ steps, current, onChange }) => (
  <Style>
    <Steps
      current={current}
      size="small"
      items={steps}
      direction="vertical"
      onChange={onChange}
    />
  </Style>
);

const Style = styled.div`
  border-radius: 5px;
  color: white;
  padding: 0.5rem;
  background: #36323224;

  .ant-steps-item-title,
  .ant-steps-icon {
    color: #dfdfdf !important;
  }
  .ant-steps-item-container {
    display: flex;
    flex-direction: column;
    align-items: center !important;
    gap: 0.3rem !important;
  }

  .ant-steps-item-tail {
    display: none !important;
  }

  .ant-steps-item {
    padding: 0.5rem !important;
    margin: 0.3rem 0 !important;
    border-radius: 5px;
    transition: all linear 200ms !important;
  }

  .ant-steps-item-icon {
    margin: 0 !important;
    margin-bottom: 0.25rem !important;
    flex-shrink: 0 !important;
  }

  .ant-steps-item-title {
    margin: 0 !important;
    padding: 0 !important;
    text-align: center !important;
    line-height: 1.2 !important;
  }

  .ant-steps-item-content {
    min-height: 0 !important;
    display: flex !important;
    flex-direction: column !important;
    align-items: center !important;
    gap: 0.25rem !important;
  }

  .ant-steps-item-active {
    background: var(--clr-dark) !important;
  }

  @media (max-width: 860px) {
    padding: 0.25rem !important;
    border-radius: 4px !important;
    width: fit-content !important;
    min-width: 65px !important;

    .ant-steps-item-container {
      flex-direction: column !important;
      align-items: center !important;
      gap: 0.2rem !important;
    }

    .ant-steps-item {
      padding: 0.3rem 0.4rem !important;
      margin: 0.15rem 0 !important;
      border-radius: 4px !important;
      width: 100% !important;
    }

    .ant-steps-item-icon {
      font-size: 11px !important;
      width: 16px !important;
      height: 16px !important;
      margin: 0 auto !important;
      margin-bottom: 0.15rem !important;
      flex-shrink: 0 !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
    }

    .ant-steps-item-title {
      font-size: 7px !important;
      padding: 0 !important;
      margin: 0 !important;
      margin-top: 0.1rem !important;
      line-height: 1.1 !important;
      text-align: center !important;
      white-space: nowrap !important;
      overflow: hidden !important;
      text-overflow: ellipsis !important;
      max-width: 100% !important;
      display: block !important;
    }

    .ant-steps-item-content {
      margin-top: 0 !important;
      display: flex !important;
      flex-direction: column !important;
      align-items: center !important;
      gap: 0.15rem !important;
      width: 100% !important;
    }
  }
`;

export default FormSteps;
