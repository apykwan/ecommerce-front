import React, { useState, useEffect } from 'react';

import Layout from './Layout';
import Card from './Card';
import Search from './Search';
import { getProducts } from './apiCore';

const Home = () => {
    const [productsBySell, setProductsBySell] = useState([]);
    const [productsByArrival, setProductsByArrival] = useState([]);
    const [error, setError] = useState(false);

    const loadProductsBySell = () => {
        getProducts('sold')
            .then(data => {
                if(data.error) {
                    setError(data.error);
                } else {
                    setProductsBySell(data);
                }
            })
    };

    const loadProductsByArrival = () => {
        getProducts('createdAt')
            .then(data => {
                if (data.error) {
                    setError(data.error);
                } else {
                    setProductsByArrival(data);
                }
            })
    };

    useEffect(() => {
        loadProductsByArrival();
        loadProductsBySell();
    }, []);

    console.log(productsByArrival.map(product => product.createdAt.split('-')))

    return (
        <Layout
            title="Home Page"
            description="Node React E-Commerce App"
            className="container-fluid"
        >
            <Search />
            <h2 className="mb-4">Best Seller</h2>
            <div className="row">
                {productsBySell.map((product, idx) => (
                    <div key={idx} className="col-12 col-md-4 mb-3">
                        <Card product={product} />
                    </div>
                ))}

            </div>
            <h2 className="mb-4">New Arrival</h2>
            <div className="row">
                {productsByArrival.map((product, idx) => (
                    <div key={idx} className="col-12 col-md-4 mb-3">
                        <Card product={product} />
                    </div>
                ))}
            </div>
        </Layout>
    );
};

export default Home;