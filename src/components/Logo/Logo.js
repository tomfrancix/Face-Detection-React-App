import React from 'react';
import Tilt from 'react-tilt';
import './Logo.css';
const Logo = () => {
    return(
        <div className="ma4 mt0">
            <Tilt className="Tilt br2 shadow-2" options={{ max : 25 }} style={{ height: 250, width: 250 }} >
                <span className="Tilt-inner" role="img" aria-label="adfadf"> 👽 </span>
                <h4 className="white fs5">Face Recognition App</h4>
            </Tilt>
        </div>
    );
}
export default Logo;