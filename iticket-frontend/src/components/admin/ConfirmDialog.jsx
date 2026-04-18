import React from "react";
import "./ConfirmDialog.css";
import { AdminButton } from "./AdminButton";

export const ConfirmDialog = ({
  isOpen,
  title = "Confirm Action",
  message = "Are you sure?",
  confirmText = "Delete",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  isDangerous = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="confirm-dialog-overlay">
      <div className="confirm-dialog">
        <div className="confirm-dialog-header">
          <h3>{title}</h3>
          <button className="close-btn" onClick={onCancel}>
            ✕
          </button>
        </div>

        <p className="confirm-dialog-message">{message}</p>

        <div className="confirm-dialog-actions">
          <AdminButton variant="cancel" onClick={onCancel}>
            {cancelText}
          </AdminButton>
          <AdminButton
            variant={isDangerous ? "danger" : "primary"}
            onClick={onConfirm}
          >
            {confirmText}
          </AdminButton>
        </div>
      </div>
    </div>
  );
};
