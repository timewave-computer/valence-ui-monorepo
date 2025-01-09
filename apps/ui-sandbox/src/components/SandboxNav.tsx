"use client";
import { cn } from "@valence-ui/ui-components";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { GetStories } from "~/lib";

export const SandboxNav = ({ stories }: { stories: GetStories }) => {
  const pathname = usePathname();
  return (
    <nav className="p-2 ">
      <ul>
        <li>
          <NavItem href={`/`} label={`All`} isActive={pathname === `/`} />
        </li>

        {stories.map((story: GetStories[number]) => (
          <li key={story.prettyName}>
            <NavItem
              href={`/story/${story.prettyName}`}
              label={story.prettyName}
              isActive={pathname === `/story/${story.prettyName}`}
            />
          </li>
        ))}
      </ul>
    </nav>
  );
};

const NavItem = ({
  href,
  label,
  isActive,
}: {
  href: string;
  label: string;
  isActive: boolean;
}) => {
  return (
    <Link
      className={cn(
        "font-mono font-bold",
        isActive ? "text-valence-blue" : "text-gray-700"
      )}
      href={href}
    >
      {label}
    </Link>
  );
};
