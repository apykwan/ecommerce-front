import React, { useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import moment from 'moment';

import { addItem, updateItem, removeItem } from './cartHelpers';
import ShowImage from './ShowImage';

const Card = ({ 
    product, 
    showViewProductButton = true, 
    showAddToCartButton = true, 
    cartUpdate = false,
    showRemoveProductButton = false,
    setRun = f => f,
    run = undefined
}) => {
    const [redirect, setRedirect] = useState(false);
    const [count, setCount] = useState(product.count);

    const showViewButton = () => {
        return (
            showViewProductButton && (
                <Link to={`/product/${product._id}`}>
                    <button className="btn btn-outline-primary mt-2 mb-2 mr-2">
                        View Product
                    </button>
                </Link>
            )
        )
    };

    const AddToCart = () => {
        addItem(product, setRedirect(true));
    };

    const showRemoveButton = showRemoveProductButton => {
        return (
            showRemoveProductButton && (
                <button
                    className="btn btn-outline-danger mt-2 mb-2"
                    onClick={() => {
                        removeItem(product._id);
                        setRun(!run);
                    }}
                >
                    Remove Item
                </button>
            )
        )
    };

    const shouldRedirect = redirect => {
        if (redirect) {
            return <Redirect to="/cart" />;
        }
    };

    const showAddToCart = showAddToCartButton => {
        return(
            showAddToCartButton && (
                <button
                    className="btn btn-outline-warning mt-2 mb-2"
                    onClick={AddToCart}
                >
                    Add To Cart
                </button>
            )
        )
    };

    const handleChange = productId => event => {
        setRun(!run);
        setCount(event.target.value < 1 ? 1: event.target.value);
        if(event.target.value >= 1) {
            updateItem(productId, event.target.value);
        }
    }

    const showCartUpdateOptions = cartUpdate => {
        return cartUpdate && (
            <div>
                <div className="input-group mb-3">
                    <div className="input-gruop-prepend">
                        <span className="input-group-text">Adjust Quantity</span>
                    </div>
                    <input 
                        type="number" 
                        className="form-control" 
                        value={count} 
                        onChange={handleChange(product._id)}
                    />
                </div>
            </div>
        )
    }

    const showStock = quantity => {
        return quantity > 0 
            ? <span className="bdge badge-primary badge-pill">In Stock</span> 
            : <span className="bdge badge-primary badge-pill">Out of Stock</span>
    }

    return (
        <div className="card">
            <div className="card-header name">{product.name}</div>
            <div className="card-body">
                {shouldRedirect(redirect)}
                <ShowImage item={product} url="product" />
                <p className="lead mt-2">
                    {product.description.substring(0, 100)}
                </p>
                <p className="black-10">${product.price}</p>
                <p className="black-9">
                    Category: {product.category && product.category.name}
                </p>
                <p className="black-9">
                    Added on {moment(product.createdAt).fromNow()}
                </p>
                {showStock(product.quantity)}
                <br />
                {showViewButton(showViewProductButton)}
                {showAddToCart(showAddToCartButton)}
                {showRemoveButton(showRemoveProductButton)}
                {showCartUpdateOptions(cartUpdate)}
            </div>
        </div>
    )
};

export default Card;