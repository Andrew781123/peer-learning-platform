import { passwordCheckHandler } from "next-password-protect";

export default passwordCheckHandler("andrewMakeApp", {
  // Options go here (optional)
  cookieName: "next-password-protect",
});
