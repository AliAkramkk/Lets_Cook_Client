import * as Yup from "yup";

export const signinValidation = Yup.object({
  email: Yup.string()
    .email("Please enter a valid email")
    .required("Please enter your email"),
  password: Yup.string().required("Please enter your password"),
});
