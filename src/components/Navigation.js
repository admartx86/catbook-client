import React from "react";
import { Link } from "react-router-dom";
import { usePersistedUser } from "./usePersistedUser";


const Navigation = () => {
    usePersistedUser();
    
    return(
        <div>
            <Link to="/myaccount">My Account</Link>
        <Link to="/home">Home</Link>
        <Link to="/explore">Explore</Link>
        <Link to="/notifications">Notifications</Link>
        <Link to="/messages">Messages</Link>
        <Link to="/profile">Profile</Link>

        </div>
    );
}

export default Navigation;