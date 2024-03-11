import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import "./bootstrap.scss";
import APP_ROUTES from "./routes";
import { RouterProvider, createBrowserRouter } from 'react-router-dom';


// URL from which the application is served. All BrowserRouter URLs are
// relative to this location.
const router = createBrowserRouter([
  { element: <App />, children: APP_ROUTES },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
