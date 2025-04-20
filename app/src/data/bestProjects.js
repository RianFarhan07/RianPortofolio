export const bestProjects = [
  {
    id: 1,
    title: "Kelompro App",
    description:
      "Aplikasi manajemen kerja kelompok berbasis Android yang dirancang untuk mempermudah kolaborasi tim dalam proyek akademik dan profesional. Menggunakan Kotlin dan Firebase untuk real-time collaboration, fitur chat, pengingat tugas, serta sistem pembagian tugas otomatis.",
    category: "android",
    image: "images/kelompro.png",
    techStack: {
      frontend: ["Kotlin"],
      backend: ["Firebase BAAS"],
      database: ["Firestore"],
    },
  },
  {
    id: 2,
    title: "KostHunt",
    description:
      "KostHunt adalah platform pencarian kost yang memudahkan pengguna menemukan tempat tinggal sesuai kebutuhan mereka. Dilengkapi dengan fitur pencarian berbasis lokasi, filter harga dan fasilitas, sistem ulasan pengguna, serta metode pembayaran online melalui Midtrans.",
    category: "web",
    image: "images/kostHuntMern.png",
    link: "https://kost-hunt.vercel.app/",
    techStack: {
      frontend: ["JavaScript", "React", "Redux", "Tailwind CSS"],
      backend: ["Node.js"],
      database: ["MongoDB"],
      utilities: ["Midtrans", "XLSX"],
    },
  },
  {
    id: 3,
    title: "Rylix Estate",
    description:
      "Rylix Estate adalah platform pencarian properti berbasis MERN Stack yang memungkinkan pengguna mencari, menyimpan, dan membeli properti dengan mudah. Dilengkapi dengan fitur autentikasi, filter pencarian, manajemen properti, serta pembayaran online melalui Midtrans.",
    category: "web",
    image: "images/RylixEstate.png",
    link: "https://real-estate-mern-sandy.vercel.app/",
    techStack: {
      frontend: ["JavaScript", "React", "Redux", "Tailwind CSS"],
      backend: ["Node.js"],
      database: ["MongoDB"],
      utilities: [],
    },
  },
];
