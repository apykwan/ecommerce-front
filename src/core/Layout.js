import React from 'react';

import Menu from './Menu';
import '../styles.css';

const Layout = ({ 
    title = 'Title', 
    description = 'Description', 
    className, 
    children 
}) => (
    <div>
        <div style={{position: 'fixed', overflow: 'hidden', width: '100%', top:'0', zIndex: 5}}>
            <Menu />
        </div>
        <div className="jumbotron">
            <h2>{title}</h2>
            <p className="lead">{description}</p>
        </div>
        <div className={className}>{children}</div>
    </div>
);

export default Layout;