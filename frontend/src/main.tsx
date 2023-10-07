import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import Root from "./routes/root";
// import Counter from "./Counter.tsx";
// import FilterableProductTable, { PRODUCTS } from "./FilterableProductTable.tsx";
// import FilterableLimitTable from "./FilterableLimitTable";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ErrorPage from "./errorPage.tsx";
import { Logs } from "./routes/Logs.tsx";
import { Combinations } from "./routes/Combinations.tsx";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Root />,
        errorElement: <ErrorPage />,
        children: [
            {
                // Add this route for '/'
                index: true,
                element: <Combinations />,
            },
            {
                path: "/logs",
                element: <Logs />,
            },
        ],
    },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
);
