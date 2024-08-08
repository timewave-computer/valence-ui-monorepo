import "./loader.css";

export const LoadingIndicator: React.FC<{
  variant?: "s" | "m";
}> = ({ variant = "m" }) => {
  if (variant === "s") {
    return <div className="loader-small"></div>;
  }
  return <div className="loader"></div>;
};
