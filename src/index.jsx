import React from "react";
import { RouterProvider } from "react-router-dom";
import { createRoot } from "react-dom/client";
import { ContentfulLivePreview } from "@contentful/live-preview";
import { router } from "./router";

ContentfulLivePreview.init({ locale: navigator.language });

const root = createRoot(document.querySelector(".wrapper"));
root.render(<RouterProvider router={router} />);
