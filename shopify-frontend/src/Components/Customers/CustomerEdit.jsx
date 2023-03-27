import {
  Form,
  FormLayout,
  TextField,
  Page,
  Card,
  Button,
} from "@shopify/polaris";
import "../../Css/customer.css";
import { useFormik } from "formik";
import Customerschema from "../../validation/CustomerValidation";
import { useState } from "react";

const CustomerEdit = () => {
  const [isDisbaled, setisDisbaled] = useState(true);
  // initial fome value
  const intialValue = {
    first_name: "this is not changing",
    last_name: "",
    phone: "",
    email: "",
  };

  const formik = useFormik({
    initialValues: {
      first_name: "",
      last_name: "",
      phone: "",
      email: "",
    },
    validationSchema: Customerschema,
    onSubmit: async (values, action) => {
      console.log(values);
      action.resetForm();
    },
  });

  const { handleBlur, handleReset, handleSubmit, touched, errors, values } =
    formik;

  const handleChange = (value, id) =>
    formik.handleChange({ target: { id, value } });

  return (
      <Form onSubmit={handleSubmit}>
        <FormLayout>
          <TextField
            label="first Name"
            name="first_name"
            id="first_name"
            type="text"
            onChange={handleChange}
            onBlur={handleBlur}
            value={values["first_name"]}
            error={touched.first_name && errors.first_name}
            disabled={isDisbaled}
          />
          <TextField
            label="last Name"
            type="text"
            onChange={handleChange}
            onBlur={handleBlur}
            value={values["last_name"]}
            name="last_name"
            id="last_name"
            error={touched.last_name && errors.last_name}
            disabled={isDisbaled}
          />
          <TextField
            label="Email"
            type="text"
            onChange={handleChange}
            value={values["email"]}
            name="email"
            onBlur={handleBlur}
            id="email"
            error={touched.email && errors.email}
            disabled={isDisbaled}
          />
          <TextField
            label="Phone"
            type="text"
            onChange={handleChange}
            value={values["phone"]}
            name="phone"
            onBlur={handleBlur}
            id="phone"
            error={touched.phone && errors.phone}
            disabled={isDisbaled}
          />
          <div style={{ display: "flex", gap: "15px" }}>
            {isDisbaled ? (
              <Button primary onClick={() => setisDisbaled(false)}>Edit</Button>
            ) : (
              <Button>Save Changes</Button>
            )}
            <Button destructive>Delete</Button>
          </div>
        </FormLayout>
      </Form>
  );
};

export default CustomerEdit;
