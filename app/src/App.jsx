import React, { Component, lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import AboutPreview from "./components/AboutPreview";
import CertificatesPreview from "./components/CertificatesPreview";
import MainLayout from "./layouts/mainLayout";
import ContactPreview from "./components/ContactPreview2";
import ProjectPreview from "./components/ProjectPreview";
import PageTransition6Clean from "./components/PageTransition6Clean";
import Hero3 from "./components/Hero3";
import CustomCursor from "./components/CustomCursor";
import SeoManager from "./seo/SeoManager";

const About = lazy(() => import("./components/About"));
const Projects = lazy(() => import("./components/Projects"));
const Certificates = lazy(() => import("./components/Certificates"));
const Contact = lazy(() => import("./components/Contact"));
const NotFound = lazy(() => import("./components/NotFound"));

const RouteFallback = () => (
  <div
    role="status"
    aria-label="Loading page"
    style={{ minHeight: "100svh" }}
  />
);

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
  const location = useLocation();

  return (
    <MainLayout>
      <SeoManager />
      <CustomCursor />
      <Navbar />
      <ScrollToTop />
      {/* ═══ VARIANTS ═══════════════════════════════════════ */}
      {/* INTRO: pulse | typewriter | cards | particles | countdown | random */}
      {/* TRANSITION: slide-strips | curtain-reveal | flip-card | radial-expand */}
      {/* ═══════════════════════════════════════════════════════ */}
      <PageTransition6Clean variant="slide-strips" introVariant="random">
        <Suspense fallback={<RouteFallback />}>
          <Routes location={location}>
            <Route
              path="/"
              element={
                <div className="mt-5">
                  <Hero3 />
                  <AboutPreview />
                  <ProjectPreview />
                  <CertificatesPreview />
                  <ContactPreview />
                </div>
              }
            />
            <Route path="/about" element={<About />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/certificates" element={<Certificates />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </PageTransition6Clean>
      <Footer />
    </MainLayout>
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
