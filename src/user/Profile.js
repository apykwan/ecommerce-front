import React, { useState, useEffect } from 'react';
import { Link, Redirect } from 'react-router-dom';

import Layout from '../core/Layout';
import { isAuthenticated } from '../auth/index';
import { read, update, updateUser } from './apiUser';

const Profile = ({match}) => {
    const [values, setValues] = useState({
        name: '',
        email: '',
        password: '',
        error: '',
        success: false
    });

    const { name, email, password, error, success } = values;
    const { token } = isAuthenticated();

    const init = userId => {
        // console.log(userId);
        read(userId, token)
            .then(data => {
                if(data.error) {
                    setValues({ 
                        ...values, 
                        error: true 
                    })
                } else {
                    setValues({
                        ...values,
                        name: data.name,
                        email: data.email
                    })
                }
            })
    };

    useEffect(() => {
        init(match.params.userId);
    }, []);

    const handleChange = name => e => {
        setValues({
            ...values,
            error: false,
            [name]: e.target.value
        });
    };

    const clickSubmit = e => {
        e.preventDefault();
        update(match.params.userId, token, { name, email, password }).then(data => {
            if (data.error) {
                // console.log(data.error);
                alert(data.error);
            } else {
                updateUser(data, () => {
                    setValues({
                        ...values,
                        name: data.name,
                        email: data.email,
                        success: true
                    });
                });
            }
        });
    };

    const redirectUser = success => {
        if(success) {
            return <Redirect to="/cart" />
        }
    };

    const profileUpdate = (name, email, password) => (
        <form>
            <div className="form-group">
                <label className="text-muted">Name</label>
                <input
                    type="text"
                    className="form-control"
                    value={name}
                    onChange={handleChange('name')}
                />
            </div>
            <div className="form-group">
                <label className="text-muted">Email</label>
                <input
                    type="email"
                    className="form-control"
                    value={email}
                    onChange={handleChange('email')}
                />
            </div>
            <div className="form-group">
                <label className="text-muted">Password</label>
                <input 
                    type="passwordt" 
                    className="form-control"
                    value={password} 
                    onChange={handleChange('password')} 
                />
            </div>
            <button className="btn btn-primary" onClick={clickSubmit}>submit</button>
        </form>
    );

    return (
        <Layout
            title="Profile Page"
            description="Update your profile"
            className="container-fluid"
        >
            <h2 className="mb-4">Profile</h2>
            {profileUpdate(name, email, password)}
            {redirectUser(success)}
        </Layout>
    );
};

export default Profile;