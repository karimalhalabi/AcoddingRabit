import React from "react";
import { createRoot } from "react-dom/client";
import { Toaster } from "react-hot-toast";
import { AppProvider, useApp } from "./context/AppContext.jsx";
import AppLayout from "./components/AppLayout/AppLayout.jsx";
import HomePage from "./pages/HomePage/HomePage.jsx";
import SetupPage from "./pages/SetupPage/SetupPage.jsx";
import ImportPage from "./pages/ImportPage/ImportPage.jsx";
import AboutPage from "./pages/AboutPage/AboutPage.jsx";
import AuthPage from "./pages/AuthPage/AuthPage.jsx";
import "./styles.css";
function App() {
  const { page } = useApp();
  const Page =
    {
      home: HomePage,
      setup: SetupPage,
      import: ImportPage,
      about: AboutPage,
      auth: AuthPage,
    }[page] || HomePage;
  return (
    <AppLayout>
      <Page />
      <Toaster
        position="bottom-center"
        toastOptions={{
          style: {
            fontFamily: "inherit",
            fontSize: 13,
            borderRadius: 12,
            maxWidth: 500,
          },
        }}
      />
    </AppLayout>
  );
}
createRoot(document.getElementById("root")).render(
  <AppProvider>
    <App />
  </AppProvider>,
);
