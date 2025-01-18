import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    const navStyle = {
        padding: '10px',
        backgroundColor: '#333',
        color: '#fff',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
    };

    const linkStyle = {
        textDecoration: 'none',
        color: '#fff',
        fontSize: '18px',
    };

    return (
        <nav style={navStyle}>
            <Link style={linkStyle} to="/">Home</Link>
            <Link style={linkStyle} to="/game-details">Game Details</Link>
            <Link style={linkStyle} to="/simulations">Simulations</Link>
        </nav>
    );
};

export default Navbar;