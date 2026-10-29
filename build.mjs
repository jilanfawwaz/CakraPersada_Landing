// Membuat situs statis (dist/) dari isi di berkas ini + folder src/.
// Cara pakai:  node build.mjs
// Semua teks (Indonesia & Inggris), harga, dan kontak ada di bagian ISI di bawah. Ubah di sana, lalu jalankan lagi.
import { cpSync, mkdirSync, rmSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const SRC = join(here, 'src');
const OUT = join(here, 'dist');

// ===================== ISI: data bersama =====================
const SITE = 'https://guesthousecakrapersada.com';
const WA = '62811506456';               // nomor WhatsApp tanpa + dan tanpa 0 di depan
const WA_SHOW = '0811-506-456';
const EMAIL = 'cakrapersadaguesthouse@gmail.com';
const IG = 'https://www.instagram.com/cakrapersada.guesthouse/';
const TT = 'https://www.tiktok.com/@cakrapersada.guesthouse';
const LT = 'https://linktr.ee/CakraPersada';
const MAPS = 'https://maps.app.goo.gl/73XdEwpdaNpjwGkn8?g_st=ic';
const ADDRESS = { street: 'Jl. SMP1 Tengah No. 3', area: 'Kelurahan Kemuning, Kecamatan Banjarbaru Selatan', city: 'Kota Banjarbaru', region: 'Kalimantan Selatan', zip: '70714' };

// Ukuran asli foto (lebar,tinggi) agar halaman tidak "melompat" saat foto dimuat.
const DIM = { 'kamar-deluxe-2': [1200, 1600], 'pantry-air': [1200, 1600], 'papan-nama': [1200, 1600], 'lorong-standard': [1200, 1600], 'ruang-tunggu': [1600, 1600] };

const ROOMS = [
  { key: 'standard', building: 'cp', price: 175000, was: 210000, photo: 'kamar-standard-2' },
  { key: 'deluxe', building: 'cp2', price: 220000, was: 250000, photo: 'kamar-deluxe-1' },
  { key: 'executive', building: 'cp2', price: 295000, was: 340000, photo: 'kamar-executive-3' },
];

const NEAR = [
  ['Alfamart', 2], ["McDonald's", 3], ['KFC', 3], ['Pizza Hut', 4], ['Kolam Renang Idaman', 4], ['Lapangan Murjani', 4],
  ['Qmall Banjarbaru', 8], ['Kawasan Kantor Gubernur', 12], ['Kebun Raya Banua', 13], ['Amanah Borneo Park', 14],
  ['Kubah Guru Sekumpul', 15], ['Pasar Martapura', 15], ['Danau Seran', 16],
];
const AIRPORT = 20;

// ===================== ISI: teks per bahasa =====================
const T = {
  id: {
    lang: 'id', base: '/', other: '/en/', otherName: 'EN',
    title: 'Cakra Persada Guest House | Penginapan Nyaman di Banjarbaru, Kalimantan Selatan',
    desc: 'Penginapan bersih dan nyaman di Banjarbaru Selatan. Kamar ber-AC dengan kamar mandi dalam dan Wi-Fi, mulai Rp175.000 per malam. Pesan lewat WhatsApp.',
    ogLocale: 'id_ID', skip: 'Langsung ke konten', waLabel: 'WhatsApp',
    money: (n) => 'Rp' + n.toLocaleString('id-ID'),
    nav: [['#kamar', 'Kamar'], ['#fasilitas', 'Fasilitas'], ['#galeri', 'Galeri'], ['#lokasi', 'Lokasi'], ['#aturan', 'Aturan & pembatalan']],
    cta: 'Pesan via WhatsApp',
    heroEyebrow: 'Banjarbaru, Kalimantan Selatan',
    heroTitle: ['Cozy Stay,', 'Every day!'],
    heroText: 'Penginapan bersih dan tenang untuk beristirahat. Kamar ber-AC dengan kamar mandi dalam, Wi-Fi, dan perlengkapan mandi lengkap, mulai Rp175.000 per malam.',
    heroAlt: 'Kamar tidur Cakra Persada dengan lampu langit-langit hangat',
    seeRooms: 'Lihat kamar',
    facts: [
      ['Harga mulai dari', 'Rp175.000', ' / malam, sudah termasuk pajak'],
      ['Check-in & check-out', '14.00 · 12.00', ' WITA'],
      ['Lokasi', 'Banjarbaru Selatan', ''],
      ['Ke Bandara Syamsudin Noor', '± 20 menit', ' berkendara'],
    ],
    roomsTitle: 'Tiga tipe kamar, dua bangunan',
    roomsLead: 'Tipe Standard berada di bangunan Cakra Persada. Tipe Deluxe dan Executive berada di Cakra Persada 2, tepat di seberang jalan (jalan kaki tidak sampai 20 detik).',
    perNight: '/ malam', ask: 'Tanyakan ketersediaan',
    roomsFine: 'Harga sudah termasuk pajak, tidak termasuk sarapan. Booking dengan pembayaran lunas di awal.',
    building: { cp: 'Cakra Persada', cp2: 'Cakra Persada 2' },
    room: {
      standard: {
        name: 'Standard', alt: 'Kamar Standard dengan kasur Queen Size',
        feats: ['1 kasur Queen Size, maksimal 2 orang', 'AC, Wi-Fi, TV 32 inci', 'Kamar mandi dalam dengan perlengkapan mandi', 'Meja kerja, lemari, cermin', 'Mukena & sajadah tersedia'],
        note: 'Tidak menyediakan extrabed. Diprioritaskan untuk menginap minimal 2 malam.',
        msg: 'Halo Cakra Persada, saya ingin menanyakan ketersediaan kamar tipe Standard.',
      },
      deluxe: {
        name: 'Deluxe', alt: 'Kamar Deluxe dengan lampu dinding hangat',
        feats: ['Kasur Queen Size, maksimal 2 orang (tipe twin bed +Rp20.000)', 'Smart TV dengan koneksi internet', 'Shower air panas, kamar mandi lebih luas', 'Wastafel, dispenser sabun & shampo cair', 'Gratis teh, kopi, creamer, dan gula'],
        note: 'Semua fasilitas Standard, ditambah yang di atas. Beberapa kamar khusus untuk menginap minimal 2 malam.',
        msg: 'Halo Cakra Persada, saya ingin menanyakan ketersediaan kamar tipe Deluxe.',
      },
      executive: {
        name: 'Executive', alt: 'Kamar Executive yang luas dengan kasur King Size',
        feats: ['Kasur King Size, maksimal 2 orang (tipe twin bed +Rp20.000)', 'Smart TV 43 inci, kamar dan kamar mandi lebih luas', 'Kulkas, teko air panas, gelas dan cangkir', 'Shower air panas, wastafel, sandal hotel', 'Gratis teh, kopi, creamer, dan gula'],
        note: 'Semua fasilitas Deluxe, ditambah yang di atas.',
        msg: 'Halo Cakra Persada, saya ingin menanyakan ketersediaan kamar tipe Executive.',
      },
    },
    allTitle: 'Ada di setiap kamar',
    allLead: 'Apa pun tipenya, kamu mendapat perlengkapan dasar yang lengkap, jadi cukup datang membawa barang pribadi.',
    all: ['Air Conditioner (AC)', 'Wi-Fi publik', 'TV 32 inci', 'Kamar mandi dalam', 'Handuk, sabun, shampo, sikat gigi, pasta gigi, sisir', 'Tisu dan air mineral', 'Isi ulang air galon gratis', 'Lemari dan gantungan baju', 'Meja kerja dan cermin', 'Mukena & sajadah', 'Bantal, guling, dan bantal kecil'],
    galTitle: 'Lihat suasananya',
    gal: [
      ['papan-nama', 'g-a', 'Papan nama Cakra Persada 2 menyala di malam hari'],
      ['lorong-executive', 'g-b', 'Lorong dengan lantai mengilap'],
      ['ruang-santai', 'g-c', 'Ruang santai dengan sofa'],
      ['kamar-executive-5', 'g-d', 'Kamar mandi dengan shower kaca'],
      ['kamar-deluxe-3', 'g-c', 'Kamar Deluxe dengan meja kerja'],
      ['taman-dalam', 'g-c', 'Teras dalam dengan pilar putih'],
      ['kamar-executive-7', 'g-c', 'Sandal hotel berlogo Cakra Persada'],
    ],
    locTitle: 'Mudah dijangkau',
    mapsBtn: 'Buka di Google Maps', askWay: 'Tanya arah via WhatsApp',
    nearTitle: 'Perjalanan berkendara dari penginapan', min: 'mnt', airport: 'Bandara Syamsudin Noor',
    rulesTitle: 'Sebelum memesan',
    rulesLead: 'Beberapa hal singkat supaya menginapmu lancar dan tenang bersama tamu lain.',
    rule1: 'Aturan menginap',
    rule1Items: [
      'Penginapan diperuntukkan bagi tamu yang ingin beristirahat. Tidak untuk rombongan atau keluarga besar dengan acara makan bersama atau kumpul-kumpul.',
      'Booking dengan membayar lunas di awal.',
      'Tamu lawan jenis wajib menunjukkan KTP dengan alamat yang sama atau bukti menikah.',
      'Kapasitas maksimal 2 orang dewasa, toleransi tambahan 1 anak di bawah 5 tahun. Lebih dari itu dikenakan extraperson Rp50.000 per orang per malam.',
      'Seluruh kamar bebas rokok. Merokok hanya di area yang disediakan.',
    ],
    rule2: 'Jam masuk dan keluar',
    rule2Items: [
      'Check-in mulai pukul 14.00. Check-in sebelum 14.00 hingga 10.00 dikenakan 50% dari harga kamar; sebelum 10.00 dikenakan biaya 1 malam.',
      'Check-out paling lambat pukul 12.00. Lewat 12.00 hingga 17.00 dikenakan 50% dari harga kamar; lewat 17.00 dikenakan biaya 1 malam.',
    ],
    rule3: 'Pembatalan & reschedule', rule3Sub: 'Dana kembali sesuai selisih waktu dari tanggal menginap:',
    refund: [['Lebih dari 3 minggu', '70%'], ['Kurang dari 3 minggu', '50%'], ['Kurang dari 4 hari', '20%'], ['H-1 dan hari yang sama', '5%']],
    closeTitle: 'Siap menginap di Banjarbaru?',
    closeText: 'Kirim tanggal dan tipe kamar yang kamu mau lewat WhatsApp. Kami bantu cek ketersediaannya.',
    closeBtn: 'Pesan via WhatsApp: ' + WA_SHOW,
    contact: 'Hubungi kami', social: 'Media sosial', linktree: 'Semua tautan (Linktree)',
    rights: '© 2026 Cakra Persada Guest House. Banjarbaru, Kalimantan Selatan.',
    jsonDesc: 'Penginapan bersih dan nyaman di Banjarbaru Selatan, Kalimantan Selatan.',
  },
  en: {
    lang: 'en', base: '/en/', other: '/', otherName: 'ID',
    title: 'Cakra Persada Guest House | Cozy Stay in Banjarbaru, South Kalimantan',
    desc: 'Clean, comfortable guest house in Banjarbaru Selatan. Air-conditioned rooms with private bathroom and Wi-Fi from Rp175,000 per night. Book via WhatsApp.',
    ogLocale: 'en_US', skip: 'Skip to content', waLabel: 'WhatsApp',
    money: (n) => 'Rp' + n.toLocaleString('en-US'),
    nav: [['#kamar', 'Rooms'], ['#fasilitas', 'Facilities'], ['#galeri', 'Gallery'], ['#lokasi', 'Location'], ['#aturan', 'Policies']],
    cta: 'Book via WhatsApp',
    heroEyebrow: 'Banjarbaru, South Kalimantan',
    heroTitle: ['Cozy Stay,', 'Every day!'],
    heroText: 'A clean, quiet place to rest. Air-conditioned rooms with private bathroom, Wi-Fi and a full set of toiletries, from Rp175,000 per night.',
    heroAlt: 'Cakra Persada bedroom with warm ceiling lights',
    seeRooms: 'See the rooms',
    facts: [
      ['Prices from', 'Rp175,000', ' / night, tax included'],
      ['Check-in & check-out', '2:00 PM · 12:00 PM', ' WITA'],
      ['Location', 'Banjarbaru Selatan', ''],
      ['To Syamsudin Noor Airport', '± 20 minutes', ' by car'],
    ],
    roomsTitle: 'Three room types, two buildings',
    roomsLead: 'Standard rooms are in the Cakra Persada building. Deluxe and Executive rooms are in Cakra Persada 2, right across the street (under a 20-second walk).',
    perNight: '/ night', ask: 'Check availability',
    roomsFine: 'Prices include tax; breakfast is not included. Bookings are paid in full in advance.',
    building: { cp: 'Cakra Persada', cp2: 'Cakra Persada 2' },
    room: {
      standard: {
        name: 'Standard', alt: 'Standard room with a Queen Size bed',
        feats: ['1 Queen Size bed, up to 2 guests', 'Air conditioning, Wi-Fi, 32-inch TV', 'Private bathroom with toiletries', 'Work desk, wardrobe, mirror', 'Prayer mat & mukena available'],
        note: 'No extra bed available. Priority is given to stays of at least 2 nights.',
        msg: 'Hello Cakra Persada, I would like to check availability for a Standard room.',
      },
      deluxe: {
        name: 'Deluxe', alt: 'Deluxe room with warm wall lamps',
        feats: ['Queen Size bed, up to 2 guests (twin beds +Rp20,000)', 'Smart TV with internet connection', 'Hot water shower, larger bathroom', 'Washbasin, liquid soap & shampoo dispenser', 'Free tea, coffee, creamer, and sugar'],
        note: 'Everything in Standard, plus the above. A few rooms are reserved for stays of at least 2 nights.',
        msg: 'Hello Cakra Persada, I would like to check availability for a Deluxe room.',
      },
      executive: {
        name: 'Executive', alt: 'Spacious Executive room with a King Size bed',
        feats: ['King Size bed, up to 2 guests (twin beds +Rp20,000)', '43-inch Smart TV, larger room and bathroom', 'Mini fridge, electric kettle, glasses and cups', 'Hot water shower, washbasin, hotel slippers', 'Free tea, coffee, creamer, and sugar'],
        note: 'Everything in Deluxe, plus the above.',
        msg: 'Hello Cakra Persada, I would like to check availability for an Executive room.',
      },
    },
    allTitle: 'In every room',
    allLead: 'Whichever type you choose, the basics are covered, so you only need to bring your personal belongings.',
    all: ['Air conditioning', 'Public Wi-Fi', '32-inch TV', 'Private bathroom', 'Towel, soap, shampoo, toothbrush, toothpaste, comb', 'Tissues and bottled water', 'Free refill of drinking water', 'Wardrobe and hangers', 'Work desk and mirror', 'Prayer mat & mukena', 'Pillows, bolster, and small pillow'],
    galTitle: 'Take a look around',
    gal: [
      ['papan-nama', 'g-a', 'The Cakra Persada 2 sign lit up at night'],
      ['lorong-executive', 'g-b', 'Corridor with polished floors'],
      ['ruang-santai', 'g-c', 'Lounge with sofas'],
      ['kamar-executive-5', 'g-d', 'Bathroom with a glass shower'],
      ['kamar-deluxe-3', 'g-c', 'Deluxe room with a work desk'],
      ['taman-dalam', 'g-c', 'Inner veranda with white pillars'],
      ['kamar-executive-7', 'g-c', 'Hotel slippers with the Cakra Persada logo'],
    ],
    locTitle: 'Easy to reach',
    mapsBtn: 'Open in Google Maps', askWay: 'Ask for directions on WhatsApp',
    nearTitle: 'Travel time by car from the guest house', min: 'min', airport: 'Syamsudin Noor Airport',
    rulesTitle: 'Before you book',
    rulesLead: 'A few short notes so your stay goes smoothly and stays peaceful for other guests.',
    rule1: 'House rules',
    rule1Items: [
      'The guest house is meant for guests who want to rest. It is not suitable for groups or large families planning shared meals or gatherings.',
      'Bookings are paid in full in advance.',
      'Unmarried guests of the opposite sex must show ID cards (KTP) with the same address, or proof of marriage.',
      'Maximum 2 adults, with a tolerance of 1 additional child under 5. Beyond that, an extra person charge of Rp50,000 per person per night applies.',
      'All rooms are non-smoking. Smoking is only allowed in the designated area.',
    ],
    rule2: 'Check-in and check-out',
    rule2Items: [
      'Check-in starts at 2:00 PM. Early check-in before 2:00 PM up to 10:00 AM is charged 50% of the room rate; before 10:00 AM is charged 1 night.',
      'Check-out is by 12:00 PM. Late check-out after 12:00 PM up to 5:00 PM is charged 50% of the room rate; after 5:00 PM is charged 1 night.',
    ],
    rule3: 'Cancellation & rescheduling', rule3Sub: 'Refund depends on how far ahead of your stay date you cancel:',
    refund: [['More than 3 weeks', '70%'], ['Under 3 weeks', '50%'], ['Under 4 days', '20%'], ['1 day before and same day', '5%']],
    closeTitle: 'Ready to stay in Banjarbaru?',
    closeText: 'Send us your dates and preferred room type on WhatsApp. We will check availability for you.',
    closeBtn: 'Book via WhatsApp: ' + WA_SHOW,
    contact: 'Contact us', social: 'Social media', linktree: 'All links (Linktree)',
    rights: '© 2026 Cakra Persada Guest House. Banjarbaru, South Kalimantan.',
    jsonDesc: 'Clean, comfortable guest house in Banjarbaru Selatan, South Kalimantan, Indonesia.',
  },
};

// ===================== MESIN: jangan diubah kecuali perlu =====================
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const wa = (msg) => `https://wa.me/${WA}` + (msg ? `?text=${encodeURIComponent(msg)}` : '');

function img(name, alt, { cls = '', sizes = '100vw', lazy = true, priority = false } = {}) {
  const [w, h] = DIM[name] || [1600, 1200];
  const sw = w > h ? 800 : 600;
  const attrs = [
    `src="/img/${name}.webp"`,
    `srcset="/img/${name}-800.webp ${sw}w, /img/${name}.webp ${w}w"`,
    `sizes="${sizes}"`, `width="${w}"`, `height="${h}"`, `alt="${esc(alt)}"`,
    cls ? `class="${cls}"` : '',
    priority ? 'fetchpriority="high"' : (lazy ? 'loading="lazy" decoding="async"' : ''),
  ].filter(Boolean);
  return `<img ${attrs.join(' ')}>`;
}

const waIcon = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 11.5a8.4 8.4 0 0 1-12.3 7.4L3 20.5l1.7-5.5A8.4 8.4 0 1 1 21 11.5Z"/></svg>';

function jsonld(t) {
  const prices = ROOMS.map((r) => r.price);
  const data = {
    '@context': 'https://schema.org',
    '@type': 'LodgingBusiness',
    name: 'Cakra Persada Guest House',
    description: t.jsonDesc,
    url: SITE + t.base,
    image: [SITE + '/og-image.jpg'],
    logo: SITE + '/img/ikon-app.png',
    telephone: '+' + WA,
    email: EMAIL,
    priceRange: `Rp${Math.min(...prices).toLocaleString('id-ID')} - Rp${Math.max(...prices).toLocaleString('id-ID')}`,
    currenciesAccepted: 'IDR',
    checkinTime: '14:00',
    checkoutTime: '12:00',
    address: { '@type': 'PostalAddress', streetAddress: ADDRESS.street, addressLocality: 'Banjarbaru', addressRegion: ADDRESS.region, postalCode: ADDRESS.zip, addressCountry: 'ID' },
    sameAs: [IG, TT, LT],
    amenityFeature: ['Air conditioning', 'Wi-Fi', 'Private bathroom', 'Television'].map((n) => ({ '@type': 'LocationFeatureSpecification', name: n, value: true })),
  };
  return JSON.stringify(data).replace(/</g, '\\u003c');
}

function page(t) {
  const url = SITE + t.base;
  const langSwitch = (cur) => `<div class="lang" role="group" aria-label="${t.lang === 'id' ? 'Bahasa' : 'Language'}">
      <a href="/" hreflang="id" lang="id"${cur === 'id' ? ' aria-current="true"' : ''}>ID</a>
      <a href="/en/" hreflang="en" lang="en"${cur === 'en' ? ' aria-current="true"' : ''}>EN</a>
    </div>`;
  const roomCards = ROOMS.map((r) => {
    const x = t.room[r.key];
    const btn = r.building === 'cp' ? 'btn-o' : 'btn-m';
    return `<article class="room room--${r.building}">
      ${img(r.photo, x.alt, { sizes: '(max-width: 900px) 100vw, 380px' })}
      <div class="room-body">
        <div>
          <span class="tag">${esc(t.building[r.building])}</span>
          <h3>${esc(x.name)}</h3>
          <p class="price"><b>${t.money(r.price)}</b><s>${t.money(r.was)}</s><span>${esc(t.perNight)}</span></p>
        </div>
        <ul class="fl">${x.feats.map((f) => `<li>${esc(f)}</li>`).join('')}</ul>
        <p class="note">${esc(x.note)}</p>
        <a class="btn ${btn}" href="${wa(x.msg)}">${esc(t.ask)}</a>
      </div>
    </article>`;
  }).join('\n    ');

  const near = NEAR.map(([n, m]) => `<li>${esc(n)} <span>${m} ${t.min}</span></li>`).join('')
    + `<li class="key">${esc(t.airport)} <span>${AIRPORT} ${t.min}</span></li>`;

  return `<!doctype html>
<html lang="${t.lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(t.title)}</title>
<meta name="description" content="${esc(t.desc)}">
<link rel="canonical" href="${url}">
<link rel="alternate" hreflang="id" href="${SITE}/">
<link rel="alternate" hreflang="en" href="${SITE}/en/">
<link rel="alternate" hreflang="x-default" href="${SITE}/">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Cakra Persada Guest House">
<meta property="og:title" content="${esc(t.title)}">
<meta property="og:description" content="${esc(t.desc)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${SITE}/og-image.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:locale" content="${t.ogLocale}">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#005FBF">
<link rel="icon" href="/favicon.png" type="image/png">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="preload" href="/fonts/poppins-Regular.woff" as="font" type="font/woff" crossorigin>
<link rel="preload" href="/fonts/poppins-Bold.woff" as="font" type="font/woff" crossorigin>
<link rel="stylesheet" href="/style.css">
<script type="application/ld+json">${jsonld(t)}</script>
</head>
<body>
<a class="skip" href="#isi">${esc(t.skip)}</a>

<header class="wrap top">
  <a class="logo" href="${t.base}"><img src="/img/logo-biru.png" width="1762" height="592" alt="Cakra Persada Guest House"></a>
  <nav class="nav" aria-label="${t.lang === 'id' ? 'Menu utama' : 'Main menu'}">
    ${t.nav.map(([h, l]) => `<a href="${h}">${esc(l)}</a>`).join('\n    ')}
  </nav>
  ${langSwitch(t.lang)}
  <a class="btn btn-p btn-sm" href="${wa()}">${esc(t.cta)}</a>
</header>

<main id="isi">
<section class="hero">
  ${img('kamar-executive-1', t.heroAlt, { sizes: '100vw', priority: true })}
  <div class="wrap">
    <p class="eyebrow">${esc(t.heroEyebrow)}</p>
    <h1>${t.heroTitle.map(esc).join('<br>')}</h1>
    <p>${esc(t.heroText)}</p>
    <div class="cta">
      <a class="btn btn-w" href="${wa()}">${esc(t.cta)}</a>
      <a class="btn btn-g" href="#kamar">${esc(t.seeRooms)}</a>
    </div>
  </div>
</section>

<section class="facts" aria-label="${t.lang === 'id' ? 'Ringkasan' : 'Summary'}">
  <div class="wrap">
    ${t.facts.map(([a, b, c]) => `<div class="fact"><small>${esc(a)}</small><strong>${esc(b)}${c ? ` <span>${esc(c)}</span>` : ''}</strong></div>`).join('\n    ')}
  </div>
</section>

<section class="wrap sec" id="kamar">
  <h2>${esc(t.roomsTitle)}</h2>
  <p class="lead">${esc(t.roomsLead)}</p>
  <div class="rooms">
    ${roomCards}
  </div>
  <p class="fine">${esc(t.roomsFine)}</p>
</section>

<section class="wrap sec" id="fasilitas">
  <div class="all">
    <div><h2>${esc(t.allTitle)}</h2><p class="lead">${esc(t.allLead)}</p></div>
    <ul class="fl">${t.all.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>
  </div>
</section>

<section class="wrap sec" id="galeri">
  <h2>${esc(t.galTitle)}</h2>
  <div class="gal">
    ${t.gal.map(([n, c, a]) => img(n, a, { cls: c, sizes: '(max-width: 900px) 50vw, 600px' })).join('\n    ')}
  </div>
</section>

<section class="wrap sec" id="lokasi">
  <div class="loc">
    <div>
      <h2>${esc(t.locTitle)}</h2>
      <address>${esc(ADDRESS.street)}, ${esc(ADDRESS.area)}, ${esc(ADDRESS.city)}, ${esc(ADDRESS.region)} ${ADDRESS.zip}</address>
      <div class="acts">
        <a class="btn btn-p" href="${MAPS}" target="_blank" rel="noopener noreferrer">${esc(t.mapsBtn)}</a>
        <a class="btn btn-o" href="${wa()}">${esc(t.askWay)}</a>
      </div>
    </div>
    <div>
      <h3>${esc(t.nearTitle)}</h3>
      <ul class="near">${near}</ul>
    </div>
  </div>
</section>

<section class="wrap sec sec-last" id="aturan">
  <h2>${esc(t.rulesTitle)}</h2>
  <p class="lead">${esc(t.rulesLead)}</p>
  <div class="rules">
    <div class="card">
      <h3>${esc(t.rule1)}</h3>
      <ul class="fl">${t.rule1Items.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>
    </div>
    <div class="stack">
      <div class="card">
        <h3>${esc(t.rule2)}</h3>
        <ul class="fl">${t.rule2Items.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>
      </div>
      <div class="card soft">
        <h3>${esc(t.rule3)}</h3>
        <p class="sub">${esc(t.rule3Sub)}</p>
        <div class="refund">${t.refund.map(([a, b]) => `<div><span>${esc(a)}</span><strong>${esc(b)}</strong></div>`).join('')}</div>
      </div>
    </div>
  </div>
</section>

<section class="closing">
  <div class="wrap">
    <div><h2>${esc(t.closeTitle)}</h2><p>${esc(t.closeText)}</p></div>
    <a class="btn btn-w" href="${wa()}">${esc(t.closeBtn)}</a>
  </div>
</section>
</main>

<footer>
  <div class="wrap">
    <div class="col">
      <img src="/img/logo-putih.png" width="1762" height="592" alt="Cakra Persada Guest House" loading="lazy">
      <address>${esc(ADDRESS.street)}, ${esc(ADDRESS.area)}, ${esc(ADDRESS.city)}, ${esc(ADDRESS.region)} ${ADDRESS.zip}</address>
    </div>
    <div class="col">
      <h2>${esc(t.contact)}</h2>
      <div>WhatsApp: <a href="${wa()}">${WA_SHOW}</a></div>
      <div><a href="mailto:${EMAIL}">${EMAIL}</a></div>
    </div>
    <div class="col">
      <h2>${esc(t.social)}</h2>
      <div><a href="${IG}" target="_blank" rel="noopener noreferrer">Instagram @cakrapersada.guesthouse</a></div>
      <div><a href="${TT}" target="_blank" rel="noopener noreferrer">TikTok @cakrapersada.guesthouse</a></div>
      <div><a href="${LT}" target="_blank" rel="noopener noreferrer">${esc(t.linktree)}</a></div>
    </div>
  </div>
  <div class="wrap legal"><span>${esc(t.rights)}</span><span><a href="${t.other}" hreflang="${t.lang === 'id' ? 'en' : 'id'}">${t.lang === 'id' ? 'English version' : 'Versi Indonesia'}</a></span></div>
</footer>

<a class="wa-float" href="${wa()}">${waIcon}<span>${esc(t.waLabel)}</span></a>
</body>
</html>
`;
}

// ===================== tulis hasil =====================
rmSync(OUT, { recursive: true, force: true });
mkdirSync(join(OUT, 'en'), { recursive: true });
cpSync(join(SRC, 'img'), join(OUT, 'img'), { recursive: true });
cpSync(join(SRC, 'fonts'), join(OUT, 'fonts'), { recursive: true });
for (const f of ['style.css', 'favicon.png', 'apple-touch-icon.png', 'icon-192.png', 'og-image.jpg']) cpSync(join(SRC, f), join(OUT, f));
writeFileSync(join(OUT, 'index.html'), page(T.id));
writeFileSync(join(OUT, 'en', 'index.html'), page(T.en));
writeFileSync(join(OUT, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`);
writeFileSync(join(OUT, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <url><loc>${SITE}/</loc><xhtml:link rel="alternate" hreflang="id" href="${SITE}/"/><xhtml:link rel="alternate" hreflang="en" href="${SITE}/en/"/></url>
  <url><loc>${SITE}/en/</loc><xhtml:link rel="alternate" hreflang="id" href="${SITE}/"/><xhtml:link rel="alternate" hreflang="en" href="${SITE}/en/"/></url>
</urlset>
`);
if (!existsSync(join(OUT, 'index.html'))) throw new Error('build gagal');
console.log('Selesai: dist/index.html (Indonesia) dan dist/en/index.html (Inggris)');
