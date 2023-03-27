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

const AddCustomer = () => {

   // initial fome value
   const intialValue = {
    first_name: "",
    last_name: "",
    phone: "",
    email: "",
  };

  const formik = useFormik({
    initialValues:{
      first_name: "",
      last_name: "",
      phone: "",
      email: "",
    } ,
    validationSchema:Customerschema,
    onSubmit: async (values , action) => {
      console.log(values);
      action.resetForm();
    },
  });

  const {
    handleBlur,
    handleReset,
    handleSubmit,
    touched,
    errors,
    values
  } = formik

  const handleChange = (value, id) =>
    formik.handleChange({ target: { id, value } });

  return (
    <Page
      breadcrumbs={[{ content: "Products", url: "/customer" }]}
      title="Add Customers"
      primaryAction={{
        content: "Save",
        disabled: false,
        onAction:handleSubmit
      }}
    >
      <Card sectioned>
        <Form onSubmit={handleSubmit}>
          <FormLayout>
            <TextField
              label="first Name"
              name="first_name"
              id="first_name"
              type="text"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values['first_name']}
              error={touched.first_name && errors.first_name}
            />
            <TextField
              label="last Name"
              type="text"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values['last_name']}
              name="last_name"
              id="last_name"
              error={touched.last_name && errors.last_name}
            />
            <TextField
              label="Email"
              type="text"
              onChange={handleChange}
              value={values['email']}
              name="email"
              onBlur={handleBlur}
              id="email"
              error={touched.email && errors.email}
            />
            <TextField
              label="Phone"
              type="text"
              onChange={handleChange}
              value={values['phone']}
              name="phone"
              onBlur={handleBlur}
              id="phone"
              error={touched.phone && errors.phone}
            />
          </FormLayout>
        </Form>
      </Card>
    </Page>
  );
};

export default AddCustomer;
