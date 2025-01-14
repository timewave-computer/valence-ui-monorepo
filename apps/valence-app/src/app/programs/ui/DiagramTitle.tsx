import Link from "next/link";
import { FaChevronRight } from "react-icons/fa";

export const DiagramTitle = ({ programId }: { programId: string }) => {
  return (
    <div className="text-h5 font-semibold flex flex-row gap-2 items-center">
      <Link href="/programs">
        {" "}
        <h1 className="hover:underline underline-offset-4"> Programs (beta)</h1>
      </Link>

      <FaChevronRight className="inline-block align-middle text-h6" />

      <Link href={`/programs/${programId}`}>
        {" "}
        <h1 className="hover:underline underline-offset-4">
          {" "}
          Program {programId}
        </h1>
      </Link>
    </div>
  );
};
