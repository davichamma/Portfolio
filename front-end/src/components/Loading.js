import React from "react";
import styled from "styled-components";

const LoaderContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  background-color: #cecece;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
`;

const LoaderImage = styled.img`
  z-index: 999;
  width: 100px;
  background-color: transparent;
`;

function Loading() {
  return (
    <LoaderContainer>
      <LoaderImage src="/assets/loading.svg" alt="Loading" />
    </LoaderContainer>
  );
}

export default Loading;
