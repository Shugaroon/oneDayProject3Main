import React from "react";
import "../css/Modal.css";

const Modal = ({ isOpen, onClose, children, onImportantSet }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        {/* <button className="close-button" onClick={onClose}>
          X
        </button> */}
        {children}
      </div>
    </div>
  );
};

export default Modal;
