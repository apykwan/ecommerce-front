import React, { useState, useEffect } from 'react';
import { Link, Redirect } from 'react-router-dom';

import Layout from '../core/Layout';
import { isAuthenticated } from '../auth/index';
import { getProducts, deleteProduct } from './apiAdmin';

const ManageProducts = () => {
    const [products, setProducts] = useState([]);

    const {user, token} = isAuthenticated();

    const loadProducts = () => {
        getProducts()
            .then(data => {
                if(data.error) {
                    console.log(data.error);
                } else {
                    setProducts(data);
                }
            })
    };

    const destroy = productId => {
        deleteProduct(productId, user._id, token)
            .then(data => {
                if(data.error) {
                    console.log(data.error);
                } else {
                    loadProducts();
                }
            });
    };

    useEffect(() => {
        loadProducts();
    }, [])

    return (
        <Layout
            title="Manage Products"
            description="Perform CRUD on products"
            className="container-fluid"
        >
            <div className="row">
                <div className="col-12">
                    <h2 className="text-center">
                        {`Total ${products.length} ${products.length > 1 ? 'products.' : 'product.'}`}
                    </h2>
                    <hr />
                    <ul className="list-group">
                        {products.map((product, idx) => (
                            <li 
                                className="
                                list-group-item 
                                d-flex 
                                justify-content-between 
                                align-items-center
                                "
                                key={idx}
                            >
                                <strong>{product.name}</strong>
                                <Link to={`/admin/product/update/${product._id}`}>
                                    <span className="badge badge-warning badge-pill">
                                        Update
                                    </span>
                                </Link>
                                <span
                                    className="badge badge-danger badge-pill"
                                    onClick={() => destroy(product._id)}
                                >
                                    Delete
                                </span>
                            </li> 
                        ))}
                    </ul>
                </div>
            </div>
            
        </Layout>
    );
};

export default ManageProducts;