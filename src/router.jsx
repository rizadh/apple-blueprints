import React from "react";
import { createBrowserRouter } from "react-router-dom";
import { ProductPage } from "./ProductPage";
import { App } from "./App";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/product/:product",
        element: <ProductPage />,
      },
    ],
  },
]);
