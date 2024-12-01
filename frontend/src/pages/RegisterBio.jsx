import { Col, Container, Row, Form, Button } from "react-bootstrap";
import Authcard from "../components/Authcard";
import TextField from "../components/TextField";
import * as yup from "yup";
import { Formik } from "formik";
import { useLocation } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../apis/user";
import useSession from "../hooks/useSession";
import { getAllTags } from "../apis/user";
import Select from "../components/Select";

function RegisterBio() {
  const prevForm = useLocation().state;

  const { session } = useSession();

  const isMentor = session.role === "mentor";

  const navigate = useNavigate();

  const [tags, setTags] = useState([]);

  const [selectedTags, setSelectedTags] = useState([]);

  const onLoad = async () => {
    try {
      const res = await getAllTags();
      setTags(res.data.tags);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    onLoad();
  }, []);

  const schema = useMemo(() => {
    if (isMentor) {
      return yup.object({
        bio: yup.string(),
      });
    } else {
      return yup.object({
        bio: yup.string(),
      });
    }
  }, [prevForm]);

  return (
    <Container className="d-flex vh-100 p-0" fluid>
      <Col className="d-flex justify-content-center align-items-center">
        <Row className="w-50">
          <Formik
            validationSchema={schema}
            initialValues={{
              bio: "",
            }}
            onSubmit={async (data) =>
              registerUser({
                ...prevForm,
                ...data,
                expertise: isMentor ? selectedTags : null,
                interests: isMentor ? null : selectedTags,
              })
                .then(() => {
                  if (!isMentor) {
                    navigate("/mentee_welcome", {
                      state: { ...prevForm, ...data },
                    });
                  } else {
                    navigate("/mentor_welcome", {
                      state: { ...prevForm, ...data },
                    });
                  }
                })
                .catch((err) => {
                  console.error(error);
                  // TODO error modal
                  alert(err);
                })
            }
          >
            {(formikProps) => (
              <Form
                className="d-flex flex-column gap-4"
                noValidate
                onSubmit={formikProps.handleSubmit}
              >
                <div className="text-center">
                  <h6 className="fst-italic" style={{ color: "#9C9AA5" }}>
                    3 / 3
                  </h6>
                  <h1 className="my-4 fw-bold">Almost There!</h1>
                </div>
                <Select
                  name={isMentor ? "expertise" : "interests"}
                  label={isMentor ? "Expertise" : "Interests"}
                  type="text"
                  value="Select..."
                  options={tags.map((tag) => tag.tag_name)}
                  placeholder="Select..."
                  onChange={(ev) => {
                    // HACK just make it work for now
                    const selectedValue = ev.currentTarget.value;

                    let selectedTag;

                    for (const tag of tags) {
                      if (tag.tag_name === selectedValue) {
                        selectedTag = tag;
                        break;
                      }
                    }

                    if (
                      !selectedTags
                        .map((tag) => tag.tag_name)
                        .includes(selectedValue)
                    ) {
                      const arrCopy = [...selectedTags];
                      arrCopy.push(selectedTag);
                      setSelectedTags(arrCopy);
                    }
                  }}
                  onBlur={formikProps.handleBlur}
                  isValid={
                    isMentor
                      ? formikProps.touched.expertise &&
                        !formikProps.errors.expertise
                      : formikProps.touched.interests &&
                        !formikProps.errors.interests
                  }
                  isInvalid={
                    isMentor
                      ? formikProps.touched.expertise &&
                        !!formikProps.errors.expertise
                      : formikProps.touched.interests &&
                        !!formikProps.errors.interests
                  }
                  error={
                    isMentor
                      ? formikProps.errors.expertise
                      : formikProps.errors.interests
                  }
                  required
                />
                <div className="d-flex gap-2">
                  {selectedTags.map((value) => (
                    <div
                      style={{ borderRadius: "24px", minWidth: "50px" }}
                      className="border border-2 px-2 py-2 text-center"
                    >
                      <span key={value.tag_id}>{value.tag_name}</span>
                    </div>
                  ))}
                </div>
                <TextField
                  as="textarea"
                  rows="5"
                  name="bio"
                  label="Tell us about yourself"
                  type="text"
                  value={formikProps.values.bio}
                  placeholder="Write your bio here"
                  onChange={formikProps.handleChange}
                  onBlur={formikProps.handleBlur}
                  isValid={formikProps.touched.bio && !formikProps.errors.bio}
                  isInvalid={
                    formikProps.touched.bio && !!formikProps.errors.bio
                  }
                  error={formikProps.errors.bio}
                />
                <Button
                  type="submit"
                  disabled={
                    formikProps.isValidating ||
                    formikProps.isSubmitting ||
                    !(formikProps.isValid && formikProps.dirty)
                  }
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
export default RegisterBio;
