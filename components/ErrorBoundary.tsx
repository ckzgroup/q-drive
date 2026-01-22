"use client";

import React from "react";

class ErrorBoundary extends React.Component {
    constructor(props: any) {
        super(props)

        // Define a state variable to track whether is an error or not
        this.state = { hasError: false }
    }
    static getDerivedStateFromError(error: any) {
        // Update state so the next render will show the fallback UI

        return { hasError: true }
    }
    componentDidCatch(error: any, errorInfo: any) {
        // You can use your own error logging service here
        console.log({ error, errorInfo })
    }
    render() {
        // Check if the error is thrown
        // @ts-ignore
        if (this.state.hasError) {
            // You can render any custom fallback UI
            return (
                <div>

                    <main className="h-screen w-full flex flex-col justify-center items-center bg-[#1A2238]">
                        <h1 className="text-9xl font-extrabold text-white tracking-widest">500</h1>
                        <div className="bg-[#FF6A3D] px-2 text-sm rounded rotate-12 absolute">
                            Internal Server Error
                        </div>
                        <button className="mt-5">
                            <a
                                className="relative inline-block text-sm font-medium text-[#FF6A3D] group active:text-orange-500 focus:outline-none focus:ring"
                            >
        <span
            className="absolute inset-0 transition-transform translate-x-0.5 translate-y-0.5 bg-[#FF6A3D] group-hover:translate-y-0 group-hover:translate-x-0"
        ></span>

                                <span >
           <button
               className="relative block px-8 py-3 bg-[#1A2238] border border-current"
               type="button"
               onClick={() => this.setState({hasError: false})}
           >
                        Try again?
                    </button>
        </span>
                            </a>
                        </button>
                    </main>
                </div>
            )
        }

        // Return children components in case of no error

        // @ts-ignore
        return this.props.children
    }
}

export default ErrorBoundary