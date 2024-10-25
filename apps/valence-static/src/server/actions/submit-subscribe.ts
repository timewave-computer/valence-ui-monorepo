"use server";
import { ERROR_MESSAGES, ErrorHandler } from "~/const/error";

const { SUBCRIBE_GOOGLE_FORM_ID } = process.env;
if (!SUBCRIBE_GOOGLE_FORM_ID) {
  throw new Error("SUBCRIBE_GOOGLE_FORM_ID is not set");
}
export const submitSubscribe = async (email: string) => {
  console.log("submitting email", email);
  const url = `https://docs.google.com/forms/d/e/${SUBCRIBE_GOOGLE_FORM_ID}/formResponse?&submit=Submit?usp=pp_url&entry.345754698=${email}`;
  const response = await fetch(url, {
    cache: "no-store",
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });
  if (!response.ok) {
    const msg = `${ERROR_MESSAGES.SUBMIT_EMAIL_FAIL}: ${response.status} ${response.statusText}`;
    throw ErrorHandler.makeError(msg);
  }
  return true;
};
