import { Col, Container, Row, Form } from 'react-bootstrap'
import Authcard from '../components/Authcard';
import * as yup from 'yup';
import { Formik } from 'formik';




function Register() {
    const schema = yup.object({
        'address': yup.string().email().required(),
        'password': yup.string().required(),
        'confirmpassword': yup.string().oneOf([yup.ref('password'), null])


    })
    return (
        <Container className="d-flex vh-100 p-0" fluid>
            <Authcard />
            <Col>
                <Row>
                    <Formik
                        validationSchema={schema}
                        initialValues={{
                            address: '',
                            password: '',
                            confirmpassword: ''
                        }}
                        onSubmit={(data) => { console.log(data) }}>
                        {(formikProps) => (
                            <Form noValidate onSubmit={formikProps.onSubmit}>
                                <h1>Let's get you started</h1></Form>
                        )}
                    </Formik>
                </Row>
            </Col>
        </Container>

    );
}
export default Register;
