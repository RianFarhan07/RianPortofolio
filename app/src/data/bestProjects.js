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
    liveUrl: "https://kost-hunt.vercel.app/",
    techStack: {
      frontend: ["JavaScript", "React", "Redux", "Tailwind CSS"],
      backend: ["Express.js"],
      database: ["MongoDB"],
      utilities: ["Midtrans", "XLSX"],
    },
  },
  {
    id: 3,
    title: "Artelux",
    description:
      "Artelux adalah platform e-commerce premium yang didedikasikan untuk menampilkan dan menjual karya seni lukis yang dikurasi. Baik Anda seorang pecinta seni, kolektor baru, atau mencari cara untuk mempercantik ruang, Artelux menghubungkan Anda dengan karya seni yang menakjubkan dari seniman yang sedang berkembang dan seniman mapan.",
    category: "web",
    image: "images/artelux.png",
    liveUrl: "https://artelux.vercel.app/",
    techStack: {
      frontend: ["Next.js", "Tailwind CSS"],
      backend: ["Typescript", "Express.js"],
      database: ["MongoDB"],
      utilities: ["JWT", "Zod"],
    },
  },
  {
    id: 4,
    title: "BukuKita",
    description:
      "BukuKita adalah aplikasi web berbagi dan peminjaman buku yang memungkinkan pengguna untuk menyewakan koleksi buku pribadinya atau menyewa buku dari pengguna lain. Aplikasi ini dibuat sebagai proyek akhir dalam program Fullstack JavaScript Immersive Hacktiv8, dikembangkan dalam waktu 2 minggu dengan menggunakan berbagai teknologi modern.",
    category: "web",
    image: "images/bukukita.png",
    liveUrl: "https://bukukita-client.web.app",
    techStack: {
      frontend: ["React.js", "Apollo Client", "Tailwind CSS", "Zustand"],
      backend: ["Node.js", "Apollo Server", "Express.js"],
      database: ["MongoDB"],
      utilities: ["Socket.io", "Midtrans", "Imagekit", "Jest"],
    },
  },
  {
    id: 5,
    title: "Recipedia",
    description:
      "Recipedia adalah platform pintar untuk menemukan resep yang membantu pengguna mencari resep berdasarkan bahan yang tersedia, kebutuhan nutrisi, dan preferensi pribadi. Dengan teknologi pengenalan gambar berbasis AI, Recipedia dapat menganalisis gambar makanan dan menghasilkan daftar bahan, membuat memasak lebih mudah dan dapat diakses.",
    category: "web",
    image: "images/recipedia.png",
    liveUrl: "https://recipedia-e625b.web.app/",
    techStack: {
      frontend: ["React.js", "Tailwind CSS"],
      backend: ["Node.js", "Express.js"],
      database: ["PostgreSQL"],
      utilities: ["AI", "Spoonacular API", "Axios"],
    },
  },
];
