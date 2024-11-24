import React from "react";
import styled, { css } from "styled-components";

const Container = styled.div`
  display: flex;
  justify-content: center;
  position: fixed;
  width: 75%;
  left: 50%;
  transform: translateX(-50%);
  bottom: 20px;
  background-color: transparent;
`;

const ArrowButtonContainer = styled.div`
  position: relative;
  background-color: transparent;
  ${(props) =>
    props.width === "w-50" &&
    css`
      width: 50%;
    `}

  ${(props) =>
    props.width === "w-75" &&
    css`
      width: 75%;
    `}
  
  ${(props) =>
    props.width === "w-100" &&
    css`
      width: 100%;
    `}
`;

const ArrowButton = styled.button`
  height: 60px;
  background-color: #164194;
  color: white;
  border: none;
  border-radius: 30px;
  font-size: 18px;
  font-weight: 700;
  text-align: center;
  position: relative;
  width: 100%;
`;

const ArrowButtonImage = styled.img`
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  border-radius: 30px;
`;

const ButtonArrow = ({ width, text, onClick }) => {
  return (
    <Container onClick={onClick}>
      <ArrowButtonContainer width={width}>
        <ArrowButton>{text}</ArrowButton>
        <ArrowButtonImage src="/assets/calculateButton.svg" alt="Calcular" />
      </ArrowButtonContainer>
    </Container>
  );
};

export default ButtonArrow;
