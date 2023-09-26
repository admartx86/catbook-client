import React from "react";
import ReactDOM from "react-dom";
import { Routes, Route } from "react-router-dom";


import { Provider } from "react-redux";
import { store } from "../store";

import MyAccount from "./MyAccount";
import Home from "./Home";
import Explore from "./Explore";
import Notifications from "./Notifications";
import Messages from "./Messages";
import Profile from "./Profile";
import ComposeMeow from "./ComposeMeow";

import Navigation from "./Navigation";

import ScrollToTop from "./ScrollToTop";


const App = () => {
    return( 
        <div>
            <Provider store={store}>
           
            <ScrollToTop />
            

           
            <Navigation />

            <Routes>
            <Route path="/myaccount" element={<MyAccount />} />
              <Route path="/" element={<Home />} />
              <Route path="/home" element={<Home />} />
              <Route path="/explore" element={<Explore />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/messages" element={<Messages />} />
                {/* <Route path="/messages/:id" element={<Messages />} /> */}
              <Route path="/profile" element={<Profile />} />
              {/* <Route path="/profile/:id" element={<Profile />} /> */}
              <Route path="/compose/meow" element={<ComposeMeow/>} />
              <Route path="*" element={<h1>404 Not Found</h1>} />
              
            </Routes>
            </Provider>
        </div>
        
    );
}

export default App;