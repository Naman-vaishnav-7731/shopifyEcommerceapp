import * as yup from "yup";

const Customerschema = yup.object().shape({
    first_name: yup.string().required("First name is reuired").matches(/^[a-zA-Z]+$/, 'Name should only contain alphabets'),
    last_name: yup.string().required("Last name is reuired").matches(/^[a-zA-Z]+$/, 'Name should only contain alphabets'),
    email: yup.string().email('Invalid email address').required("Email Adress is required").test(
        'is-gmail',
        'Only Gmail addresses are allowed',
        (value) => {
          return value.endsWith('@gmail.com');
        },
    ),
    phone: yup.string().required("Phone number is required"),
  });

  export default Customerschema;