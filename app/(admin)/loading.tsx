"use client";

import React from 'react';
import {Circles} from "react-loader-spinner";

function Loading() {
    return (
        <div className="flex justify-center items-center h-screen w-full">
            <Circles
                height="140"
                width="140"
                color="#F03D52"
                ariaLabel="circles-loading"
                wrapperStyle={{}}
                wrapperClass=""
                visible={true}
            />
        </div>
    );
}

export default Loading;