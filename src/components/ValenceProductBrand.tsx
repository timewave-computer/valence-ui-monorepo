import { ReactNode } from "react";

export const ValenceProductBrand: React.FC<{
  img: ReactNode;
  children: ReactNode;
}> = ({ img, children }) => {
  return (
    <div className="flex flex-row  items-center gap-4 border-valence-black">
      {img}
      <div className="">{children}</div>
    </div>
  );
};
