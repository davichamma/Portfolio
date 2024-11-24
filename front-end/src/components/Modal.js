import React from "react";
import styled from "styled-components";
import Button from "./Button";
import { maskCurrency } from "../utils/masks";
import { CalendarIcon, MoneyIcon, CloseIcon } from "../icons/icons";

const HorizontalLine = styled.div`
  border-top: 2px solid #f2f2f2;
  margin: 20px;
  padding: 0 1rem;
`;

const StyledLabel = styled.label`
  font-size: 14px;
  font-weight: 700;
  padding: 0.5rem;
  color: rgba(32, 34, 68, 1);
`;

const StyledTotal = styled.div`
  display: flex;
  justify-content: space-around;
  margin-top: 1rem;
  font-size: 18px;
  font-weight: 700;
  color: rgba(32, 34, 68, 1);
`;

const InfoDiv = styled.div`
  display: flex;
  justify-content: space-between;
  border-radius: 16px;
  background-color: white;
  padding: 1rem;
  box-shadow: 0 3px 12px 0 rgba(0, 0, 0, 0.1);
  font-size: 14px;
  font-weight: 400;
  color: rgba(81, 81, 81, 1);
`;

const RootModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.5); /* Semi-transparent background */
  z-index: 1000;
`;

const ModalDialog = styled.div`
  max-width: 600px;
  width: 100%;
  border-radius: 16px;
`;

const ModalHeader = styled.div`
  position: relative; /* To allow absolute positioning for close button */
  background-color: white;
  border-radius: 16px 16px 0 0; /* Rounding only top corners */
  padding: 3rem 1.5rem 0.5rem 3rem;
  display: flex;
  justify-content: center; /* Center content like the title */

  & > span {
    font-size: 22px;
    font-weight: 700;
    max-width: 90%;
    color: rgba(32, 34, 68, 1);
    background-color: white;
  }
  & svg {
    position: absolute;
    top: 2rem;
    right: 2rem;
    background-color: white;
  }
`;

const ModalBody = styled.div`
  padding: 1rem;
  background-color: white;
  & * {
    background-color: white;
  }
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: center;
  padding: 1rem 1rem 1.5rem 1rem;
  border-top: none;

  & button {
    padding: 0.7rem 2rem;
  }
`;

const Modal = ({ toggleModal, produto }) => {
  return (
    <RootModal tabIndex="-1" role="dialog">
      <ModalDialog className="modal-dialog bg-white" role="document">
        <div
          className="modal-content bg-white"
          style={{ borderRadius: "16px" }}
        >
          <ModalHeader className="modal-header justify-content-between position-relative">
            <span>{produto.nomeProduto}</span>
            <CloseIcon onClick={toggleModal} />
          </ModalHeader>

          <ModalBody className="modal-body">
            <div className="d-flex justify-content-around">
              <div className="w-50 p-2 ms-3">
                <StyledLabel>Data Contrato</StyledLabel>
                <InfoDiv>
                  {produto.dataContrato}
                  <CalendarIcon />
                </InfoDiv>
              </div>
              <div className="w-50 p-2 me-3">
                <StyledLabel>Data término Contrato</StyledLabel>
                <InfoDiv>
                  {produto.dataExpiracaoContrato}
                  <CalendarIcon />
                </InfoDiv>
              </div>
            </div>
            <div className="d-flex justify-content-around mt-3">
              <div className="w-50 p-2 ms-3">
                <StyledLabel>Data Fatura</StyledLabel>
                <InfoDiv>
                  {produto.dataFatura}
                  <CalendarIcon />
                </InfoDiv>
              </div>
              <div className="w-50 p-2 me-3">
                <StyledLabel>Total contratado</StyledLabel>
                <InfoDiv>
                  {maskCurrency(produto.totalContrato)}
                  <MoneyIcon />
                </InfoDiv>
              </div>
            </div>
            <HorizontalLine />

            <StyledTotal>
              <div>Total Faturado</div>{" "}
              <div>{maskCurrency(produto.totalFaturado)}</div>
            </StyledTotal>
          </ModalBody>

          <ModalFooter className="modal-footer">
            <Button text="Fechar" onClick={toggleModal} />
          </ModalFooter>
        </div>
      </ModalDialog>
    </RootModal>
  );
};

export default Modal;
