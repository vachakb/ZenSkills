import React, { useEffect, useMemo, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Dropdown, Button, Card, Spinner } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { heIL } from "@mui/x-date-pickers/locales";
import { MdHeight } from "react-icons/md";
import { createWorkshop } from "../apis/workshops";
import { uploadImage } from "../apis/commons";
import { getMentorsList, createReferral } from "../apis/mentors";

const Referrals = () => {
    const navigate = useNavigate();

    const validationSchema = Yup.object({
        mentor: Yup.mixed().required("This field is required"),
        job_url: Yup.string().required("This field is required"),
        description: Yup.string().required("This field is required"),
        reason: Yup.string().required("This field is required"),
        resume: Yup.mixed().required("This field is required")
      });

    const [mentors, setMentors] = useState([]);

    const [filteredMentors, setFilteredMentors] = useState([]);

    const [isLoading, setIsLoading] = useState(true);

    const onLoad = async () => {
        setIsLoading(true)
        const mentorsRes = await getMentorsList();
        setMentors(mentorsRes.data.mentors);
        setFilteredMentors(mentorsRes.data.mentors);
        setIsLoading(false)
    }

    useEffect(() => {
        onLoad();
    }, []);


    if (isLoading) {
        return (
          <div className="d-flex h-100 w-100 justify-content-center align-items-center">
            <Spinner />
          </div>
        );
      }

    return (
        <div style={{ maxWidth: "90%" }} className="border p-3 rounded mx-auto">
            <Formik
                initialValues={{
                    mentor: null,
                    job_url: "",
                    description: "",
                    reason: "",
                    resume: null
                }}
                validationSchema={validationSchema}
        onSubmit={(data) => {
            const formData = new FormData();
            formData.append("mentor_id", data.mentor.id);
            formData.append("job_url", data.job_url);
            formData.append("description", data.description);
            formData.append("reason", data.reason);
            formData.append("resume", data.resume);
            createReferral(formData).then(() => navigate("/mentee_welcome")).catch(err => console.error(err));
        }}
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
                                <div style={{ height: "100px" }} className="d-flex flex-column overflow-auto">
                                    {filteredMentors.map(mentor => <p className="m-0 px-2 py-1 me-auto" style={{ cursor: "pointer", border: mentor.id === formikProps.values.mentor?.id ? "2px solid green" : "unset", borderRadius: "12px" }} onClick={() => {

                                        if (formikProps.values.mentor?.id === mentor.id) {
                                            formikProps.setFieldValue("mentor", null);
                                        } else {
                                            formikProps.setFieldValue("mentor", mentor);
                                        }
                                    }}>{mentor.User.name}</p>)}
                                </div>
                                Search a mentor <span className="text-danger">*</span>
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Enter name or company name"
                                onChange={(ev) => {
                                    const value = ev.currentTarget.value;
                                    setFilteredMentors(mentors.filter(mentor => mentor.User.name.toLowerCase().startsWith(value.toLowerCase())));
                                }}
                            />
                            <ErrorMessage
                                name="mentor"
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
                                id="job_url"
                                name="job_url"
                                className="form-control"
                                placeholder="Enter URL"
                            />
                            <ErrorMessage
                                name="job_url"
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
                                        formikProps.setFieldValue("resume", ev.target.files[0]);
                                    }
                                }}
                            />
                            <div className="mb-3">
                                <label htmlFor="reason" className="form-label">
                                    Why should the mentor refer you?{" "}
                                    <span className="text-danger">*</span>
                                </label>
                                <Field
                                    as="textarea"
                                    id="reason"
                                    name="reason"
                                    className="form-control"
                                    placeholder="Type reason here..."
                                />
                                <ErrorMessage
                                    name="reason"
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
