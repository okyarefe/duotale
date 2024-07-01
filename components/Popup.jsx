const PopupComponent = ({ x, y }) => {
  return (
    <div
      class="popup"
      style={{
        position: "fixed",
        left: `${x}px`,
        top: `${y}px`,
        background: "yellow",
        border: "1px solid black",
        padding: "10px",
        zIndex: 1000, // Ensure it's above other content
      }}
    >
      {/* Your popup content here */}
      <p>This is a popup window.</p>
    </div>
  );
};

export default PopupComponent;
