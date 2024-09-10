function OnClickPopup({ word, x, y, onClose, translatedWord }) {
  return (
    <div
      className="word-translation-popup"
      style={{
        position: "fixed",
        left: `${x}px`,
        top: `${y}px`,
        background: "white",
        border: "1px solid black",
        borderRadius: "5px",
        padding: "10px",
        zIndex: 1000,
      }}
    >
      This is on click popup
    </div>
  );
}

export default OnClickPopup;
