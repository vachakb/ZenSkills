import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import Select from "../components/Select";
import * as Yup from "yup";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { createJob } from "../apis/job";
import states from "../misc/states";

const CreateJobs = () => {
    const navigate = useNavigate();

    const validationSchema = Yup.object({
        title: Yup.string().required("Job title is required"),
        description: Yup.string().required("Job description is required"),
        company_name: Yup.string().required("Company name is required"),
        company_details: Yup.string().required("Company details are required"),
        job_type1: Yup.string()
            .oneOf(["Full Time", "Part Time"], "Please select a valid option")
            .required("This field is required"),
        job_type2: Yup.string()
            .oneOf(["On site", "Remote"], "Please select a valid option")
            .required("This field is required"),
        job_type3: Yup.array()
            .of(Yup.string().oneOf(["Internship", "Government", "Freelance", "Contract"]))
            .min(1, "Please select at least one option")
            .required("This field is required"),
        location: Yup.string().required("Please select a location"),
        qualifications: Yup.string().required("Please enter qualifications"),
        benefits: Yup.string().required("Please enter benefits"),
        app_details: Yup.string().required("Please enter application details"),
        deadline: Yup.date().required("Please enter a deadline"),
        salary: Yup.number().required("Salary is required"),
    });

    return (
        <div style={{ maxWidth: "90%" }} className="border p-3 rounded mx-auto">
            <Formik
                initialValues={{
                    title: "",
                    description: "",
                    company_name: "",
                    company_details: "",
                    location: "",
                    job_type1: "",
                    job_type2: "",
                    job_type3: [],
                    qualifications: "",
                    benefits: "",
                    app_details: "",
                    deadline: null,
                    salary: "",
                }}
                validationSchema={validationSchema}
                onSubmit={async (values) => {
                    console.log(values);
                    try {
                        const job_type = [
                            values.job_type1,
                            values.job_type2,
                            ...values.job_type3,
                        ];

                        const payload = {
                            ...values,
                            job_type,
                            deadline: values.deadline ? new Date(values.deadline).toISOString() : null,
                        };

                        delete payload.job_type1;
                        delete payload.job_type2;
                        delete payload.job_type3;

                        console.log("Final Payload:", payload);

                        await createJob(payload);
                        navigate("/jobs");
                    } catch (err) {
                        console.error("Submission Error:", err);
                    }
                }}
            >
                {({ handleSubmit, setFieldValue, values, errors, touched, formikProps }) => (
                    <Form noValidate onSubmit={handleSubmit}>
                        <h2 className="form-title">Create new job opening</h2>

                        {/* Job Title */}
                        <div className="mb-3">
                            <label htmlFor="title" className="form-label">
                                Job title <span className="text-danger">*</span>
                            </label>
                            <Field
                                type="text"
                                id="title"
                                name="title"
                                className="form-control"
                                placeholder="Enter job title here"
                            />
                            <ErrorMessage name="title" component="div" className="text-danger" />
                        </div>

                        {/* Job Description */}
                        <div className="mb-3">
                            <label htmlFor="description" className="form-label">
                                Job description <span className="text-danger">*</span>
                            </label>
                            <Field
                                as="textarea"
                                id="description"
                                name="description"
                                className="form-control"
                                placeholder="Type description here..."
                            />
                            <ErrorMessage name="description" component="div" className="text-danger" />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="company_details" className="form-label">
                                Company Details <span className="text-danger">*</span>
                            </label>
                            <Field
                                as="textarea"
                                id="company_details"
                                name="company_details"
                                className="form-control"
                                placeholder="Type company details here..."
                            />
                            <ErrorMessage name="company_details" component="div" className="text-danger" />
                        </div>

                        {/* Company Name */}
                        <div className="mb-3">
                            <label htmlFor="company_name" className="form-label">
                                Company name <span className="text-danger">*</span>
                            </label>
                            <Field
                                type="text"
                                id="company_name"
                                name="company_name"
                                className="form-control"
                                placeholder="Enter company name here"
                            />
                            <ErrorMessage name="company_name" component="div" className="text-danger" />
                        </div>

                        {/* Location */}
                        <div className="mb-3">
                            <label htmlFor="location" className="form-label">
                                Location <span className="text-danger">*</span>
                            </label>

                            {/* Location */}


                            <Select
                                name="location"
                                value={states.find((option) => option.value === values.location)} // Sync Formik's value
                                options={states} // Dropdown options
                                placeholder="Select a location"
                                onChange={(option) => {
                                    setFieldValue("location", option?.value || ""); // Update Formik state
                                }}
                                classNamePrefix="react-select"
                            />
                            <ErrorMessage name="location" component="div" className="text-danger" />
                        </div>



                        {/* Job Types */}
                        <div className="mb-3">
                            <label className="form-label">
                                Job Type 1 <span className="text-danger">*</span>
                            </label>
                            <div>
                                <label className="form-check-label me-3">
                                    <Field
                                        type="radio"
                                        name="job_type1"
                                        value="Full Time"
                                        className="form-check-input me-1"
                                    />
                                    Full Time
                                </label>
                                <label className="form-check-label">
                                    <Field
                                        type="radio"
                                        name="job_type1"
                                        value="Part Time"
                                        className="form-check-input me-1"
                                    />
                                    Part Time
                                </label>
                            </div>
                            <ErrorMessage name="job_type1" component="div" className="text-danger" />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">
                                Job Type 2 <span className="text-danger">*</span>
                            </label>
                            <div>
                                <label className="form-check-label me-3">
                                    <Field
                                        type="radio"
                                        name="job_type2"
                                        value="On site"
                                        className="form-check-input me-1"
                                    />
                                    On site
                                </label>
                                <label className="form-check-label">
                                    <Field
                                        type="radio"
                                        name="job_type2"
                                        value="Remote"
                                        className="form-check-input me-1"
                                    />
                                    Remote
                                </label>
                            </div>
                            <ErrorMessage name="job_type2" component="div" className="text-danger" />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">
                                Job Type 3 <span className="text-danger">*</span>
                            </label>
                            <div>
                                {["Internship", "Government", "Freelance", "Contract"].map((type) => (
                                    <label className="form-check-label me-3" key={type}>
                                        <input
                                            type="checkbox"
                                            name="job_type3"
                                            value={type}
                                            className="form-check-input me-1"
                                            checked={values.job_type3.includes(type)}
                                            onChange={(e) => {
                                                const { checked } = e.target;
                                                const updatedArray = checked
                                                    ? [...values.job_type3, type]
                                                    : values.job_type3.filter((item) => item !== type);
                                                setFieldValue("job_type3", updatedArray);
                                            }}
                                        />
                                        {type}
                                    </label>
                                ))}
                            </div>
                            <ErrorMessage name="job_type3" component="div" className="text-danger" />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="qualifications" className="form-label">
                                Qualifications <span className="text-danger">*</span>
                            </label>
                            <Field
                                as="textarea"
                                id="qualifications"
                                name="qualifications"
                                className="form-control"
                                placeholder="Enter qualifications"
                            />
                            <ErrorMessage name="qualifications" component="div" className="text-danger" />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="benefits" className="form-label">
                                Benefits <span className="text-danger">*</span>
                            </label>
                            <Field
                                as="textarea"
                                id="benefits"
                                name="benefits"
                                className="form-control"
                                placeholder="Enter benefits"
                            />
                            <ErrorMessage name="benefits" component="div" className="text-danger" />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="app_details" className="form-label">
                                Application Details <span className="text-danger">*</span>
                            </label>
                            <Field
                                as="textarea"
                                id="app_details"
                                name="app_details"
                                className="form-control"
                                placeholder="Enter application details"
                            />
                            <ErrorMessage name="description" component="div" className="text-danger" />
                        </div>
                        {/* Deadline */}
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <div className="mb-3">
                                <label htmlFor="deadline" className="form-label">
                                    Deadline <span className="text-danger">*</span>
                                </label>
                                <div>
                                    <Field name="deadline">
                                        {({ field, form }) => (
                                            <DateTimePicker
                                                label="Select deadline"

                                                value={field.value || null} // Bind Formik's field value
                                                onChange={(value) => form.setFieldValue("deadline", value)} // Update Formik's state
                                                renderInput={(params) => (
                                                    <>
                                                        <input
                                                            {...params.inputProps}
                                                            id="deadline"
                                                            className="form-control"
                                                            placeholder="Select deadline"

                                                        />
                                                        {form.errors.deadline && form.touched.deadline && (
                                                            <div className="text-danger">{form.errors.deadline}</div>
                                                        )}
                                                    </>
                                                )}
                                            />
                                        )}
                                    </Field>
                                </div>
                            </div>
                        </LocalizationProvider>


                        {/* Salary */}
                        <div className="mb-3">
                            <label htmlFor="salary" className="form-label">
                                Salary <span className="text-danger">*</span>
                            </label>
                            <Field
                                type="number"
                                id="salary"
                                name="salary"
                                className="form-control"
                                placeholder="Enter salary (0 if unpaid)"
                            />
                            <ErrorMessage name="salary" component="div" className="text-danger" />
                        </div>

                        {/* Submit Button */}
                        <div className="d-flex justify-content-between mt-4">
                            <Button className="ms-auto" variant="primary" type="submit">
                                Submit
                            </Button>
                        </div>

                        {/* Debugging */}
                        <pre>{JSON.stringify(values, null, 2)}</pre>
                        <pre>{JSON.stringify(errors, null, 2)}</pre>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default CreateJobs;
