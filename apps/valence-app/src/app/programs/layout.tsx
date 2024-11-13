import type { Metadata } from "next";
import { ABSOLUTE_URL, PROGRAMS_DESCRIPTION } from "@/const";
import { X_HANDLE } from "@valence-ui/socials";

export const metadata: Metadata = {
  title: "Programs",
  description: PROGRAMS_DESCRIPTION,
  openGraph: {
    siteName: "Valence",
    description: PROGRAMS_DESCRIPTION,
    url: `${ABSOLUTE_URL}/programs`,
    images: ["/img/opengraph/programs-og.png"],
  },
  twitter: {
    creator: X_HANDLE,
    card: "summary",
    images: ["/img/opengraph/programs-og.png"],
    description: PROGRAMS_DESCRIPTION,
  },
};

export default function ProgramsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
