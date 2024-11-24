import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import Button from "./Button";
import "bootstrap/dist/css/bootstrap.min.css";
import styled from "styled-components";

const StyledModal = styled(Modal)`
  .modal-dialog {
    max-width: 90vw;
    max-height: 70vh;
    margin: 0 auto;
    height: 100%;
  }

  .modal-content {
    height: 100%;
    border: none;
  }

  .modal-body {
    padding: 0;
    height: 100%;
    overflow: hidden; /* Prevents scrolling */
  }

  .modal-footer {
    background-color: #f5f9ff;
  }

  .embed-responsive {
    height: 100%;
  }
`;

const StyledImg = styled.img`
  background-color: transparent !important;
`;

const StyledButton = styled.button`
  position: absolute;
  right: 10px;
  top: -40px;
  height: 80px;
  border: none;
  background-color: transparent !important;
`;

const VideoModal = ({ url, productName }) => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <div>
      <StyledButton disabled={!url} onClick={handleShow}>
        <StyledImg src="/assets/playButton.svg" alt="Vídeo" />
      </StyledButton>

      <StyledModal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>{productName}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div
            className="embed-responsive embed-responsive-16by9"
            style={{ height: "100%" }}
          >
            <iframe
              className="embed-responsive-item"
              src={`${url}&autoplay=1`}
              title="YouTube video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{ width: "100%", height: "100%", border: "none" }}
            ></iframe>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button text={"Fechar"} onClick={handleClose} />
        </Modal.Footer>
      </StyledModal>
    </div>
  );
};

export default VideoModal;
