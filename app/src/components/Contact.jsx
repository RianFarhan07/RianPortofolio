// Contact.jsx
"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import {
  Send,
  Phone,
  Mail,
  MapPin,
  Linkedin,
  Github,
  Twitter,
  Loader2,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";

export default function Contact() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const formRef = useRef(null);
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [formStatus, setFormStatus] = useState(null); // null, 'submitting', 'success', 'error'
  const [errors, setErrors] = useState({});

  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  // Contact information data
  const contactInfo = [
    {
      icon: <Phone size={20} />,
      title: "Phone",
      value: "+1 (555) 123-4567",
      link: "tel:+15551234567",
    },
    {
      icon: <Mail size={20} />,
      title: "Email",
      value: "contact@example.com",
      link: "mailto:contact@example.com",
    },
    {
      icon: <MapPin size={20} />,
      title: "Location",
      value: "San Francisco, CA",
      link: "https://maps.google.com/?q=San+Francisco,+CA",
    },
  ];

  // Social media links
  const socialLinks = [
    {
      icon: <Linkedin size={20} />,
      name: "LinkedIn",
      url: "https://linkedin.com/in/username",
    },
    {
      icon: <Github size={20} />,
      name: "GitHub",
      url: "https://github.com/username",
    },
    {
      icon: <Twitter size={20} />,
      name: "Twitter",
      url: "https://twitter.com/username",
    },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState({
      ...formState,
      [name]: value,
    });

    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null,
      });
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formState.name.trim()) newErrors.name = "Name is required";
    if (!formState.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formState.email)) {
      newErrors.email = "Email is invalid";
    }
    if (!formState.subject.trim()) newErrors.subject = "Subject is required";
    if (!formState.message.trim()) newErrors.message = "Message is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setFormStatus("submitting");

    // Simulate API call
    try {
      // In a real app, you would send the form data to your backend
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setFormStatus("success");
      setFormState({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
      // Reset form after 3 seconds
      setTimeout(() => {
        setFormStatus(null);
      }, 3000);
    } catch (error) {
      console.error("Form submission error:", error);
      setFormStatus("error");
      setTimeout(() => {
        setFormStatus(null);
      }, 3000);
    }
  };

  return (
    <section
      id="contact"
      className={`py-16 md:py-24 ${
        isDark ? "bg-bgDark" : "bg-bgLight"
      } min-h-screen`}
      ref={ref}
    >
      {/* Background decor */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className={`absolute w-96 h-96 rounded-full blur-3xl ${
            isDark ? "bg-blue-500" : "bg-blue-300"
          } opacity-5 -top-48 -left-48`}
        />
        <div
          className={`absolute w-96 h-96 rounded-full blur-3xl ${
            isDark ? "bg-primary" : "bg-primaryInLight"
          } opacity-5 -bottom-48 -right-48`}
        />
        <div
          className={`absolute inset-0 opacity-10 ${
            isDark ? "bg-grid-white/5" : "bg-grid-black/5"
          }`}
        ></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Page Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-2 mb-4 justify-center">
            <div
              className={`h-1 w-8 md:w-12 ${
                isDark ? "bg-primary" : "bg-primaryInLight"
              } rounded-full`}
            ></div>
            <span
              className={`text-sm font-semibold uppercase tracking-wider ${
                isDark ? "text-primary" : "text-primaryInLight"
              }`}
            >
              Get In Touch
            </span>
            <div
              className={`h-1 w-8 md:w-12 ${
                isDark ? "bg-primary" : "bg-primaryInLight"
              } rounded-full`}
            ></div>
          </div>

          <h1
            className={`text-3xl sm:text-4xl md:text-5xl font-bold mb-4 ${
              isDark ? "text-white" : "text-gray-800"
            }`}
          >
            Let's{" "}
            <span
              className={`text-transparent bg-clip-text bg-gradient-to-r ${
                isDark
                  ? "from-primary to-blue-400"
                  : "from-primaryInLight to-blue-500"
              }`}
            >
              Connect
            </span>
          </h1>

          <p
            className={`max-w-2xl mx-auto text-base md:text-lg ${
              isDark ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Have a question or want to work together? Feel free to reach out
            using the form below or through any of my contact channels.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
          {/* Left side - Contact Information */}
          <motion.div
            className="lg:col-span-5"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div
              className={`p-6 md:p-8 rounded-xl ${
                isDark
                  ? "bg-gray-900/80 border border-gray-800"
                  : "bg-white/80 border border-gray-200"
              } backdrop-blur-sm shadow-lg h-full`}
            >
              <h2
                className={`text-xl md:text-2xl font-bold mb-6 ${
                  isDark ? "text-white" : "text-gray-800"
                }`}
              >
                Contact Information
              </h2>

              {/* Contact Details */}
              <div className="space-y-6 mb-8">
                {contactInfo.map((item, index) => (
                  <motion.a
                    key={index}
                    href={item.link}
                    target={item.title === "Location" ? "_blank" : undefined}
                    rel={
                      item.title === "Location"
                        ? "noopener noreferrer"
                        : undefined
                    }
                    className={`flex items-start gap-4 group ${
                      isDark ? "text-gray-300" : "text-gray-700"
                    } hover:opacity-80 transition-opacity`}
                    whileHover={{ x: 5 }}
                  >
                    <div
                      className={`p-3 rounded-full ${
                        isDark
                          ? "bg-gray-800 text-primary"
                          : "bg-gray-100 text-primaryInLight"
                      }`}
                    >
                      {item.icon}
                    </div>
                    <div>
                      <h3
                        className={`text-sm font-semibold mb-1 ${
                          isDark ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        {item.title}
                      </h3>
                      <p
                        className={`text-base font-medium ${
                          isDark ? "text-white" : "text-gray-800"
                        } group-hover:underline`}
                      >
                        {item.value}
                      </p>
                    </div>
                  </motion.a>
                ))}
              </div>

              {/* Divider */}
              <div
                className={`my-8 h-px ${
                  isDark ? "bg-gray-800" : "bg-gray-200"
                }`}
              ></div>

              {/* Social Links */}
              <div>
                <h2
                  className={`text-xl font-bold mb-4 ${
                    isDark ? "text-white" : "text-gray-800"
                  }`}
                >
                  Connect With Me
                </h2>

                <div className="flex flex-wrap gap-3">
                  {socialLinks.map((social, index) => (
                    <motion.a
                      key={index}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                        isDark
                          ? "bg-gray-800 hover:bg-gray-700 text-white"
                          : "bg-gray-100 hover:bg-gray-200 text-gray-800"
                      } transition-colors`}
                      whileHover={{ y: -3 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {social.icon}
                      <span className="text-sm font-medium">{social.name}</span>
                    </motion.a>
                  ))}
                </div>
              </div>

              {/* Office Hours */}
              <div className="mt-8">
                <h3
                  className={`text-sm font-semibold mb-2 ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Business Hours
                </h3>
                <p className={`${isDark ? "text-gray-300" : "text-gray-700"}`}>
                  Monday - Friday: 9:00 AM - 6:00 PM
                </p>
                <p className={`${isDark ? "text-gray-300" : "text-gray-700"}`}>
                  Saturday & Sunday: Closed
                </p>
              </div>
            </div>
          </motion.div>

          {/* Right side - Contact Form */}
          <motion.div
            className="lg:col-span-7"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div
              className={`p-6 md:p-8 rounded-xl ${
                isDark
                  ? "bg-gray-900/80 border border-gray-800"
                  : "bg-white/80 border border-gray-200"
              } backdrop-blur-sm shadow-lg h-full`}
            >
              <h2
                className={`text-xl md:text-2xl font-bold mb-6 ${
                  isDark ? "text-white" : "text-gray-800"
                }`}
              >
                Send Me a Message
              </h2>

              <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name Field */}
                  <div className="space-y-2">
                    <label
                      htmlFor="name"
                      className={`block text-sm font-medium ${
                        isDark ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Your Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formState.name}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-lg ${
                        isDark
                          ? "bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                          : "bg-white border-gray-300 text-gray-900 placeholder:text-gray-400"
                      } border focus:ring-2 ${
                        isDark
                          ? "focus:ring-primary/50 focus:border-primary"
                          : "focus:ring-primaryInLight/50 focus:border-primaryInLight"
                      } outline-none transition-all ${
                        errors.name
                          ? isDark
                            ? "border-red-500 focus:border-red-500 focus:ring-red-500/50"
                            : "border-red-500 focus:border-red-500 focus:ring-red-500/50"
                          : ""
                      }`}
                      placeholder="John Doe"
                      disabled={formStatus === "submitting"}
                    />
                    {errors.name && (
                      <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                    )}
                  </div>

                  {/* Email Field */}
                  <div className="space-y-2">
                    <label
                      htmlFor="email"
                      className={`block text-sm font-medium ${
                        isDark ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Your Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formState.email}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-lg ${
                        isDark
                          ? "bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                          : "bg-white border-gray-300 text-gray-900 placeholder:text-gray-400"
                      } border focus:ring-2 ${
                        isDark
                          ? "focus:ring-primary/50 focus:border-primary"
                          : "focus:ring-primaryInLight/50 focus:border-primaryInLight"
                      } outline-none transition-all ${
                        errors.email
                          ? isDark
                            ? "border-red-500 focus:border-red-500 focus:ring-red-500/50"
                            : "border-red-500 focus:border-red-500 focus:ring-red-500/50"
                          : ""
                      }`}
                      placeholder="name@example.com"
                      disabled={formStatus === "submitting"}
                    />
                    {errors.email && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.email}
                      </p>
                    )}
                  </div>
                </div>

                {/* Subject Field */}
                <div className="space-y-2">
                  <label
                    htmlFor="subject"
                    className={`block text-sm font-medium ${
                      isDark ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formState.subject}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-lg ${
                      isDark
                        ? "bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                        : "bg-white border-gray-300 text-gray-900 placeholder:text-gray-400"
                    } border focus:ring-2 ${
                      isDark
                        ? "focus:ring-primary/50 focus:border-primary"
                        : "focus:ring-primaryInLight/50 focus:border-primaryInLight"
                    } outline-none transition-all ${
                      errors.subject
                        ? isDark
                          ? "border-red-500 focus:border-red-500 focus:ring-red-500/50"
                          : "border-red-500 focus:border-red-500 focus:ring-red-500/50"
                        : ""
                    }`}
                    placeholder="What would you like to discuss?"
                    disabled={formStatus === "submitting"}
                  />
                  {errors.subject && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.subject}
                    </p>
                  )}
                </div>

                {/* Message Field */}
                <div className="space-y-2">
                  <label
                    htmlFor="message"
                    className={`block text-sm font-medium ${
                      isDark ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formState.message}
                    onChange={handleChange}
                    rows={6}
                    className={`w-full px-4 py-3 rounded-lg ${
                      isDark
                        ? "bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                        : "bg-white border-gray-300 text-gray-900 placeholder:text-gray-400"
                    } border focus:ring-2 ${
                      isDark
                        ? "focus:ring-primary/50 focus:border-primary"
                        : "focus:ring-primaryInLight/50 focus:border-primaryInLight"
                    } outline-none transition-all resize-none ${
                      errors.message
                        ? isDark
                          ? "border-red-500 focus:border-red-500 focus:ring-red-500/50"
                          : "border-red-500 focus:border-red-500 focus:ring-red-500/50"
                        : ""
                    }`}
                    placeholder="Type your message here..."
                    disabled={formStatus === "submitting"}
                  ></textarea>
                  {errors.message && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.message}
                    </p>
                  )}
                </div>

                {/* Form Status Message */}
                <AnimatePresence>
                  {formStatus === "success" && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className={`flex items-center gap-2 p-4 rounded-lg bg-green-500/20 text-green-500 border border-green-500/30`}
                    >
                      <CheckCircle size={18} />
                      <span>Message sent successfully! I'll respond soon.</span>
                    </motion.div>
                  )}

                  {formStatus === "error" && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className={`flex items-center gap-2 p-4 rounded-lg bg-red-500/20 text-red-500 border border-red-500/30`}
                    >
                      <AlertCircle size={18} />
                      <span>
                        Failed to send message. Please try again later.
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={formStatus === "submitting"}
                  className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg ${
                    isDark
                      ? "bg-primary text-white hover:bg-primary/90"
                      : "bg-primaryInLight text-white hover:bg-primaryInLight/90"
                  } transition-colors font-medium text-sm disabled:opacity-70`}
                >
                  {formStatus === "submitting" ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send size={18} />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
