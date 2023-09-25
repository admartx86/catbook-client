import React from "react";
import { Link } from "react-router-dom";
import Home from "./Home";
import Explore from "./Explore";
import Notifications from "./Notifications";
import Messages from "./Messages";
import Profile from "./Profile";
import Meow from "./Meow";

const Navigation = () => {
    return(
        <div>
        <h1>Navigation</h1>
        <Link to="/home">Home</Link>
        <Link to="/explore">Explore</Link>
        <Link to="/notifications">Notifications</Link>
        <Link to="/messages">Messages</Link>
        <Link to="/profile">Profile</Link>
        <Link to="/meow">Meow</Link>
        </div>
    );
}

export default Navigation;