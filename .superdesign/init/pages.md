# Page Dependency Trees

## / (Home)

Entry: `app/src/App.jsx`

Dependencies:
- `app/src/layouts/MainLayout.jsx`
- `app/src/components/CustomCursor.jsx`
- `app/src/components/Navbar.jsx`
- `app/src/components/ScrollToTop.jsx`
- `app/src/components/PageTransition6Clean.jsx`
- `app/src/components/Hero3.jsx`
- `app/src/components/AboutPreview.jsx`
  - `app/src/context/ThemeContext.jsx`
  - `app/src/assets/foto-nobg.webp`
- `app/src/components/ProjectPreview.jsx`
- `app/src/components/CertificatesPreview.jsx`
- `app/src/components/ContactPreview2.jsx`
- `app/src/components/Footer.jsx`
## /about

Entry: `app/src/components/About.jsx`

Dependencies:
- `app/src/context/ThemeContext.jsx`
- `app/src/components/Navbar.jsx`
- `app/src/layouts/MainLayout.jsx`
- `app/src/components/Footer.jsx`

## /projects

Entry: `app/src/components/Projects.jsx`

Dependencies:
- `app/src/context/ThemeContext.jsx`
- `app/src/components/ProjectDialog.jsx`
- `app/src/components/Navbar.jsx`
- `app/src/layouts/MainLayout.jsx`
- `app/src/components/Footer.jsx`

## /certificates

Entry: `app/src/components/Certificates.jsx`

Dependencies:
- `app/src/context/ThemeContext.jsx`
- `app/src/components/CertificateModal.jsx`
- `app/src/components/Navbar.jsx`
- `app/src/layouts/MainLayout.jsx`
- `app/src/components/Footer.jsx`

## /contact

Entry: `app/src/components/Contact.jsx`

Dependencies:
- `app/src/context/ThemeContext.jsx`
- `app/src/components/Navbar.jsx`
- `app/src/layouts/MainLayout.jsx`
- `app/src/components/Footer.jsx`
