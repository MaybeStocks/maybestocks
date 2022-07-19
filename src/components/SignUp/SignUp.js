import React, { useRef, useState } from "react";
import { Form, Button, Card, Alert } from "react-bootstrap";
import { useAuth } from "../../hooks/useAuth";
import { updateProfile } from "firebase/auth";

function SignUp() {
    const emailRef = useRef();
    const passwordRef = useRef();
    const confirmRef = useRef();
    const nameRef = useRef();
    const { signup } = useAuth();
    const [error, setError] = useState();
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();

        if (passwordRef.current.value !== confirmRef.current.value) {
            return setError("Passwords do not match!");
        } 

        try {
            setError("");
            setLoading(true);
            const user = await signup(emailRef.current.value, passwordRef.current.value);
            updateProfile(user, { displayName: nameRef.current.value});
            console.log(user);
        } catch (error) {
            console.log(error);
            setError("Account cannot be created!");
        }
        setLoading(false);
        
    }

    return (
        <>
            <Card>
                <Card.Body>
                    <h2 className="test-centre mb-4">Sign Up</h2>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Form onSubmit={handleSubmit}>
                       <Form.Group id="email">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" ref={emailRef} required />  
                        </Form.Group>
                        <Form.Group id="username">
                            <Form.Label>Username</Form.Label>
                            <Form.Control type="usename" ref={nameRef} required />  
                        </Form.Group>
                        <Form.Group id="password">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" ref={passwordRef} required />
                        </Form.Group>
                        <Form.Group id="password-confirmation">
                            <Form.Label>Password Confirmation</Form.Label>
                            <Form.Control type="password" ref={confirmRef} required /> 
                        </Form.Group>
                        <Button disabled={loading} className="w-100" type="submit">
                            Sign Up
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
        </>
    )
}

export default SignUp;