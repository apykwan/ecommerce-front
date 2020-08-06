import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import Layout from './Layout';
import Card from './Card';
import Checkout from './Checkout';
import { getCart } from './cartHelpers';

const Cart = () => {
    const [items, setItems] = useState([]);
    const [run, setRun] = useState(false);

    useEffect(() => {
        setItems(getCart());
    }, [run]);

    const showItems = items => {
        return (
            <div>
                <h2>Your cart has {`${items.length} items`}</h2>

                <hr />
                {items.map((product, idx) => (
                    <Card  
                        key={idx}
                        product={product}
                        showAddToCartButton={false}
                        cartUpdate={true}
                        showRemoveProductButton={true}
                        setRun={setRun}
                        run={run}
                    />
                ))}
            </div>
        );
    };

    const noItemsMessage = () => (
        <h2>
            Your cart is empty. 
            <br />
            <Link to="/shop">Continue shopping.</Link>
        </h2>
    );

    return (
        <Layout
            title="Shopping Cart"
            description="Mange your cart items. Add remove checkout or contiue shopping."
            className="container-fluid"
        >
            <div className="row">
                <div className="col-6">
                    {items.length > 0 ? showItems(items) : noItemsMessage()}
                </div>
                <div className="col-6">
                    <h2 className="mb-4">Your cart Summary</h2>
                    <Checkout 
                        products={items} 
                        setRun={setRun}
                        run={run}
                    />
                </div>
            </div> 
        </Layout>
    );

};

export default Cart;