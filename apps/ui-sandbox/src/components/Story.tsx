import React from "react";
export const Story = ({
  children,
  label,
}: {
  label: string;
  children: React.ReactNode;
}) => {
  return (
    <div className="p-4 flex flex-col gap-2 w-fit">
      <h2 className="bg-valence-lightgray font-mono font-bold w-fit p-2">
        {label}
      </h2>
      {children}
    </div>
  );
};
