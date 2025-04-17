import { useState } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  MapPin,
  Phone,
  Send,
  Linkedin,
  Instagram,
  Github,
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";

export default function Contact({ fullPage = false }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [formState, setFormState] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormState({ name: "", email: "", subject: "", message: "" });

      // Reset success message after 5 seconds
      setTimeout(() => {
        setIsSubmitted(false);
      }, 5000);
    }, 1500);
  };

  const contactInfo = [
    {
      icon: (
        <Mail className={isDark ? "text-cyan-400" : "text-primary"} size={24} />
      ),
      title: "Email",
      value: "rianfarhan@example.com",
      link: "mailto:rianfarhan@example.com",
    },
    {
      icon: (
        <MapPin
          className={isDark ? "text-cyan-400" : "text-primary"}
          size={24}
        />
      ),
      title: "Location",
      value: "Jakarta, Indonesia",
      link: "https://goo.gl/maps/Jakarta",
    },
    {
      icon: (
        <Phone
          className={isDark ? "text-cyan-400" : "text-primary"}
          size={24}
        />
      ),
      title: "Phone",
      value: "+62 123 456 7890",
      link: "tel:+6212345678900",
    },
  ];

  const formControlVariants = {
    focus: {
      scale: 1.02,
      boxShadow: isDark
        ? "0 4px 20px rgba(0, 173, 181, 0.2)"
        : "0 4px 20px rgba(95, 111, 255, 0.2)",
      borderColor: isDark ? "#00adb5" : "#5F6FFF",
    },
  };

  const socialLinks = [
    {
      icon: <Github size={20} />,
      href: "https://github.com/username",
      color: isDark ? "hover:bg-gray-700" : "hover:bg-gray-200",
    },
    {
      icon: <Linkedin size={20} />,
      href: "https://linkedin.com/in/username",
      color: "hover:bg-blue-700 hover:text-white",
    },
    {
      icon: <Instagram size={20} />,
      href: "https://instagram.com/username",
      color: "hover:bg-pink-600 hover:text-white",
    },
    {
      icon: <Mail size={20} />,
      href: "mailto:rianfarhan@example.com",
      color: "hover:bg-red-600 hover:text-white",
    },
  ];

  return (
    <section
      id="contact"
      className={`py-20 ${fullPage ? "min-h-screen pt-32" : ""} ${
        isDark
          ? "bg-gradient-to-b from-gray-800 to-gray-900"
          : "bg-gradient-to-b from-gray-100 to-gray-200"
      }`}
    >
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h2
            className={`text-3xl md:text-4xl font-bold ${
              isDark ? "text-white" : "text-gray-800"
            } mb-4`}
          >
            Get In{" "}
            <span className={isDark ? "text-cyan-400" : "text-primary"}>
              Touch
            </span>
          </h2>
          <p
            className={`${
              isDark ? "text-gray-400" : "text-gray-600"
            } max-w-xl mx-auto`}
          >
            Have a project in mind or want to collaborate? Feel free to reach
            out to me.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          {/* Contact Info */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h3
              className={`text-2xl font-bold ${
                isDark ? "text-white" : "text-gray-800"
              } mb-6`}
            >
              Let's Talk
            </h3>

            <div className="space-y-6 mb-8">
              {contactInfo.map((item, index) => (
                <motion.a
                  key={index}
                  href={item.link}
                  className={`flex items-start gap-4 p-4 ${
                    isDark
                      ? "bg-gray-800 hover:bg-gray-700"
                      : "bg-white hover:bg-gray-50 border border-gray-200"
                  } rounded-lg transition-colors`}
                  whileHover={{
                    y: -5,
                    boxShadow: isDark
                      ? "0 10px 20px rgba(0, 0, 0, 0.2)"
                      : "0 10px 20px rgba(0, 0, 0, 0.1)",
                  }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  <div
                    className={`p-3 ${
                      isDark ? "bg-gray-700" : "bg-gray-100"
                    } rounded-lg`}
                  >
                    {item.icon}
                  </div>
                  <div>
                    <h4
                      className={`${
                        isDark ? "text-white" : "text-gray-800"
                      } font-medium`}
                    >
                      {item.title}
                    </h4>
                    <p className={isDark ? "text-gray-400" : "text-gray-600"}>
                      {item.value}
                    </p>
                  </div>
                </motion.a>
              ))}
            </div>

            <h4
              className={`text-xl font-semibold ${
                isDark ? "text-white" : "text-gray-800"
              } mb-4`}
            >
              Connect With Me
            </h4>
            <div className="flex gap-3">
              {socialLinks.map((link, index) => (
                <motion.a
                  key={index}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-10 h-10 ${
                    isDark
                      ? "bg-gray-800 text-gray-300"
                      : "bg-white text-gray-600 border border-gray-200"
                  } rounded-full flex items-center justify-center ${
                    link.color
                  } transition-colors`}
                  whileHover={{ scale: 1.2, y: -5 }}
                  whileTap={{ scale: 0.9 }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  viewport={{ once: true }}
                >
                  {link.icon}
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            className="lg:col-span-3"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div
              className={`${
                isDark ? "bg-gray-800" : "bg-white border border-gray-200"
              } rounded-2xl p-6 md:p-8`}
            >
              <h3
                className={`text-2xl font-bold ${
                  isDark ? "text-white" : "text-gray-800"
                } mb-6`}
              >
                Send Me a Message
              </h3>

              {isSubmitted ? (
                <motion.div
                  className={
                    isDark
                      ? "bg-green-800/30 border border-green-500/50 text-green-200 rounded-lg p-4"
                      : "bg-green-100 border border-green-500/50 text-green-800 rounded-lg p-4"
                  }
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <p className="font-medium">Message sent successfully!</p>
                  <p className="text-sm mt-1">
                    Thank you for reaching out. I'll get back to you soon.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <motion.div
                      whileHover="focus"
                      whileFocus="focus"
                      variants={formControlVariants}
                    >
                      <label
                        htmlFor="name"
                        className={`block ${
                          isDark ? "text-gray-400" : "text-gray-600"
                        } text-sm mb-2`}
                      >
                        Your Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formState.name}
                        onChange={handleChange}
                        required
                        className={`w-full ${
                          isDark
                            ? "bg-gray-700 text-white border-gray-600 focus:border-cyan-500"
                            : "bg-gray-50 text-gray-800 border-gray-300 focus:border-primary"
                        } rounded-lg px-4 py-3 border focus:outline-none transition-colors`}
                        placeholder="John Doe"
                      />
                    </motion.div>

                    <motion.div
                      whileHover="focus"
                      whileFocus="focus"
                      variants={formControlVariants}
                    >
                      <label
                        htmlFor="email"
                        className={`block ${
                          isDark ? "text-gray-400" : "text-gray-600"
                        } text-sm mb-2`}
                      >
                        Your Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formState.email}
                        onChange={handleChange}
                        required
                        className={`w-full ${
                          isDark
                            ? "bg-gray-700 text-white border-gray-600 focus:border-cyan-500"
                            : "bg-gray-50 text-gray-800 border-gray-300 focus:border-primary"
                        } rounded-lg px-4 py-3 border focus:outline-none transition-colors`}
                        placeholder="john@example.com"
                      />
                    </motion.div>
                  </div>

                  <motion.div
                    className="mb-4"
                    whileHover="focus"
                    whileFocus="focus"
                    variants={formControlVariants}
                  >
                    <label
                      htmlFor="subject"
                      className={`block ${
                        isDark ? "text-gray-400" : "text-gray-600"
                      } text-sm mb-2`}
                    >
                      Subject
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formState.subject}
                      onChange={handleChange}
                      required
                      className={`w-full ${
                        isDark
                          ? "bg-gray-700 text-white border-gray-600 focus:border-cyan-500"
                          : "bg-gray-50 text-gray-800 border-gray-300 focus:border-primary"
                      } rounded-lg px-4 py-3 border focus:outline-none transition-colors`}
                      placeholder="Project Inquiry"
                    />
                  </motion.div>

                  <motion.div
                    className="mb-6"
                    whileHover="focus"
                    whileFocus="focus"
                    variants={formControlVariants}
                  >
                    <label
                      htmlFor="message"
                      className={`block ${
                        isDark ? "text-gray-400" : "text-gray-600"
                      } text-sm mb-2`}
                    >
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formState.message}
                      onChange={handleChange}
                      required
                      rows="5"
                      className={`w-full ${
                        isDark
                          ? "bg-gray-700 text-white border-gray-600 focus:border-cyan-500"
                          : "bg-gray-50 text-gray-800 border-gray-300 focus:border-primary"
                      } rounded-lg px-4 py-3 border focus:outline-none transition-colors resize-none`}
                      placeholder="Hello Rian, I'd like to discuss..."
                    ></textarea>
                  </motion.div>

                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    className={`${
                      isDark
                        ? "bg-gradient-to-r from-cyan-500 to-blue-500"
                        : "bg-gradient-to-r from-primary to-blue-600"
                    } text-white py-3 px-6 rounded-lg font-medium flex items-center justify-center gap-2 w-full md:w-auto`}
                    whileHover={{
                      scale: 1.02,
                      boxShadow: isDark
                        ? "0 10px 25px rgba(0, 173, 181, 0.3)"
                        : "0 10px 25px rgba(95, 111, 255, 0.3)",
                    }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {isSubmitting ? (
                      <>
                        <svg
                          className="animate-spin h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Message
                        <Send size={18} />
                      </>
                    )}
                  </motion.button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
