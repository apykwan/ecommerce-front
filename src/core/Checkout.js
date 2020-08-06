import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DropIn from 'braintree-web-drop-in-react';

import { processPayment, getBraintreeClientToken, createOrder } from './apiCore';
import { isAuthenticated } from '../auth/index';
import { emptyCart } from './cartHelpers';

const Checkout = ({ products, setRun = f => f, run = undefined }) => {
    const [data, setData] = useState({
        loading: false,
        success: false,
        clientToken: null,
        error: '',
        instance: {},
        address: ''
    });

    const userId = isAuthenticated() && isAuthenticated().user._id;
    const token = isAuthenticated() && isAuthenticated().token;

    // Get Braintree client token
    const getToken = (userId, token) => {
        getBraintreeClientToken(userId, token)
            .then(data => {
                if(data.error) {
                    setData({
                        ...data,
                        error: data.error
                    });
                } else {
                    setData({
                        clientToken: data.clientToken
                    })
                }
            })
    };

    const handleAddress = event => {
        setData({
            ...data,
            address: event.target.value
        });
    };

    useEffect(() => {
        getToken(userId, token);
    }, [])

    const getTotal = () => {
        const total = products.reduce((currentValue, nextvalue) => {
            return currentValue + nextvalue.count * nextvalue.price;
        }, 0);
        return total.toFixed(2);
    };

    const showCheckout = () => (
        isAuthenticated() ? (
            <div>{showDropIn()}</div>
        ) : (
                <Link to="/signin">
                    <button className="btn btn-primary">
                        Sign in to checkout
                    </button>
                </Link>
            )
    );

    let deliveryAddress = data.address;

    const buy = () => {
        setData({ loading: true });
        // send the nonce to your server
        // nonce = data.instance.requestPaymentMethod()
        let nonce;
        let getNonce = data.instance.requestPaymentMethod() 
            .then(data => {
                nonce = data.nonce;
                // once you have nonce (card type, card number) send nonce as 'paymentMethodNonce'
                // and also total to be charged
                // console.log('send nonce and total to process:', nonce, getTotal(products));
                // getTotal(products);
                const paymentData = {
                    paymentMethodNonce: nonce,
                    amount: getTotal(products)
                };
                processPayment(userId, token, paymentData)
                    .then(response => {
                        console.log(response)
                        setData({
                            ...response,
                            success: true
                        });
                        
                        // create order
                        const createOrderData = {
                            products: products,
                            transaction_id: response.transaction.id,
                            amount: response.transaction.amount,
                            address: deliveryAddress
                        };
                        
                        createOrder(userId, token, createOrderData)
                            .then(response => {
                                // empty cart
                                emptyCart(() => {
                                    setRun(!run); // run useEffect in parent Cart
                                    setData({
                                        loading: false,
                                        success: true
                                    });
                                    console.log('payment success and empty cart');
                                });

                            })
                            .catch(error => {
                                console.log(error);
                                setData({ loading: false })
                            });
                    })
                    .catch(error => {
                        setData({ loading: false });
                        console.log(error);
                    });
            })
            .catch(error => {
                // console.log('dropping error: ', error);
                setData({
                    ...data,
                    error: error.message
                })
            });
    };

    const showDropIn = () => (
        <div 
            onBlur={() => setData({
                ...data,
                error: ''
            })}
        >
            {data.clientToken !== null && products.length > 0
                ? (
                    <div>
                        <div className="form-group mb-3">
                            <label className="text-muted">Delivery Address: </label>
                            <textarea 
                                onChange={handleAddress}
                                className="form-control"
                                value={data.address}
                                placeholder="Type your delivery address here..."
                            />
                        </div>
                        <DropIn
                            options={{
                                authorization: data.clientToken,
                                paypal: {
                                    flow: 'vault'
                                }
                            }}
                            onInstance={instance => (data.instance = instance)}
                        />
                        <button 
                            className="btn btn-success btn-block"
                            onClick={() => buy()}
                        >
                            Checkout
                        </button>
                    </div>
                )
                : null
            }
        </div>
    );

    const showError = error => (
        <div
            className="alert alert-danger"
            style={{ display: error ? '' : 'none' }}
        >
            {error}
        </div>
    );

    const showSuccess = success => (
        <div
            className="alert alert-info"
            style={{ display: success ? '' : 'none' }}
        >
            Thanks! Your payment was successful!!!
        </div>
    );
        
    const showLoading = loading => (
        loading && (
            <h2>Loading...</h2>
        )
    );

    return (
        <div>
            <h2>Total: ${getTotal()}</h2>
            {showLoading(data.loading)}
            {showError(data.error)}
            {showSuccess(data.success)}
            {showCheckout()}
        </div>
    )
};

export default Checkout;