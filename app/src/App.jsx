import React, { Component, useState } from "react";
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
import AboutPreview from "./components/AboutPreview";
import ProjectPreview from "./components/ProjectPreview";
import CertificatesPreview from "./components/CertificatesPreview";
import MainLayout from "./layouts/mainLayout";
import ContactPreview from "./components/ContactPreview";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.log(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong. Please refresh the page.</h1>;
    }

    return this.props.children;
  }
}

// Kemudian gunakan pada komponen utama:
// <ErrorBoundary>
//   <About />
// </ErrorBoundary>

const AppContent = () => {
  // const [selectedProject, setSelectedProject] = useState(null);
  // const [isDialogOpen, setIsDialogOpen] = useState(false);
  const location = useLocation();

  // const openProjectDialog = (project) => {
  //   setSelectedProject(project);
  //   setIsDialogOpen(true);
  //   document.body.style.overflow = "hidden";
  // };

  // const closeProjectDialog = () => {
  //   setIsDialogOpen(false);
  //   document.body.style.overflow = "auto";
  // };

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
                <AboutPreview />
                <ProjectPreview />
                <CertificatesPreview />
                <ContactPreview />
              </>
            }
          />
          <Route path="/about" element={<About />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/certificates" element={<Certificates />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </PageTransition>
      <Footer />

      {/* <AnimatePresence>
        {isDialogOpen && (
          <ProjectDialog
            project={selectedProject}
            onClose={closeProjectDialog}
          />
        )}
      </AnimatePresence> */}
    </>
  );
};

const App = () => {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default App;
