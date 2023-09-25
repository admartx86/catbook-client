import React from "react";
import ReactDOM from "react-dom";
import { Routes, Route } from "react-router-dom";

import Home from "./Home";
import Explore from "./Explore";
import Notifications from "./Notifications";
import Messages from "./Messages";
import Profile from "./Profile";
import Meow from "./Meow";
import Navigation from "./Navigation";

const App = () => {
    return( 
        <div>
            
            
            <Navigation />

            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/home" element={<Home />} />
              <Route path="/explore" element={<Explore />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/messages" element={<Messages />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/meow" element={<Meow />} />
            </Routes>

        </div>
        
    );
}

export default App;