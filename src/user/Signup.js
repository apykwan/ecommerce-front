import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import Layout from '../core/Layout';
import { signup } from '../auth/index';

const Signup = () => {
    const [values, setValues] = useState({
        name: '',
        email: '',
        password: '',
        rePassword: '',
        error: '',
        success: false
    });

    const { name, email, password, rePassword, error, success } = values
    
    const handleChange = name => event => {
        setValues({
            ...values, 
            error: false,
            [name]: event.target.value
        });
    };

    const clickSubmit = event => {
        event.preventDefault();
        setValues({ ...values, error: false });
        if (password !== rePassword) {
            return setValues({
                ...values,
                password: '',
                rePassword: '',
                error: 'Please Re-Enter Your Password!!!'
            });
        }
        
        signup({ name, email, password })
        .then(data => {
            if(data.error) {
                setValues({
                    ...values, 
                    error: data.error, 
                    success: false
                });
            } else {
                setValues({
                    ...values,
                    name: '',
                    email: '',
                    password: '',
                    rePassword: '',
                    error: '',
                    success: true
                });
            }
        })
    };

    const showError = () => (
        <div 
            className="alert alert-danger mt-4"
            style={{ display: error ? '' : 'none' }}
        >
            {error}
        </div>
    );

    const showSuccess = () => (
        <div
            className="alert alert-info mt-4"
            style={{ display: success ? '' : 'none' }}
        >
            New account is created! Please Signin <Link to="/signin">Signin</Link>.
        </div>
    );

    const signUpForm = () => (
        <form>
            <div className="form-group">
                <label className="text-muted">Name</label>
                <input 
                    onChange={handleChange('name')} 
                    type="text" 
                    className="form-control" 
                    value={name} 
                />
            </div>

            <div className="form-group">
                <label className="text-muted">Email</label>
                <input 
                    onChange={handleChange('email')} 
                    type="email" 
                    className="form-control" 
                    value={email} 
                />
            </div>
            
            <div className="form-group">
                <label className="text-muted">Password</label>
                <input 
                    onChange={handleChange('password')} 
                    type="password" 
                    className="form-control" 
                    value={password} 
                    autoComplete="true" 
                />
            </div>

            <div className="form-group">
                <label className="text-muted">Re-Enter Password</label>
                <input 
                    onChange={handleChange('rePassword')} 
                    type="password" 
                    className="form-control"
                    value={rePassword}  
                    autoComplete="true" 
                />
            </div>
            
            <button 
                className="btn btn-primary"
                onClick={clickSubmit}
            >
                    Submit
            </button>
        </form>
    );

    return (
        <Layout
            title="Signup Page"
            description="Node React E-Commerce App"
            className="container col-md-8 offset-md-2"
        >
            {signUpForm()}
            {showSuccess()}
            {showError()}
        </Layout>
    );
}

export default Signup;