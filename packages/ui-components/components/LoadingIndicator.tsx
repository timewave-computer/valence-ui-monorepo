import "./LoadingIndicator.css";

export const LoadingIndicator: React.FC<{
  size?: "base" | "sm";
}> = ({ size = "base" }) => {
  switch (size) {
    case "sm":
      return <div className="loader-small"></div>;
    default:
      return <div className="loader"></div>;
  }
};
