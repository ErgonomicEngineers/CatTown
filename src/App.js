import React from "react";
import { createHashRouter, RouterProvider } from "react-router-dom";
import CatTownPage from "./pages/CatTownPage";

// define your route tree
const router = createHashRouter([
  {
    path: "/",
    element: <CatTownPage />,
  },
  // …add more routes here…
]);

function App() {
  // RouterProvider will render the matching route element
  return <RouterProvider router={router} />;
}

export default App;
