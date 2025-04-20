import { useEffect } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import {
  Phone,
  Mail,
  MapPin,
  Linkedin,
  Github,
  Instagram,
  ArrowRight,
  MessageSquare,
  Handshake,
  Clock,
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { Link } from "react-router-dom";

export default function ContactPreview() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  // Load Giscus
  useEffect(() => {
    const loadGiscus = () => {
      // hilangkan script jika sudah ada
      const existingScript = document.getElementById("giscus-script");
      if (existingScript) {
        existingScript.remove();
      }

      // buat dan konfigurasi giscus
      const script = document.createElement("script");
      script.src = "https://giscus.app/client.js";
      script.id = "giscus-script";
      script.setAttribute("data-repo", "RianFarhan07/RianPortofolio");
      script.setAttribute("data-repo-id", "R_kgDOObW8sg");
      script.setAttribute("data-category", "General");
      script.setAttribute("data-category-id", "DIC_kwDOObW8ss4CpSL1");
      script.setAttribute("data-mapping", "pathname");
      script.setAttribute("data-strict", "0");
      script.setAttribute("data-reactions-enabled", "1");
      script.setAttribute("data-emit-metadata", "0");
      script.setAttribute("data-input-position", "top");
      script.setAttribute("data-theme", isDark ? "dark" : "light");
      script.setAttribute("data-lang", "en");
      script.setAttribute("crossorigin", "anonymous");
      script.async = true;

      //tambahkan script ke halaman
      const giscusContainer = document.getElementById("giscus-container");
      if (giscusContainer) {
        giscusContainer.appendChild(script);
      }
    };

    // untuk performance load giscus saat komponen inView
    if (inView) {
      loadGiscus();
    }

    return () => {
      // kalau unmount bersihkan script
      const giscusScript = document.getElementById("giscus-script");
      if (giscusScript) {
        giscusScript.remove();
      }
    };
  }, [inView, isDark]);

  const contactInfo = [
    {
      icon: <Phone size={20} />,
      title: "Phone",
      value: "+62 822 8037 2670",
      link: "https://wa.me/6282280372670?text=Hi%20Rian,%20I%20would%20like%20to%20discuss%20a%20job%20opportunity%20we%20have%20and%20see%20if%20you%20might%20be%20interested.",
    },
    {
      icon: <Mail size={20} />,
      title: "Email",
      value: "rian.mallanti@gmail.com",
      link: "#contact",
    },
    {
      icon: <MapPin size={20} />,
      title: "Location",
      value: "Siddo, Kec. Soppeng Riaja, Kabupaten Barru, Sulawesi Selatan",
      link: "https://www.google.com/maps/place/Rezki+Ayra/@-4.2378229,119.6255899,20.6z/data=!4m15!1m8!3m7!1s0x2d959037d3877ecf:0xfbffc78763dca0b3!2sSiddo,+Kec.+Soppeng+Riaja,+Kabupaten+Barru,+Sulawesi+Selatan!3b1!8m2!3d-4.2420418!4d119.6441212!16s%2Fg%2F121mkpx2!3m5!1s0x2d95906ab81869db:0xbdb867d18d33b203!8m2!3d-4.2377172!4d119.6253708!16s%2Fg%2F11qg28lb6m?entry=ttu&g_ep=EgoyMDI1MDQxNi4xIKXMDSoJLDEwMjExNDUzSAFQAw%3D%3D",
    },
    {
      icon: <Handshake size={20} />,
      title: "Collaboration",
      value: "Let’s build something great!",
      link: "mailto:rian.mallanti@gmail.com",
    },
    {
      icon: <Clock size={20} />,
      title: "Available For",
      value: "Full-Time / Contract / Freelance",
      link: "#about",
    },
  ];

  const socialLinks = [
    {
      icon: <Linkedin size={18} />,
      name: "LinkedIn",
      url: "https://www.linkedin.com/in/baso-rian-farhan-82bb73245/",
    },
    {
      icon: <Github size={18} />,
      name: "GitHub",
      url: "https://github.com/RianFarhan07",
    },
    {
      icon: <Instagram size={18} />,
      name: "Instagram",
      url: "https://www.instagram.com/rianfarhan/",
    },
  ];

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
      id="contact"
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
          className="text-center mb-10 md:mb-12"
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
            className="lg:col-span-4 space-y-4 sm:space-y-6"
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

            {/* Social Links buat di mobile */}
            <motion.div className="flex flex-wrap gap-3 justify-center lg:justify-start pt-2 lg:hidden">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.95 }}
                  className={`p-3 rounded-full ${
                    isDark
                      ? "bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800"
                  } transition-colors`}
                >
                  {social.icon}
                </motion.a>
              ))}
            </motion.div>
          </motion.div>

          {/* Giscus Comments Section */}
          <motion.div className="lg:col-span-8" variants={itemVariants}>
            <div
              className={`p-6 rounded-lg ${
                isDark
                  ? "bg-gray-900/80 border border-gray-800"
                  : "bg-white/80 border border-gray-200"
              } backdrop-blur-sm h-full`}
            >
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <MessageSquare
                    size={20}
                    className={isDark ? "text-primary" : "text-primaryInLight"}
                  />
                  <h3
                    className={`text-xl font-bold ${
                      isDark ? "text-white" : "text-gray-800"
                    }`}
                  >
                    Join the Conversation
                  </h3>
                </div>

                {/* Social links - di desktop aja */}
                <div className="hidden lg:flex gap-2">
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

              {/* Giscus container */}
              <div className="min-h-64 mb-2">
                <div id="giscus-container" className="w-full"></div>

                {/* Instructions notice */}
                <div
                  className={`text-xs mt-4 p-3 rounded ${
                    isDark
                      ? "bg-gray-800 text-gray-400"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  <p>
                    <strong>Note :</strong> Please log in to your GitHub account
                    and leave a comment below! 😊 Don't forget to add an emoji
                    reaction like ❤️, 🚀, or any emoji you like to show your
                    thoughts!
                  </p>
                </div>
              </div>
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
                <ArrowRight
                  size={16}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
