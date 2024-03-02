import * as Yup from "yup";

export const signupValidation = Yup.object({
  username: Yup.string().min(3).required("please enter name"),
  email: Yup.string()
    .email("please enter valid email")
    .required("Please Enter Email"),
  password: Yup.string()
    .min(5)
    .matches(
      /^(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{5,}$/,
      "Password must contain one special character"
    )
    .required("Please Enter Password"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Password not matched")
    .required("Please enter the Confirmpassword"),
  phone: Yup.string()
    .matches(/^\+(?:[0-9]●?){6,14}[0-9]$/, "Invalid phone number format")
    .required("Please enter a phone number"),
});
