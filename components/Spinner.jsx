import { CircleLoader } from "react-spinners";

const Spinner = ({ size = 50, color = "#36D7B7" }) => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100%", // Make sure it takes up the full height of its container
        width: "100%", // Make sure it takes up the full width of its container
      }}
    >
      <CircleLoader size={size} color={color} />
    </div>
  );
};

export default Spinner;
