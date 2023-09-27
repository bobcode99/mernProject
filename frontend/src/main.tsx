import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
// import Counter from "./Counter.tsx";
// import FilterableProductTable, { PRODUCTS } from "./FilterableProductTable.tsx";
import FilterableLimitTable from "./FilterableLimitTable";

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        {/* <App /> */}
        {/* <Counter /> */}
        {/* <FilterableProductTable products={PRODUCTS} /> */}
        <FilterableLimitTable />
    </React.StrictMode>
);
