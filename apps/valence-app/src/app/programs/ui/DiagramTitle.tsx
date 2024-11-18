import Link from "next/link";
import { FaChevronRight } from "react-icons/fa";

export const DiagramTitle = ({ programId }: { programId: string }) => {
  return (
    <div className="text-xl font-bold flex flex-row gap-2 items-center">
      <Link href="/programs">
        {" "}
        <h1 className="hover:underline underline-offset-4"> Programs (beta)</h1>
      </Link>

      <FaChevronRight className="inline-block align-middle text-lg" />

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
