import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const StyledImage = styled.img`
  background: rgba(22, 65, 148, 1);
`;

const Home = () => {
  const navigate = useNavigate();
  return (
    <StyledImage
      src="/assets/portfolio.svg"
      alt="Portfolio"
      onClick={() => navigate("/homeapp")}
    />
  );
};

export default Home;
