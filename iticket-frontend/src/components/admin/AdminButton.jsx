import React from "react";
import "./AdminButton.css";

export const AdminButton = ({
  children,
  variant = "primary",
  size = "md",
  fullWidth = false,
  disabled = false,
  loading = false,
  onClick,
  type = "button",
  className = "",
  ...props
}) => {
  const classes = [
    "admin-btn",
    `admin-btn-${variant}`,
    `admin-btn-${size}`,
    fullWidth && "admin-btn-full",
    disabled || loading ? "disabled" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      className={classes}
      onClick={onClick}
      type={type}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <>
          <span className="loading-spinner"></span>
          {children}
        </>
      ) : (
        children
      )}
    </button>
  );
};
