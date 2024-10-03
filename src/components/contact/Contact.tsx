import React, { useState } from "react";
import { Form, Alert } from "react-bootstrap";
import Button from "../button/Button";

// Define the form state type
type FormState = {
  name: string;
  email: string;
  message: string;
  submit: string;
};

// Initial form state
const initialFormState: FormState = {
  name: "",
  email: "",
  message: "",
  submit: "",
};

export default function Contact() {
  const [formState, setFormState] = useState<FormState>(initialFormState);
  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [submitted, setSubmitted] = useState<boolean>(false);

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Validate the form
  const validateForm = (): boolean => {
    const { name, email, message } = formState;
    const newErrors: Partial<FormState> = {};

    if (!name) newErrors.name = "Name is required";
    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email is invalid";
    }
    if (!message) newErrors.message = "Message is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (validateForm()) {
      // Submit form data (this is where you would send the form data to a backend)
      console.info("Submitting form:", formState);

      try {
        const response = await fetch("/submit-contact-form", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            name: formState.name,
            email: formState.email,
            message: formState.message,
          }).toString(),
        });

        if (response.ok) {
          // Show success message and reset form
          setSubmitted(true);
          setFormState(initialFormState);
          setErrors({});
          console.info("Form submitted successfully");
        } else {
          throw "Failed to submit form.";
        }
      } catch (error) {
        const msg = `Error submitting form: ${error}`;
        console.error(msg);
        setErrors((errors) => ({ ...errors, submit: msg }));
      }
    }
  };

  return (
    <div className="p-3 text-white">
      <h1 className="text-center">Contact Me</h1>
      <Alert variant="info" className="border-0">
        While I'm currently employed, I'm always open to collaborating on fun
        projects and exploring new opportunities. Feel free to reach out using
        the form below. Let’s see what we can build together!
      </Alert>
      {submitted && (
        <Alert variant="success" className="border-0">
          Thank you for your message!
        </Alert>
      )}
      {!!errors.submit && (
        <Alert variant="danger" className="border-0">
          {errors.submit || "An error occurred when submitting form"}
        </Alert>
      )}
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formName">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter your name"
            name="name"
            value={formState.name}
            onChange={handleChange}
            isInvalid={!!errors.name}
            className="border-0"
          />
          <Form.Control.Feedback type="invalid">
            {errors.name}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="formEmail" className="mt-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter your email"
            name="email"
            value={formState.email}
            onChange={handleChange}
            isInvalid={!!errors.email}
            className="border-0"
          />
          <Form.Control.Feedback type="invalid">
            {errors.email}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="formMessage" className="mt-3">
          <Form.Label>Message</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="Enter your message"
            name="message"
            value={formState.message}
            onChange={handleChange}
            isInvalid={!!errors.message}
            className="border-0"
          />
          <Form.Control.Feedback type="invalid">
            {errors.message}
          </Form.Control.Feedback>
        </Form.Group>

        <div className="text-center">
          <Button type="submit" className="mt-4">
            Submit
          </Button>
        </div>
      </Form>
    </div>
  );
}
