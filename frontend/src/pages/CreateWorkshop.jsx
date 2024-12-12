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

const CreateWorkshop = () => {
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
                onSubmit={async (data) => {
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
                }}


            >
                {(formikProps) => {
                    const imagePreview = useMemo(() => {
                        if (formikProps.values.workshop_image) {
                            return URL.createObjectURL(formikProps.values.workshop_image);
                        }
                    }, [formikProps.values.workshop_image]);

                    return <Form noValidate onSubmit={formikProps.handleSubmit}>
                        {/* Title and Card Header */}
                        <h2 className="form-title">Create new workshop</h2>
                        <div className="mb-3 mt-3">
                            <label htmlFor="title" className="form-label">
                                Workshop title <span className="text-danger">*</span>
                            </label>
                            <Field
                                type="text"
                                id="title"
                                name="title"
                                className="form-control"
                                placeholder="Enter workshop title here"
                            />
                            <ErrorMessage
                                name="title"
                                component="div"
                                className="text-danger"
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="description" className="form-label">
                                Workshop description{" "}
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
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <div className="mb-3">
                                <label htmlFor="date" className="form-label">
                                    Date and time <span className="text-danger">*</span>
                                </label>
                                <div>
                                    <Field name="date">
                                        {({ field, form }) => (
                                            <DateTimePicker
                                                label="Select date and time"
                                                disablePast

                                                value={field.value || null} // Bind Formik's field value
                                                onChange={(value) => form.setFieldValue("date", value)} // Update Formik's state
                                                renderInput={(params) => (
                                                    <>
                                                        <input
                                                            {...params.inputProps}
                                                            id="date"
                                                            className="form-control"
                                                            placeholder="Select date"

                                                        />
                                                        {form.errors.date && form.touched.date && (
                                                            <div className="text-danger">{form.errors.date}</div>
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
                            <label htmlFor="duration" className="form-label">
                                Set the duration of workshop in minutes{" "}
                                <span className="text-danger">*</span>
                            </label>
                            <Field
                                type="number"
                                id="duration"
                                name="duration"
                                className="form-control"
                                placeholder="Eg: 120"
                            />
                            <ErrorMessage
                                name="duration"
                                component="div"
                                className="text-danger"
                            />
                        </div>

                        <div className="d-flex flex-column gap-3 mb-3">
                            <label htmlFor="workshop_image" className="form-label">
                                Enter an image relevant to the workshop{" "}
                                <span className="text-danger">*</span>
                            </label>
                            {imagePreview && (
                                <div className="d-flex align-items-center gap-2">
                                    <h6>Choosen image:</h6>
                                    <img src={imagePreview} width="120px" />
                                </div>
                            )}
                            <input
                                type="file"
                                className="form-control"
                                placeholder="Select file"
                                accept="image/*"
                                onChange={async (ev) => {
                                    if (ev.target.files.length > 0) {
                                        formikProps.setFieldValue("workshop_image", ev.target.files[0]);
                                    }
                                }}
                            />
                            <ErrorMessage
                                name="workshop_image"
                                component="div"
                                className="text-danger"
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="max_participants" className="form-label">
                                Enter maximum number of participants{" "}
                                <span className="text-danger">*</span>
                            </label>
                            <Field
                                type="number"
                                id="max_participants"
                                name="max_participants"
                                className="form-control"
                                placeholder="Eg: 120"
                            />
                            <ErrorMessage
                                name="max_participants"
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
                                                disablePast

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

                        <div className="mb-3">
                            <label className="form-label">
                                Workshop Visibility <span className="text-danger">*</span>
                            </label>
                            <div role="group" aria-labelledby="visibility" className="form-check">
                                <Field
                                    type="radio"
                                    name="visibility"
                                    value="Private"
                                    id="visibility_private"
                                    className="form-check-input"
                                />
                                <label htmlFor="visibility_private" className="form-check-label">
                                    Private
                                </label>
                            </div>
                            <div className="form-check">
                                <Field
                                    type="radio"
                                    name="visibility"
                                    value="Public"
                                    id="visibility_public"
                                    className="form-check-input"
                                />
                                <label htmlFor="visibility_public" className="form-check-label">
                                    Public
                                </label>

                            </div>
                            <div className="form-check">
                                <Field
                                    type="radio"
                                    name="visibility"
                                    value="MentorOnly"
                                    id="visibility_mentoronly"
                                    className="form-check-input"
                                />
                                <label htmlFor="visibility_mentoronly" className="form-check-label">
                                    Mentors Only
                                </label>

                            </div>

                            <ErrorMessage name="visibility" component="div" className="text-danger" />
                            <hr />
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
export default CreateWorkshop;
