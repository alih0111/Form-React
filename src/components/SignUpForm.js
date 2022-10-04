import { useFormik } from "formik";
import { useEffect, useState } from "react";
import * as Yup from "yup";
import axios from "axios";
import Input from "./common/Input";
import RadioInput from "./common/RadioInput";
import Select from "./common/Select";
import CheckBoxInput from "./common/CheckBoxInput";

const radioOptions = [
  { label: "Male", value: "0" },
  { label: "Female", value: "1" },
];
const selectOptions = [
  { label: "select nationality", value: "" },
  { label: "Iran", value: "IR" },
  { label: "Germany", value: "Ger" },
  { label: "USA", value: "US" },
];
const checkboxOptions = [
  { label: "React.js", value: "React.js" },
  { label: "Vue.js", value: "Vue.js" },
];

const initialValues = {
  name: "",
  email: "",
  phoneNumber: "",
  password: "",
  passwordConfirm: "",
  gender: "",
  nationality: "",
  intrests: [],
  terms: false,
};

const onSubmit = (values) => {
  axios.post("http://localhost:3001/users", values);
};

const validationSchema = Yup.object({
  name: Yup.string()
    .required("Name is required")
    .min(6, "Name length is not valid"),
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  phoneNumber: Yup.string()
    .required("Phone Number is required")
    .matches(/^[0-9]{11}$/, "Invalid Phone Number")
    .nullable(),
  password: Yup.string()
    .required("Password is required")
    .matches(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@!#$%?&])[A-Za-z\d@$!%*#?&]{8,}$/,
      "Must Contain 8 Charecters, One UpperCase, One Lowercase, One Number and One Special Case Character"
    ),
  passwordConfirm: Yup.string()
    .required("Password Confirmation is required")
    .oneOf([Yup.ref("password"), null], "Passwords must match"),
  nationality: Yup.string().required("Select Nationality"),
  intrests: Yup.array().min(1).required("at least select one"),
  terms: Yup.boolean()
    .required("the terma must be accepted")
    .oneOf([true], "the terms must be accepted"),
});

export default function SignUpForm() {
  const [formValues, setFormValues] = useState(null);

  const formik = useFormik({
    initialValues: formValues || initialValues,
    onSubmit,
    validationSchema,
    validateOnMount: true,
    enableReinitialize: true,
  });

  useEffect(() => {
    axios
      .get("http://localhost:3001/users/1")
      .then((res) => setFormValues(res.data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <div>
      <form onSubmit={formik.handleSubmit}>
        <Input name="name" formik={formik} label="Name" />
        <Input name="email" formik={formik} label="Email" />
        <Input name="phoneNumber" formik={formik} label="Phone Number" />
        <Input
          name="password"
          formik={formik}
          label="Password"
          type="password"
        />
        <Input
          name="passwordConfirm"
          formik={formik}
          label="Password Confrimation"
          type="password"
        />

        <RadioInput radioOptions={radioOptions} formik={formik} name="gender" />

        <Select
          selectOptions={selectOptions}
          name="nationality"
          formik={formik}
        />

        <CheckBoxInput
          checkboxOptions={checkboxOptions}
          formik={formik}
          name="intrests"
        />

        <input
          type="checkbox"
          id="terms"
          name="terms"
          value={true}
          onChange={formik.handleChange}
          checked={formik.values.terms}
        />
        <label htmlFor="terms">Terms and Condition</label>
        {formik.errors.terms && formik.touched.terms && (
          <div className="error">{formik.errors.terms}</div>
        )}

        <button type="submit" disabled={!formik.isValid}>
          Submit
        </button>
      </form>
    </div>
  );
}
