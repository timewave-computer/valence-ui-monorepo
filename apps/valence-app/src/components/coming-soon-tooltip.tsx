/***
 * Util class to display coming soon. Lots of redudant code, so this should make things easier to read
 */
"use client";
import { LinkText } from "@valence-ui/ui-components";
import { X_HANDLE, X_URL } from "@valence-ui/socials";

export const ComingSoonTooltipContent = () => (
  <div className=" max-w-56">
    <p className="text-xl font-bold">Coming soon.</p>
    <p className="text-balance pt-2">
      Contact{" "}
      <LinkText variant={"primary"} href={X_URL}>
        {X_HANDLE}
      </LinkText>{" "}
      to access this feature.
    </p>
  </div>
);
