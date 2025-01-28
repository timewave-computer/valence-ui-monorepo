"use client";
import { Heading, LinkText } from "@valence-ui/ui-components";
import {
  displayLibraryContractName,
  useLibrarySchema,
} from "@/app/programs/ui";
import { CelatoneUrl } from "@/const";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";

export interface SubroutineMessageFormValues {
  messages: string[];
}

/**
 * This is itws own component because each subroutine should have its own useForm instantiatio
 */
export const LibraryDetails = ({
  libraryAddress,
}: {
  libraryAddress: string;
}) => {
  const { getLibrarySchema } = useLibrarySchema();

  const librarySchema = getLibrarySchema(libraryAddress);

  return (
    <div>
      <Heading level="h2">
        {displayLibraryContractName(librarySchema?.raw.contract_name)}
      </Heading>
      <LinkText
        blankTarget={true}
        className="font-mono text-xs"
        variant={"secondary"}
        href={CelatoneUrl.contract(libraryAddress)}
      >
        {libraryAddress}
      </LinkText>

      <div className="pt-4">
        {librarySchema?.typescript && (
          <SyntaxHighlighter
            language="typescript"
            customStyle={{
              fontSize: "0.8rem",
              backgroundColor: "transparent",
              fontFamily: "var(--font-unica-mono)",
              padding: "0px",
              margin: "0px",
            }}
          >
            {librarySchema?.typescript}
          </SyntaxHighlighter>
        )}
      </div>
    </div>
  );
};
