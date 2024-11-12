import { Form } from "react-bootstrap";

function TextField(props) {
  return (
    <Form.Group>
      <Form.Label>
        {props.label}
        {props.required ? <span style={{ color: "red" }}> *</span> : null}
      </Form.Label>
      <Form.Control style={{ borderColor: "#465FF180" }} {...props} />
      <Form.Control.Feedback type="invalid">
        {props.error}
      </Form.Control.Feedback>
    </Form.Group>
  );
}

export default TextField;
