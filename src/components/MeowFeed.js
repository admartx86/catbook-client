import React from "react";
import { usePersistedUser } from "./usePersistedUser";

const MeowFeed = () => {
    
    usePersistedUser();
    
    return(
        <div>
        <p>meow (placeholder)</p>
        <p>meow (placeholder)</p>
        <p>meow (placeholder)</p>
        </div>
    );
}

export default MeowFeed;