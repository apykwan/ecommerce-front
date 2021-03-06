import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';

import Layout from '../core/Layout';
import { isAuthenticated } from '../auth/index';
import { getPurchaseHistory } from './apiUser';

const Dashboard = () => {
    const [history, setHistory] = useState([]); 

    const { user: { _id, name, email, role}, token } = isAuthenticated();

    const init = (userId, token) => {
        getPurchaseHistory(userId, token)
        .then(data => {
            if(data.error) {
                console.log(data.error);
            } else {
                setHistory(data);
            }
        })
    };

    useEffect(() => {
        init(_id, token);
    }, []);

    const userLinks = () => {
        return (
            <div className="card">
                <h4 className="card-header">User Links</h4>
                <ul className="list-group">
                    <li className="list-group-item">
                        <Link className="nav-link" to="/cart">My Cart</Link>
                    </li>
                    <li className="list-group-item">
                        <Link className="nav-link" to={`/profile/${_id}`}>Profile Update</Link>
                    </li>
                </ul>
            </div>
        )
    };

    const userInfo = () => {
        return (
            <div className="card mb-5">
                <h3 className="card-header">User Information</h3>
                <ul className="list-group">
                    <li className="list-group-item">{name}</li>
                    <li className="list-group-item">{email}</li>
                    <li className="list-group-item">
                        {role === 1 ? "Admin" : "Registered User"}
                    </li>
                </ul>
            </div>
        )
    };

    const purchaseHistory = history => {
        return (
            <div className="card mb-5">
                <h3 className="card-header">Purchase History</h3>
                <ul className="list-group">
                    {
                        history.map(h => (
                            h.products.map((product, pIndex) => (
                                <li className="list-group-item" key={pIndex}>
                                    <h6>Product Name: {product.name}</h6>
                                    <h6>Product Price: {product.price}</h6>
                                    <h6>Product Date: {moment(product.createdAt).fromNow()}</h6>
                                </li>
                            ))
                        ))
                    }
                </ul>
            </div>
        )
    };
    
    return (
        <Layout 
            title="Dashboard" 
            description={`G' day ${name}!`} 
            className="container-fluid"
        >
            <div className="row">
                <div className="col-3">
                    {userLinks()}
                </div>
                <div className="col-9">
                    {userInfo()}
                    {purchaseHistory(history)}
                </div>
            </div>
        </Layout>
    )
};

export default Dashboard;