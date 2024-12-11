import { Col, Container, Row, Form, Button } from "react-bootstrap";
import Authcard from "../components/Authcard";
import TextField from "../components/TextField";
import Select from "../components/Select";
import * as yup from "yup";
import { Formik } from "formik";
import { useNavigate } from "react-router-dom";
import states from "../misc/states";
import languages from "../misc/languages";
import { uploadDocuments } from "../apis/commons";

const governmentIdMap = {
  "Aadhar Card": "aadhar",
  "Pan Card": "pan",
  "Driving License": "driving_license",
  "Voter's Id Card": "voter_id",
  "Passport": "passport",
  "Other": "other"
};

function Verification() {
    const navigate = useNavigate();

    const schema = yup.object({
        work_email: yup.string().required("This is a required field"),
        linkedin: yup.string().required("This is a required field"),
        change: yup.string().required("This is a required field"),
        govid: yup.string().required("This is a required field"),
        govid_image: yup.mixed().required("Please enter an image"),
        additional: yup.mixed().required("Please enter an image"),
        degree: yup.mixed().required("Please enter an image"),
    });

    return (
        <Container className="d-flex vh-100 p-0" fluid>
            <Col className="d-flex justify-content-center align-items-center">
                <Row>
                    <Formik
                        validationSchema={schema}
                        initialValues={{
                            govid: "",
                            work_email: "",
                            linkedin: "",
                            change: "",
                            govid_image: null,
                            additional: null,
                            degree: null,

                        }}
                        onSubmit={(data) => {
                            const body = new FormData();
                            body.append("government_id", data.govid_image);
                            body.append("degree_certificate", data.degree);
                            // same for all the files
                            body.append("additional_file", data.additional);
                            body.append("additional_info", data.change);
                            body.append("work_email", data.work_email);
                            body.append("linkedin", data.linkedin);
                            body.append("government_id_type", governmentIdMap[data.govid]);
                            // same for all the fields
                            uploadDocuments(body); // or however u called the endpoint in user.js
                        }}
                    >
                        {(formikProps) => (
                            <Form
                                className="d-flex flex-column gap-4"
                                noValidate
                                onSubmit={formikProps.handleSubmit}
                                style={{ marginTop: "70px" }}
                            >
                                <div className="text-center mb-0">
                                    <h6 className="fst-italic mb-0" style={{ color: "#9C9AA5" }}>
                                        1 / 3
                                    </h6>
                                    <h1 className="my-4 fw-bold mb-0">Complete Mentor Verification</h1>
                                </div>
                                <TextField
                                    name="work_email"
                                    label="Work Email"
                                    type="email"
                                    value={formikProps.values.work_email}
                                    placeholder="abc123@gmail.com"
                                    onChange={formikProps.handleChange}
                                    onBlur={formikProps.handleBlur}
                                    isValid={formikProps.touched.work_email && !formikProps.errors.work_email}
                                    isInvalid={
                                        formikProps.touched.work_email && !!formikProps.errors.work_email
                                    }
                                    error={formikProps.errors.work_email}
                                    required
                                />
                                <TextField
                                    name="linkedin"
                                    label="Linkedin Profile"
                                    type="text"
                                    value={formikProps.values.linkedin}
                                    placeholder="profile url"
                                    onChange={formikProps.handleChange}
                                    onBlur={formikProps.handleBlur}
                                    isValid={formikProps.touched.linkedin && !formikProps.errors.linkedin}
                                    isInvalid={
                                        formikProps.touched.linkedin && !!formikProps.errors.linkedin
                                    }
                                    error={formikProps.errors.linkedin}
                                    required
                                />
                                <TextField
                                    name="change"
                                    label="What change do you want to derive from your mentorship?"
                                    type="text"
                                    value={formikProps.values.change}
                                    placeholder="Your answer"
                                    onChange={formikProps.handleChange}
                                    onBlur={formikProps.handleBlur}
                                    isValid={formikProps.touched.change && !formikProps.errors.change}
                                    isInvalid={
                                        formikProps.touched.change && !!formikProps.errors.change
                                    }
                                    error={formikProps.errors.change}
                                    required
                                />
                                <Select
                                    name="govid"
                                    label="Choose an official ID proof issued by the Government of India:"
                                    value={formikProps.values.govid}
                                    options={["Aadhar Card", "Pan Card", "Driving License", "Voter's Id Card", "Passport", "Other"]}
                                    placeholder="ID Proof"
                                    onChange={formikProps.handleChange}
                                    onBlur={formikProps.handleBlur}
                                    isValid={
                                        formikProps.touched.govid && !formikProps.errors.govid
                                    }
                                    isInvalid={
                                        formikProps.touched.govid && !!formikProps.errors.govid
                                    }
                                    error={formikProps.errors.govid}
                                    required
                                />

                                <div className="d-flex flex-column gap-3 mb-0">


                                    <label for="degree">Upload Degree Certificate</label>
                                    <input
                                        type="file"
                                        label="Upload Degree Certificate"
                                        className="form-control"
                                        placeholder="Select file"
                                        accept="image/*"
                                        onChange={async (ev) => {
                                            if (ev.target.files.length > 0) {
                                                formikProps.setFieldValue("degree", ev.target.files[0]);
                                            }
                                        }}
                                    />

                                </div>
                                <div className="d-flex flex-column gap-3 mb-0">


                                    <label for="additional">Upload additional documents</label>
                                    <input
                                        type="file"
                                        className="form-control"
                                        placeholder="Select file"
                                        accept="image/*"
                                        onChange={async (ev) => {
                                            if (ev.target.files.length > 0) {
                                                formikProps.setFieldValue("additional", ev.target.files[0]);
                                            }
                                        }}
                                    />

                                </div>
                                <div className="d-flex flex-column gap-3 mb-0">


                                    <label for="govid_image">Upload Official ID Proof issued by The Government Of India</label>
                                    <input
                                        type="file"

                                        className="form-control"
                                        placeholder="Select file"
                                        accept="image/*"
                                        onChange={async (ev) => {
                                            if (ev.target.files.length > 0) {
                                                formikProps.setFieldValue("govid_image", ev.target.files[0]);
                                            }
                                        }}
                                    />

                                </div>

                                <Button
                                    type="submit"
                                >
                                    Continue
                                </Button>
                            </Form>
                        )}
                    </Formik>
                </Row>
            </Col>
            <Authcard side="right" />
        </Container>
    );
}
export default Verification;
