"use client";
import { Section, Story } from "~/components";
import {
  Button,
  LinkText,
  ToastMessage,
  toast,
} from "@valence-ui/ui-components";

const Messages = () => {
  return (
    <Section id="info text">
      {/* <Toaster /> defined in layout root */}
      <Story>
        <Button
          onClick={() => {
            toast.info(
              <ToastMessage variant="info" title="Here is some info">
                Transaction hash:{" "}
                <LinkText href="">
                  30E0AE91F993A1883256B6ECA323F5F71B94155CC1724AB0F2CF9D410AD5D09A
                </LinkText>
              </ToastMessage>
            );
          }}
        >
          info
        </Button>
      </Story>
      <Story>
        <Button
          onClick={() => {
            toast.error(
              <ToastMessage
                variant="error"
                title="Error processing transaction"
              >
                Transaction hash:{" "}
                <LinkText href="">
                  30E0AE91F993A1883256B6ECA323F5F71B94155CC1724AB0F2CF9D410AD5D09A
                </LinkText>
              </ToastMessage>
            );
          }}
        >
          error
        </Button>
      </Story>
      <Story>
        <Button
          onClick={() => {
            toast.success(
              <ToastMessage variant="success" title="Transaction Succeeded">
                Transaction hash:{" "}
                <LinkText href="">
                  30E0AE91F993A1883256B6ECA323F5F71B94155CC1724AB0F2CF9D410AD5D09A
                </LinkText>
              </ToastMessage>
            );
          }}
        >
          success
        </Button>
      </Story>
    </Section>
  );
};

export default Messages;
