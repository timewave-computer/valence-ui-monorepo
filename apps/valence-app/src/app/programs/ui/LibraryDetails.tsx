"use client";
import {
  Copyable,
  Heading,
  InfoText,
  LinkText,
  PrettyJson,
  TabsContent,
  TabsList,
  TabsRoot,
  TabsTrigger,
} from "@valence-ui/ui-components";
import {
  displayLibraryContractName,
  useLibrarySchema,
} from "@/app/programs/ui";
import { CelatoneUrl } from "@/const";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { displayAddress } from "@/utils";

/**
 * This is itws own component because each subroutine should have its own useForm instantiatio
 */
export const LibraryDetails = ({
  libraryAddress,
  libraryChainId,
}: {
  libraryAddress: string;
  libraryChainId: string;
}) => {
  const { getLibrarySchema } = useLibrarySchema();

  const librarySchema = getLibrarySchema(libraryAddress);

  return (
    <div>
      <Heading level="h2">
        {displayLibraryContractName(librarySchema?.raw.contract_name)}
      </Heading>
      <Copyable copyText={libraryAddress}>
        <LinkText
          LinkComponent={"div"}
          className="font-mono text-xs"
          variant={"secondary"}
        >
          {libraryAddress}
        </LinkText>
      </Copyable>

      {librarySchema ? (
        <>
          <Heading level="h3" className="mt-6">
            Message Schema
          </Heading>

          <TabsRoot
            className=" mt-2"
            defaultValue={
              librarySchema?.typescript ? SchemaTabs.TypeScript : SchemaTabs.Raw
            }
          >
            <TabsList>
              <TabsTrigger value={SchemaTabs.TypeScript}>
                {SchemaTabs.TypeScript}
              </TabsTrigger>
              <TabsTrigger value={SchemaTabs.Raw}>{SchemaTabs.Raw}</TabsTrigger>
            </TabsList>
            <TabsContent className=" scrollbar" value={SchemaTabs.TypeScript}>
              {librarySchema.typescript ? (
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
                  {librarySchema.typescript}
                </SyntaxHighlighter>
              ) : (
                <InfoText variant="error">
                  {" "}
                  TypeScript schema not available for this library.
                </InfoText>
              )}
            </TabsContent>
            <TabsContent value={SchemaTabs.Raw}>
              <PrettyJson data={librarySchema.raw.execute} />
            </TabsContent>
          </TabsRoot>
        </>
      ) : (
        <InfoText variant="info">
          {" "}
          Schema not available for this library.
        </InfoText>
      )}
    </div>
  );
};

enum SchemaTabs {
  TypeScript = "TypeScript",
  Raw = "Raw",
}
