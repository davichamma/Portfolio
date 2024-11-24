import styled from "styled-components";

const StyledButton = styled.button`
  background-color: ${(props) => colorSchemaByType(props).bg};
  color: ${(props) => colorSchemaByType(props).color};
  font-size: 18px;
  border-radius: 10px;
  &:hover {
    background-color: ${(props) => colorSchemaByType(props).hover};
    color: ${(props) => colorSchemaByType(props).color};
  }
`;

const colorSchemaByType = (props) => {
  switch (props.kind) {
    case "danger":
      return {
        bg: "#ffd2cb",
        hover: "#ffd2cb",
        color: "#ff4a2d",
      };
    case "warning":
      return {
        bg: "#F5C69C",
        hover: "#F5C69C",
        color: "#cc6c18",
      };
    default:
      return {
        bg: "rgba(30, 69, 135, 1)",
        hover: "#0a2957",
        color: "#fff",
      };
  }
};

const Button = ({ onClick, text, css, kind, disabled }) => {
  const combinedClassName = `btn ${css}`;
  return (
    <StyledButton
      className={combinedClassName}
      onClick={onClick}
      kind={kind}
      disabled={disabled}
    >
      {text}
    </StyledButton>
  );
};

export default Button;
