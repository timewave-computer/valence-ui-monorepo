"use client";
import { LOCAL_DEV_DOC_URL } from "@valence-ui/socials";
import {
  Button,
  Sheet,
  Heading,
  SheetTrigger,
  SheetContent,
  LinkText,
  PrettyJson,
} from "@valence-ui/ui-components";
import { RpcConfigForm } from "./RpcConfigForm";

export const ProgramRpcSettings = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="secondary">RPC Settings</Button>
      </SheetTrigger>
      <SheetContent title="RPC Settings" className="w-1/2" side="right">
        <Heading level="h2">RPC Settings</Heading>
        <div>
          <p className="text-sm">
            The programs UI can connect to any public RPC endpoint.
          </p>
          <LinkText
            blankTarget={true}
            href={LOCAL_DEV_DOC_URL}
            className="text-sm"
            variant="highlighted"
          >
            Learn how to use this UI with local development.
          </LinkText>
        </div>

        <RpcConfigForm />
      </SheetContent>
    </Sheet>
  );
};
