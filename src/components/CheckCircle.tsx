import clsx from "clsx";
import { useRef, useState } from "react";
import { BsCheck2, BsPencilSquare } from "react-icons/bs";

export type CheckCircleProps = {
  /**
   * Whether or not the input is checked.
   */
  checked: boolean;
  /**
   * The callback for when the input value changes.
   */
  onChange: (value: boolean) => void;
};

export const CheckCircle = ({ checked, onChange }: CheckCircleProps) => {
  return (
    <button
      className="flex flex-row justify-center items-center rounded-full border border-slate-700 w-10 h-10 cursor-pointer outline-none"
      onClick={() => onChange(!checked)}
    >
      {checked && <BsCheck2 className="w-6 h-6" />}
    </button>
  );
};
