// ContactPreview.jsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import {
  Send,
  Phone,
  Mail,
  MapPin,
  Linkedin,
  Github,
  Twitter,
  ArrowRight,
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { Link } from "react-router-dom";

export default function ContactPreview() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [subscribeStatus, setSubscribeStatus] = useState(null);

  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
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
      icon: <Linkedin size={18} />,
      name: "LinkedIn",
      url: "https://linkedin.com/in/username",
    },
    {
      icon: <Github size={18} />,
      name: "GitHub",
      url: "https://github.com/username",
    },
    {
      icon: <Twitter size={18} />,
      name: "Twitter",
      url: "https://twitter.com/username",
    },
  ];

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setEmailError("");
  };

  const handleSubscribe = async (e) => {
    e.preventDefault();

    // Simple email validation
    if (!email.trim()) {
      setEmailError("Email is required");
      return;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Please enter a valid email");
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setSubscribeStatus("success");
      setEmail("");
      setTimeout(() => {
        setSubscribeStatus(null);
      }, 3000);
    } catch (error) {
      setSubscribeStatus("error");
      setTimeout(() => {
        setSubscribeStatus(null);
      }, 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  return (
    <section
      id="contact-preview"
      className={`py-16 md:py-24 relative overflow-hidden ${
        isDark
          ? "bg-gradient-to-br from-bgDark via-gray-800/50 to-bgDark"
          : "bg-gradient-to-br from-bgLight via-blue-50/50 to-bgLight"
      }`}
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
        {/* Section Header */}
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

          <h2
            className={`text-2xl sm:text-3xl md:text-4xl font-bold ${
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
          </h2>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 lg:grid-cols-12 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {/* Quick Contact Info */}
          <motion.div
            className="lg:col-span-4 space-y-6"
            variants={itemVariants}
          >
            {contactInfo.map((item, index) => (
              <motion.a
                key={index}
                href={item.link}
                target={item.title === "Location" ? "_blank" : undefined}
                rel={
                  item.title === "Location" ? "noopener noreferrer" : undefined
                }
                whileHover={{ x: 5 }}
                className={`flex items-center gap-4 p-4 rounded-lg ${
                  isDark
                    ? "bg-gray-900/80 border border-gray-800 hover:bg-gray-800/80"
                    : "bg-white/80 border border-gray-200 hover:bg-gray-50/80"
                } transition-colors backdrop-blur-sm group`}
              >
                <div
                  className={`p-3 rounded-full ${
                    isDark
                      ? "bg-gray-800 text-primary group-hover:bg-primary/20"
                      : "bg-gray-100 text-primaryInLight group-hover:bg-primaryInLight/20"
                  } transition-colors`}
                >
                  {item.icon}
                </div>
                <div>
                  <h3
                    className={`text-sm font-medium ${
                      isDark ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {item.title}
                  </h3>
                  <p
                    className={`text-base font-semibold ${
                      isDark ? "text-white" : "text-gray-800"
                    }`}
                  >
                    {item.value}
                  </p>
                </div>
              </motion.a>
            ))}
          </motion.div>

          {/* Newsletter Subscription */}
          <motion.div className="lg:col-span-8" variants={itemVariants}>
            <div
              className={`p-6 rounded-lg ${
                isDark
                  ? "bg-gray-900/80 border border-gray-800"
                  : "bg-white/80 border border-gray-200"
              } backdrop-blur-sm h-full`}
            >
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-6">
                <div>
                  <h3
                    className={`text-xl font-bold mb-2 ${
                      isDark ? "text-white" : "text-gray-800"
                    }`}
                  >
                    Stay Updated
                  </h3>
                  <p
                    className={`${
                      isDark ? "text-gray-400" : "text-gray-600"
                    } text-sm`}
                  >
                    Subscribe to my newsletter for updates on new projects and
                    content.
                  </p>
                </div>

                <div className="flex gap-2">
                  {socialLinks.map((social, index) => (
                    <motion.a
                      key={index}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ y: -3 }}
                      whileTap={{ scale: 0.95 }}
                      className={`p-2 rounded-full ${
                        isDark
                          ? "bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white"
                          : "bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800"
                      } transition-colors`}
                    >
                      {social.icon}
                    </motion.a>
                  ))}
                </div>
              </div>

              <form onSubmit={handleSubscribe} className="space-y-4">
                <div
                  className={`flex flex-col sm:flex-row gap-3 ${
                    subscribeStatus === "success" || subscribeStatus === "error"
                      ? "opacity-50 pointer-events-none"
                      : ""
                  }`}
                >
                  <div className="flex-1 relative">
                    <input
                      type="email"
                      value={email}
                      onChange={handleEmailChange}
                      placeholder="Your email address"
                      className={`w-full px-4 py-3 rounded-lg ${
                        isDark
                          ? "bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                          : "bg-white border-gray-300 text-gray-900 placeholder:text-gray-400"
                      } border focus:ring-2 ${
                        isDark
                          ? "focus:ring-primary/50 focus:border-primary"
                          : "focus:ring-primaryInLight/50 focus:border-primaryInLight"
                      } outline-none transition-all ${
                        emailError
                          ? isDark
                            ? "border-red-500 focus:border-red-500 focus:ring-red-500/50"
                            : "border-red-500 focus:border-red-500 focus:ring-red-500/50"
                          : ""
                      }`}
                      disabled={isSubmitting}
                    />
                    {emailError && (
                      <p className="text-red-500 text-xs absolute -bottom-5 left-0">
                        {emailError}
                      </p>
                    )}
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`px-6 py-3 rounded-lg ${
                      isDark
                        ? "bg-primary text-white hover:bg-primary/90"
                        : "bg-primaryInLight text-white hover:bg-primaryInLight/90"
                    } transition-colors font-medium text-sm disabled:opacity-70 flex items-center justify-center gap-2 sm:w-auto w-full`}
                  >
                    {isSubmitting ? (
                      "Subscribing..."
                    ) : (
                      <>
                        Subscribe <ArrowRight size={16} />
                      </>
                    )}
                  </button>
                </div>

                {subscribeStatus === "success" && (
                  <div
                    className={`flex items-center gap-2 p-4 rounded-lg ${
                      isDark
                        ? "bg-green-500/20 text-green-400 border border-green-500/30"
                        : "bg-green-100 text-green-700 border border-green-200"
                    }`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>Thanks for subscribing! You're now on the list.</span>
                  </div>
                )}

                {subscribeStatus === "error" && (
                  <div
                    className={`flex items-center gap-2 p-4 rounded-lg ${
                      isDark
                        ? "bg-red-500/20 text-red-400 border border-red-500/30"
                        : "bg-red-100 text-red-700 border border-red-200"
                    }`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>Failed to subscribe. Please try again later.</span>
                  </div>
                )}
              </form>
            </div>

            {/* Link to full contact page */}
            <motion.div
              className="mt-6 text-center lg:text-right"
              variants={itemVariants}
            >
              <Link
                to="/contact"
                className={`inline-flex items-center gap-2 font-medium ${
                  isDark
                    ? "text-primary hover:text-primary/80"
                    : "text-primaryInLight hover:text-primaryInLight/80"
                } transition-colors`}
              >
                <span>Visit full contact page</span>
                <ArrowRight size={16} />
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
