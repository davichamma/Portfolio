import React from "react";
import { QRCodeCanvas } from "qrcode.react";
import styled from "styled-components";

const QRCodeContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
`;

const QRCodeComponent = ({ url, size = 256 }) => {
  return (
    <QRCodeContainer>
      <QRCodeCanvas
        value={url}
        size={size}
        fgColor="#000000"
        bgColor="#ffffff"
        level="H"
      />
    </QRCodeContainer>
  );
};

export default QRCodeComponent;
