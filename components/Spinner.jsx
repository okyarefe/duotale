import { CircleLoader } from "react-spinners";

const Spinner = ({ size = 50, color = "#36D7B7" }) => {
  return <CircleLoader size={size} color={color} />;
};

export default Spinner;
