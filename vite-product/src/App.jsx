import Home from "./pages/Home";
import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import Layout from "./pages/Layout";
import Dashboard from "./pages/Dashboard";
import ResumeBuilder from "./pages/ResumeBuilder";
import Preview from "./pages/Preview";
import Contact from "./pages/Contact";

import { useDispatch } from "react-redux";
import api from "./configs/api";
import { login, setLoading } from "./app/features/authSlice";
import { Toaster } from "react-hot-toast";

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const getUserData = async () => {
      const token = localStorage.getItem("token");

      try {
        if (token) {
          const { data } = await api.get("/users/data", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (data.user) {
            dispatch(login({ token, user: data.user }));
          }
        }
      } catch {
        localStorage.removeItem("token");
      } finally {
        dispatch(setLoading(false));
      }
    };

    getUserData();
  }, [dispatch]);

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3200,
          style: {
            background: "var(--vintage-paper)",
            color: "var(--vintage-walnut)",
            border: "1px solid var(--vintage-border)",
            borderRadius: "18px",
            boxShadow: "0 18px 50px rgba(83, 43, 43, 0.12)",
            padding: "14px 16px",
          },
          success: {
            iconTheme: {
              primary: "#EEBB22",
              secondary: "#FFFDFE",
            },
          },
          error: {
            iconTheme: {
              primary: "#4B8A7E",
              secondary: "#FFFDFE",
            },
          },
        }}
      />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="contact" element={<Contact />} />

        <Route path="app" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="builder/:resumeId" element={<ResumeBuilder />} />
        </Route>

        <Route path="view/:resumeId" element={<Preview />} />
      </Routes>
    </>
  );
};

export default App;
