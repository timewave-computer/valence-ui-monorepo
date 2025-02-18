import { X_HANDLE, X_URL } from "@valence-ui/socials";
import { Heading, LinkText } from "@valence-ui/ui-components";

export const ComingSoonHoverContent = () => (
  <div>
    <Heading level="h3">Coming soon.</Heading>
    <div className="text-sm pt-2">
      Contact{" "}
      <LinkText variant="primary" blankTarget={true} href={X_URL}>
        {X_HANDLE}
      </LinkText>{" "}
      for early access.
    </div>
  </div>
);
