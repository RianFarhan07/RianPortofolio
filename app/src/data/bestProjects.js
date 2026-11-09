export const bestProjects = [
  {
    id: 1,
    title: "Finlog",
    description:
      "Personal Finance OS untuk mengelola transaksi, multi-wallet, budget, tagihan berulang, dan portofolio investasi dalam satu dashboard. Finlog menggabungkan pencatatan keuangan, analitik cashflow dan net worth, insight otomatis, serta technical screener dengan arsitektur multi-user dan multi-currency.",
    category: "web",
    image: "images/finlog.webp",
    liveUrl: "https://finlog.my.id/",
    techStack: {
      frontend: ["Next.js", "TypeScript", "TanStack Query", "Recharts"],
      backend: ["Supabase", "Drizzle ORM"],
      database: ["PostgreSQL"],
      utilities: ["Row-Level Security", "Telegram Bot API"],
    },
  },
  {
    id: 2,
    title: "CarbonEthics Website Revamp",
    description:
      "Revamp website korporat CarbonEthics dari Wix ke Next.js. Situs dua bahasa (EN/ID) yang memperkenalkan solusi berbasis alam, proyek dan dampak, digital monitoring, blog, karir, dan kontak, terhubung ke backend Laravel untuk konten, form, dan data proyek.",
    category: "web",
    image: "images/website-revamp.webp",
    liveUrl: "https://www.carbonethics.co",
    techStack: {
      frontend: ["Next.js", "TypeScript", "Tailwind CSS", "next-intl"],
      backend: ["Laravel API"],
      utilities: ["Docker", "AWS S3"],
    },
  },
  {
    id: 3,
    title: "CarbonEthics Petani App",
    description:
      "Aplikasi Android offline-first untuk tim lapangan CarbonEthics. Petani dan vendor melaporkan bibit, penanaman awal, dan monitoring berkala lengkap dengan foto berlokasi GPS, bahkan saat sinyal lemah. Data disimpan di perangkat lalu disinkronkan otomatis ke backend Laravel. Sudah rilis di Google Play.",
    category: "android",
    image: "images/petani-app.webp",
    liveUrl: "https://play.google.com/store/apps/details?id=co.carbonethics.petaniapp",
    techStack: {
      frontend: ["React Native", "Expo", "NativeWind"],
      backend: ["Laravel API"],
      database: ["WatermelonDB", "MMKV"],
    },
  },
  {
    id: 4,
    title: "Recipedia",
    description:
      "Asisten resep berbasis AI. Pengguna mencari resep dari bahan yang ada di kulkas, meminta AI membuatkan resep sesuai keinginan, atau memotret makanan untuk langsung mendapatkan resepnya. Dilengkapi info nutrisi, filter diet, resep favorit, rencana makan mingguan, dan daftar belanja otomatis.",
    category: "web",
    image: "images/recipedia.webp",
    liveUrl: "https://recipedia-client-eight.vercel.app/",
    techStack: {
      frontend: ["Next.js", "Tailwind CSS"],
      backend: ["NestJS", "Prisma"],
      database: ["PostgreSQL", "Redis"],
      utilities: ["Google Gemini AI", "Supabase Auth"],
    },
  },
  {
    id: 5,
    title: "KostHunt",
    description:
      "KostHunt adalah platform pencarian kost yang memudahkan pengguna menemukan tempat tinggal sesuai kebutuhan mereka. Dilengkapi dengan fitur pencarian berbasis lokasi, filter harga dan fasilitas, sistem ulasan pengguna, serta metode pembayaran online melalui Midtrans.",
    category: "web",
    image: "images/kostHuntMern.webp",
    liveUrl: "https://kost-hunt.vercel.app/",
    techStack: {
      frontend: ["JavaScript", "React", "Redux", "Tailwind CSS"],
      backend: ["Express.js"],
      database: ["MongoDB"],
      utilities: ["Midtrans", "XLSX"],
    },
  },
];
