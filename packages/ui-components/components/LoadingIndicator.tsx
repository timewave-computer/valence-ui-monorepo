import "./LoadingIndicator.css";

export const LoadingIndicator: React.FC<{
  variant?: "base" | "sm";
}> = ({ variant = "base" }) => {
  switch (variant) {
    case "sm":
      return <div className="loader-small"></div>;
    default:
      return <div className="loader"></div>;
  }
};
