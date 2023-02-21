import { loginHandler } from "next-password-protect";

export default loginHandler("andrewMakeApp", {
  // Options go here (optional)
  cookieName: "next-password-protect",
});
