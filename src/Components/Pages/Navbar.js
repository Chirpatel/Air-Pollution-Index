import React from 'react'
import './Navbar.css'
function Navbar() {
    return (
        <div className="navbar">
            <div className="navbar-logo">
                <p onClick={()=>{window.location='/'}}>Air Pollution Index (India)</p>
            </div>
        </div>
    )
}

export default Navbar
