import React, { useEffect, useMemo, useState } from "react";
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
import { createWorkshop } from "../apis/workshops";
import { uploadImage } from "../apis/commons";

const Referrals = () => {
    const navigate = useNavigate();
    const validationSchema = Yup.object({
        title: Yup.string().required("Job title is required"),
        description: Yup.string().required("Job description is required"),
        date: Yup.date().required("Please enter workshop date and time"),
        duration: Yup.number()
            .required("Workshop duration is required")
            .positive("Duration must be positive")
            .integer("Duration must be a whole number"),
        workshop_image: Yup.mixed().required("Please enter an image"),
        max_participants: Yup.number()
            .required("Please enter maximum number of participants")
            .positive("No. of participants must be positive")
            .integer("No. of participants must be a whole number"),
        deadline: Yup.date().required("Please enter a deadline"),
        visibility: Yup
            .string()
            .oneOf(["Private", "Public", "Mentors Only"], "This is a required field")
            .required("This is a required field"),
    });

    return (
        <div style={{ maxWidth: "90%" }} className="border p-3 rounded mx-auto">
            <Formik
                initialValues={{
                    title: "",
                    description: "",
                    date: "",
                    duration: "",
                    workshop_image: "",
                    max_participants: "",
                    visibility: "",
                    deadline: "",
                }}
                validationSchema={validationSchema}
            /* onSubmit={async (data) => {
                 try {
                     const imageFile = data.workshop_image;
                     const uploadImageRes = await uploadImage(imageFile);
                     console.log(uploadImageRes);
                     data.workshop_image = uploadImageRes.data.image.id;
                     await createWorkshop(data);
                     navigate("/workshops")
                 } catch (err) {
                     console.error(err);
                 }
             }}*/


            >
                {(formikProps) => {
                    const imagePreview = useMemo(() => {
                        if (formikProps.values.workshop_image) {
                            return URL.createObjectURL(formikProps.values.workshop_image);
                        }
                    }, [formikProps.values.workshop_image]);

                    return <Form noValidate onSubmit={formikProps.handleSubmit}>
                        {/* Title and Card Header */}
                        <h2 className="form-title">Ask for referral</h2>
                        <div className="mb-3 mt-3">
                            <label htmlFor="title" className="form-label">
                                Search a mentor <span className="text-danger">*</span>
                            </label>
                            <Field
                                type="text"
                                id="title"
                                name="title"
                                className="form-control"
                                placeholder="Enter name or company name"
                            />
                            <ErrorMessage
                                name="title"
                                component="div"
                                className="text-danger"
                            />
                        </div>

                        <div className="mb-3 mt-3">
                            <label htmlFor="title" className="form-label">
                                Job URL <span className="text-danger">*</span>
                            </label>
                            <Field
                                type="text"
                                id="title"
                                name="title"
                                className="form-control"
                                placeholder="Enter URL"
                            />
                            <ErrorMessage
                                name="title"
                                component="div"
                                className="text-danger"
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="description" className="form-label">
                                Description/Cover Letter{" "}
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
                        <div className="d-flex flex-column gap-3 mb-0">


                            <label for="degree">Upload Resume</label>
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
                            <div className="mb-3">
                                <label htmlFor="description" className="form-label">
                                    Why should the mentor refer you?{" "}
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

                        </div>


                        <div className="d-flex justify-content-between mt-4">
                            <Button className="ms-auto" variant="primary" type="submit" onClick={() => console.log(formikProps.errors)}>
                                Save
                            </Button>
                        </div>
                    </Form>
                }}
            </Formik>
        </div >






        /*<LocalizationProvider dateAdapter={AdapterDayjs}>
<DemoContainer components={['DateTimePicker']}>
<DateTimePicker label="Basic date time picker" />
</DemoContainer>
</LocalizationProvider>*/

    )
}
export default Referrals;
