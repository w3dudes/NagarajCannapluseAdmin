import LogoDark from "../assets/images/logos/logo.png";
// import { ReactComponent as LogoDark } from "../assets/images/logos/materialpro.svg";
import { Link } from "react-router-dom";

const Logo = () => {
  return (
    <Link to="/">
      <img src={LogoDark} width={160} height={60} alt="logo" />
    </Link>
  );
};

export default Logo;
