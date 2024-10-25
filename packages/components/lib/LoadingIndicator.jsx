import "./LoadingIndicator.css";
export const LoadingIndicator = ({ variant = "m" }) => {
  if (variant === "s") {
    return <div className="loader-small"></div>;
  }
  return <div className="loader"></div>;
};
