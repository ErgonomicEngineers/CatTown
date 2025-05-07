import React from "react";
import { createHashRouter, RouterProvider } from "react-router-dom";
import CatTownPage from "./pages/CatTownPage";
import CenteredPreviewPage from "./pages/CenteredPreviewPage";
import UserSessionPage from "./pages/UserSessionPage";
import VideoPosturePage from "./pages/VideoPosturePage";

// define your route tree
const router = createHashRouter([
  {
    path: "/",
    element: <UserSessionPage />,
  },

  {
    path: "/townpreview",
    element: <CenteredPreviewPage />,
  },

  {
    path: "/cattown",
    element: <CatTownPage />,
  },

  {
    path: "/videoposture",
    element: <VideoPosturePage />,
  },

  // …add more routes here…
]);

function App() {
  // RouterProvider will render the matching route element
  return <RouterProvider router={router} />;
}

export default App;
