import React from "react";
import { usePersistedUser } from "./usePersistedUser";

const ComposeMeow = () => {
    usePersistedUser();
    return(
        <div>
            <div>
            
   
            <p>Profile Photo</p>
            <p>Text (What is happening?!)</p>
            <button>Media</button> <button>GIF</button> <button>Post</button>
         
            </div>
        </div>
    );
}

export default ComposeMeow;