import React, { useState, useEffect, useRef } from "react";
import Modal from "react-modal";
import styled from "styled-components";
import { useRoomId } from "../../Hooks/useRoomId";
import { emitSync, SYNC_EVENTS, getReceivingSync, setReceivingSync } from "../../services/socketSync";
import { useDisclaimerModalSync } from "../../Hooks/useDisclaimerModalSync";

const Disclaimer = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { roomId } = useRoomId();
  const isModalOpenRef = useRef(isModalOpen);
  
  // Keep ref updated
  useEffect(() => {
    isModalOpenRef.current = isModalOpen;
  }, [isModalOpen]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 860);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const showModal = () => {
    setIsModalOpen(true);
    
    // Sync modal open state if not receiving sync
    if (!getReceivingSync() && roomId) {
      emitSync(SYNC_EVENTS.DISCLAIMER_MODAL, {
        isOpen: true
      }, roomId);
    }
  };
  
  const handleOk = () => {
    setIsModalOpen(false);
    
    // Sync modal close state if not receiving sync
    if (!getReceivingSync() && roomId) {
      emitSync(SYNC_EVENTS.DISCLAIMER_MODAL, {
        isOpen: false
      }, roomId);
    }
  };
  
  const handleCancel = () => {
    setIsModalOpen(false);
    
    // Sync modal close state if not receiving sync
    if (!getReceivingSync() && roomId) {
      emitSync(SYNC_EVENTS.DISCLAIMER_MODAL, {
        isOpen: false
      }, roomId);
    }
  };

  // Listen for disclaimer modal sync events via SyncContext (sockets as single source of truth)
  useDisclaimerModalSync((isOpen) => {
    const currentIsOpen = isModalOpenRef.current;
    
    if (isOpen !== undefined && isOpen !== currentIsOpen) {
      console.log('📋 [Disclaimer] Syncing modal state:', {
        from: currentIsOpen,
        to: isOpen
      });
      setReceivingSync(true);
      setIsModalOpen(isOpen);
      requestAnimationFrame(() => {
        setReceivingSync(false);
      });
    }
  });

  const customStyles = {
    overlay: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(32, 32, 32, 0.75)",
      zIndex: 100,
      cursor: "pointer",
    },

    content: isMobile
      ? {
          left: "50%",
          top: "50%",
          right: "auto",
          bottom: "auto",
          transform: "translate(-50%, -50%)",
          zIndex: 101,
          position: "absolute",
          background: "var(--background_panel)",
          color: "rgba(255,255,255,0.9)",
          width: "90%",
          maxWidth: "400px",
          height: "fit-content",
          maxHeight: "85vh",
          overflow: "auto",
          border: "1px solid #ffffff71",
          borderRadius: "8px",
          padding: "1rem",
        }
      : {
      left: "50%",
      right: "0",
      bottom: "0",
      top: "50%",
      zIndex: 101,
      position: "absolute",
      background: "var(--background_panel)",
      color: "rgba(255,255,255,0.9)",
      height: "fit-content",
      border: "1px solid #ffffff71",
      borderRadius: "10px",
    },
  };

  return (
    <Style className="overlay-can-fade-out">
      <i className="icon" onClick={showModal}>
        i
      </i>
      <Modal
        isOpen={isModalOpen}
        contentLabel="Example Modal"
        style={customStyles}
        shouldCloseOnOverlayClick
        onRequestClose={handleCancel}
      >
        <ModalContent>
          <div className="header">Disclaimer</div>
          <div className="text">
            <p>
              All images, views, features, finishes, furnishings, and visuals
              shown are indicative and for illustrative purposes only. They do
              not represent actual deliverables and are subject to change
              without prior notice. The information presented does not
              constitute a legal offer, commitment, representation, or warranty
              from the developer/owner. The development is proposed to be
              constructed in multiple phases, and certain amenities and features
              may be delivered in future phases, subject to necessary approvals
              and timelines. For definitive information on the specifications,
              inclusions, and project deliverables, please refer to the Standard
              Agreement for sale available on the West Bengal RERA website
              (rera.wb.gov.in). We encourage all viewers to seek written
              clarification from Salarpuria Imagine Builders LLP prior to
              entering into any agreement.
            </p>
            {/* <p>
              The RERA official website is{" "}
              <a href="https://haryanarera.gov.in/">
                https://haryanarera.gov.in/
              </a>{" "}
              .
            </p>
            <p>
              Project RERA Registration No.
              <i> RC/REP/HARERA/GGM/645/377/2022/120</i> dated 13.12.2022.,
              License no. 106 of 2022-dated 05.08.2022
            </p> */}
          </div>
        </ModalContent>
      </Modal>
    </Style>
  );
};

const Style = styled.div`
  font-family: Roboto, sans-serif;
  .icon {
    position: absolute;
    right: 1rem;
    bottom: 1rem;
    color: white;
    font-size: 1.4rem;
    box-shadow: 0 0 1px #e4e4e453;
    background: var(--background_panel);
    opacity: 0.8;
    transition: all 100ms ease-in-out;
    border: none;
    border-radius: 50%;
    height: 35px;
    width: 35px;
    display: grid;
    place-items: center;
    border: 1px solid white;
    ${"" /* font-style: italic; */}
    z-index: 100;
    cursor: pointer;
    :hover {
      opacity: 0.9;
    }
  }

  /* Mobile responsive styles */
  @media screen and (max-width: 860px) {
    .icon {
      right: 0.8rem;
      bottom: 0.8rem;
      font-size: 1rem;
      height: 28px;
      width: 28px;
    }
  }

  /* Medium screen responsive styles (860px - 1080px) */
  @media screen and (min-width: 861px) and (max-width: 1080px) {
    .icon {
      right: 1.2rem;
      bottom: 1.2rem;
      font-size: 1.2rem;
      height: 34px;
      width: 34px;
    }
  }
`;

const ModalContent = styled.div`
  .header {
    font-size: 1.2rem;
    font-weight: 600;
    margin-bottom: 1rem;
    text-align: center;
  }

  .text {
    font-size: 0.9rem;
    line-height: 1.6;
    p {
      margin-bottom: 1rem;
    }
  }

  /* Mobile responsive styles */
  @media screen and (max-width: 860px) {
    .header {
      font-size: 1rem;
      margin-bottom: 0.8rem;
    }

    .text {
      font-size: 0.75rem;
      line-height: 1.5;
      p {
        margin-bottom: 0.8rem;
      }
    }
  }

  /* Medium screen responsive styles (860px - 1080px) */
  @media screen and (min-width: 861px) and (max-width: 1080px) {
    .header {
      font-size: 1.1rem;
      margin-bottom: 0.9rem;
    }

    .text {
      font-size: 0.85rem;
      line-height: 1.55;
      p {
        margin-bottom: 0.9rem;
      }
    }
  }
`;

export default Disclaimer;
