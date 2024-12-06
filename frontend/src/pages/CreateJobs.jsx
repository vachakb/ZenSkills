import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Dropdown, Button, Card } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { heIL } from "@mui/x-date-pickers/locales";
import { MdHeight } from "react-icons/md";

const CreateJobs = () => {
    const validationSchema = Yup.object({
        title: Yup.string().required("Job title is required"),
        description: Yup.string().required("Job description is required"),
        company_name: Yup.string().required("Company name is required"),
        company_details: Yup.string().required("Company details are required"),
        job_type1: Yup
            .string()
            .oneOf(["Full Time", "Part Time"], "This is a required field")
            .required("This is a required field"),
        job_type2: Yup
            .string()
            .oneOf(["On site", "Remote"], "This is a required field")
            .required("This is a required field"),
        job_type3: Yup.array()
            .of(Yup.string().oneOf(["Internship", "Government", "Freelance", "Contract"]))
            .min(1, "Please select at least one job type")
            .required("This is a required field"),

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
                    job_type1: "",
                    job_type2: "",
                    job_type3: "",
                    qualifications: "",
                    benefits: "",
                    app_details: "",
                    deadline: "",
                    salary: "",

                }}
                validationSchema={validationSchema}
            >
                {({ setFieldValue }) => (
                    <Form>
                        {/* Title and Card Header */}
                        <h2 className="form-title">Create new job opening</h2>
                        <div className="mb-3 mt-3">
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
                            <ErrorMessage
                                name="title"
                                component="div"
                                className="text-danger"
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="description" className="form-label">
                                Job description{" "}
                                <span className="text-danger">*</span>
                            </label>
                            <Field
                                as="textarea"
                                id="description"
                                name="description"
                                className="form-control"
                                placeholder="Type description here..."
                            />
                            <ErrorMessage
                                name="description"
                                component="div"
                                className="text-danger"
                            />
                        </div>
                        <div className="mb-3 mt-3">
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
                            <ErrorMessage
                                name="company_name"
                                component="div"
                                className="text-danger"
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="company_details" className="form-label">
                                Company details{" "}
                                <span className="text-danger">*</span>
                            </label>
                            <Field
                                as="textarea"
                                id="company_details"
                                name="company_details"
                                className="form-control"
                                placeholder="Type company description here..."
                            />
                            <ErrorMessage
                                name="company_details"
                                component="div"
                                className="text-danger"
                            />
                            <hr />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">
                                Job Type 1 <span className="text-danger">*</span>
                            </label>
                            <div role="group" aria-labelledby="job_type1" className="form-check">
                                <Field
                                    type="radio"
                                    name="job_type1"
                                    value="Full Time"
                                    id="job_type1_fulltime"
                                    className="form-check-input"
                                />
                                <label htmlFor="job_type1_fulltime" className="form-check-label">
                                    Full Time
                                </label>
                            </div>
                            <div className="form-check">
                                <Field
                                    type="radio"
                                    name="job_type1"
                                    value="Part Time"
                                    id="job_type1_parttime"
                                    className="form-check-input"
                                />
                                <label htmlFor="job_type1_parttime" className="form-check-label">
                                    Part Time
                                </label>

                            </div>

                            <ErrorMessage name="job_type1" component="div" className="text-danger" />
                            <hr />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">
                                Job Type 2 <span className="text-danger">*</span>
                            </label>
                            <div role="group" aria-labelledby="job_type2" className="form-check">
                                <Field
                                    type="radio"
                                    name="job_type2"
                                    value="On site"
                                    id="job_type2_onsite"
                                    className="form-check-input"
                                />
                                <label htmlFor="job_type2_onsite" className="form-check-label">
                                    On site
                                </label>
                            </div>
                            <div className="form-check">
                                <Field
                                    type="radio"
                                    name="job_type2"
                                    value="Remote"
                                    id="job_type2_remote"
                                    className="form-check-input"
                                />
                                <label htmlFor="job_type2_remote" className="form-check-label">
                                    Remote
                                </label>
                            </div>
                            <ErrorMessage name="job_type2" component="div" className="text-danger" />
                            <hr />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">
                                Job Type 3 <span className="text-danger">*</span>
                            </label>
                            <div className="form-check">
                                <Field
                                    type="checkbox"
                                    name="job_type3"
                                    value="Internship"
                                    id="job_type3_internship"
                                    className="form-check-input"
                                />
                                <label htmlFor="job_type3_internship" className="form-check-label">
                                    Internship
                                </label>
                            </div>
                            <div className="form-check">
                                <Field
                                    type="checkbox"
                                    name="job_type3"
                                    value="Government"
                                    id="job_type3_government"
                                    className="form-check-input"
                                />
                                <label htmlFor="job_type3_government" className="form-check-label">
                                    Government
                                </label>
                            </div>
                            <div className="form-check">
                                <Field
                                    type="checkbox"
                                    name="job_type3"
                                    value="Freelance"
                                    id="job_type3_freelance"
                                    className="form-check-input"
                                />
                                <label htmlFor="job_type3_freelance" className="form-check-label">
                                    Freelance
                                </label>
                            </div>
                            <div className="form-check">
                                <Field
                                    type="checkbox"
                                    name="job_type3"
                                    value="Contract"
                                    id="job_type3_contract"
                                    className="form-check-input"
                                />
                                <label htmlFor="job_type3_contract" className="form-check-label">
                                    Contract
                                </label>
                            </div>
                            <ErrorMessage name="job_type3" component="div" className="text-danger" />
                            <hr />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="qualifications" className="form-label">
                                Qualifications{" "}
                                <span className="text-danger">*</span>
                            </label>
                            <Field
                                as="textarea"
                                id="qualifications"
                                name="qualifications"
                                className="form-control"
                                placeholder="Enter qualifications"
                            />
                            <ErrorMessage
                                name="qualifications"
                                component="div"
                                className="text-danger"
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="benefits" className="form-label">
                                Benefits{" "}
                                <span className="text-danger">*</span>
                            </label>
                            <Field
                                as="textarea"
                                id="benefits"
                                name="benefits"
                                className="form-control"
                                placeholder="Enter benefits"
                            />
                            <ErrorMessage
                                name="benefits"
                                component="div"
                                className="text-danger"
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="app_details" className="form-label">
                                Application details{" "}
                                <span className="text-danger">*</span>
                            </label>
                            <Field
                                as="textarea"
                                id="app_details"
                                name="app_details"
                                className="form-control"
                                placeholder="Specify the content that should be attached with the job application"
                            />
                            <ErrorMessage
                                name="app_details"
                                component="div"
                                className="text-danger"
                            />
                        </div>
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
                                                            style={{ height: "20px" }}
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

                        <div className="mb-3">
                            <label htmlFor="salary" className="form-label">
                                Salary{" "}
                                <span className="text-danger">*</span>
                            </label>
                            <Field
                                type="number"
                                id="salary"
                                name="salary"
                                className="form-control"
                                placeholder="Enter salary (0 if unpaid work)"
                            />
                            <ErrorMessage
                                name="salary"
                                component="div"
                                className="text-danger"
                            />
                        </div>

                        <div className="d-flex justify-content-between mt-4">
                            <Button className="ms-auto" variant="primary" type="submit">
                                Next
                            </Button>
                        </div>
                    </Form>
                )}
            </Formik>
        </div >






        /*<LocalizationProvider dateAdapter={AdapterDayjs}>
<DemoContainer components={['DateTimePicker']}>
<DateTimePicker label="Basic date time picker" />
</DemoContainer>
</LocalizationProvider>*/

    )
}
export default CreateJobs;