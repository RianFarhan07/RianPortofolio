import React, { useState } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { ThemeProvider } from "./context/ThemeContext";
import PageTransition from "./components/PageTransition";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Projects from "./components/Projects";
import Certificates from "./components/Certificates";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import ProjectDialog from "./components/ProjectDialog";
import ScrollToTop from "./components/ScrollToTop";

const AppContent = () => {
  const [selectedProject, setSelectedProject] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const location = useLocation();

  const openProjectDialog = (project) => {
    setSelectedProject(project);
    setIsDialogOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeProjectDialog = () => {
    setIsDialogOpen(false);
    document.body.style.overflow = "auto";
  };

  return (
    <>
      <Navbar />
      <ScrollToTop />
      <PageTransition>
        <Routes location={location}>
          <Route
            path="/"
            element={
              <>
                <Hero />
                <About />
                <Projects openProjectDialog={openProjectDialog} />
                <Certificates />
                <Contact />
              </>
            }
          />
          <Route path="/about" element={<About fullPage />} />
          <Route
            path="/projects"
            element={
              <Projects openProjectDialog={openProjectDialog} fullPage />
            }
          />
          <Route path="/certificates" element={<Certificates fullPage />} />
          <Route path="/contact" element={<Contact fullPage />} />
        </Routes>
      </PageTransition>
      <Footer />

      <AnimatePresence>
        {isDialogOpen && (
          <ProjectDialog
            project={selectedProject}
            onClose={closeProjectDialog}
          />
        )}
      </AnimatePresence>
    </>
  );
};

const App = () => {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
