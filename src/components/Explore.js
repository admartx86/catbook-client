import React from "react";
import MeowFeed from "./MeowFeed";
import { usePersistedUser } from "./usePersistedUser";

const Explore = () => {
    
    usePersistedUser();
    
    return(
        <div>
            <input type="text" placeholder="Search" />
            <MeowFeed />
        </div>
       
    );
}

export default Explore;