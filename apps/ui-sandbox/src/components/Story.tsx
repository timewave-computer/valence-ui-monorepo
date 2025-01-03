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
      <h2 className="bg-valence-lightgray text-sm font-mono  font-semibold w-fit px-2 py-1">
        {label}
      </h2>
      {children}
    </div>
  );
};
