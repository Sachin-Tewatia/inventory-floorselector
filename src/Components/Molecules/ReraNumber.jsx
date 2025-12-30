import React from "react";
import styled from "styled-components";

const ReraNumber = () => {
  // return <></>;
  return (
    <Style className="fixed bottom-0 left-0 w-screen text-white z-10">
      <div className="rera-content">
        <span> RERA Number Phase I : </span> WBRERA/P/NOR/2025/000000
      </div>
    </Style>
  );
};

export default ReraNumber;

const Style = styled.div`
  .rera-content {
    background-color: #2f2f2fc5;
    display: inline-block;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    font-size: 0.875rem;
  }

  /* Mobile responsive styles */
  @media screen and (max-width: 860px) {
    .rera-content {
      padding: 0.35rem 0.6rem;
      font-size: 0.5rem;
      border-radius: 3px;
      // width: 25%;
    }
  }

  /* Medium screen responsive styles (860px - 1080px) */
  @media screen and (min-width: 861px) and (max-width: 1080px) {
    .rera-content {
      padding: 0.5rem 0.8rem;
      font-size: 0.75rem;
      border-radius: 4px;
    }
  }
`;
