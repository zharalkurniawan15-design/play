const CONFIG = {
    pengirim: "Zharal",
    penerima: "Cipaa",
    introLine: "Mengumpulkan rencana kecil untuk menciptakan kenangan.",
    quoteBuku: "Satu hari, Seribu kenangan.",
    loadingText: "Menyiapkan kenangan untuk kita",
    flowerWallLabel: "Untuk makhluk yang spesial",
    judulRencana: "Rencana Jalan Kita",
    ribbon: "Waktu untuk kita Main",
    subjudul: "Sengaja kuplanning banget agar semua berjalan dengan baik.",
    tanggal: "Jumat, 19 Juni 2026",
    jamMulai: "09.00",
    jemput: "aku jemput di depan rumah kamu",
    catatanKecil: "Semoga sukaa yaa dengan rencana ku ini.",
    tandaTangan: "Terima kasih sudah jadi kamu apa ada nya.",
    tags: [
        { icon: "🕒", label: "Quality Time" },
        { icon: "🎮", label: "Playing with me" },
        { icon: "📷", label: "Buat inget kita" }
    ],
    ctaSetuju: "Aku kabarin kalau aku otw ke rumah kamu yaa....",
    ctaSetelahKlik: "bayy bayy, See you in Another Time🧭⏲",
    steps: [
        {
            icon: "🏍",
            waktu: "09.00 Pagi",
            label: "Otw",
            tempat: "Dalam perjalanan",
            deskripsiSingkat: "1 jam 30 menit.",
            catatan: "Tolong anteng dalam perjalanan yaa🤗."
        },
        {
            icon: "🧎‍♂️",
            waktu: "11:30 - 13.00 siang",
            label: "Sholat Jum'at",
            tempat: "masjid terdekat ",
            deskripsiSingkat: "Sholat dulu yaa.",
            catatan: "mau ikut sholat ayooo, mau nunggu di tempat adem boleh...  "
        },
        {
            icon: "⛸❄",
            waktu: "14:00 Siang",
            label: "Ice Skating ",
            tempat: "BX Rink ",
            deskripsiSingkat: "Jangan takut jatoh okeyyy...",
            catatan: "bisa ga bisa harus mau yaa...sesuai janji."
        }
        ,
        {
            icon: "🍛🍱",
            waktu: "16.30 sore",
            label: "Mam",
            tempat: "Lunch",
            deskripsiSingkat: "Setelah Ice Skating kita isi perut dulu",
            catatan: "pilih mau mam di tempat mana, mau mam apa choose everything you want"
        },
        {
            icon: "☕",
            waktu: "17.30 sore",
            label: "Coffe with Sunset",
            tempat: "Mokopi Metland Puri",
            deskripsiSingkat: "Satu porsi americano buat perayaan hari ini.",
            catatan: "Setelah kita mam lanjut ke bagian yang di tunggu tunggu, yapss ngops."
        }
    ]
};

let currentStep = 0;

// --- FUNGSI DIREVISI: Font dinamis agar tidak kepotong di HP ---
function generateTextPoints(text) {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    ctx.fillStyle = "white";

    // Otomatis mengecilkan font jika teks panjang. Pakai 'Arial' agar bentuk lurus/tegas
    let fontSize = Math.min(110, (window.innerWidth * 0.9) / (text.length * 0.5));
    ctx.font = `900 ${fontSize}px 'Arial', sans-serif`;

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.fillText(text, canvas.width / 2, canvas.height / 2);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    const points = [];

    // Resolusi titik di-set ke 7 agar bunga rapat tapi tidak menumpuk aneh
    for (let y = 0; y < canvas.height; y += 7) {
        for (let x = 0; x < canvas.width; x += 7) {
            const index = (y * canvas.width + x) * 4;
            const alpha = imageData[index + 3];

            if (alpha > 128) {
                points.push({ x, y });
            }
        }
    }

    return points;
}

// --- FUNGSI DIREVISI: Pembentukan Animasi Nama Bunga ---
function formNameAnimation(name) {
    const layer = document.getElementById('petalLayer');
    layer.innerHTML = "";

    const points = generateTextPoints(name);
    const flowers = ["flowers1.png", "flowers2.png"];
    const flowerElements = [];

    points.forEach(pt => {
        const img = document.createElement("img");
        img.src = flowers[Math.floor(Math.random() * flowers.length)];
        img.className = "big-flower";
        img.style.position = "absolute";

        // Posisi X Y dimatikan di CSS, diatur lewat transform GSAP agar lebih smooth
        img.style.left = "0px";
        img.style.top = "0px";
        img.style.width = "14px"; // Ukuran bunga dioptimalkan
        img.style.height = "auto";
        img.style.opacity = 0;
        img.style.zIndex = 9999;

        layer.appendChild(img);
        flowerElements.push(img);
    });

    // 1. Animasi Masuk: Set setiap bunga bergerak ke titik koordinat aslinya
    flowerElements.forEach((el, index) => {
        const target = points[index];
        gsap.fromTo(el,
            {
                x: (Math.random() - 0.5) * window.innerWidth * 2,
                y: window.innerHeight + 150,
                scale: 0,
                opacity: 0,
                rotation: Math.random() * 360
            },
            {
                x: target.x,
                y: target.y,
                scale: 1,
                opacity: 1,
                rotation: 0,
                duration: 1.5,
                ease: "back.out(1.2)",
                delay: Math.random() * 0.6 // Jeda acak biar organik
            }
        );
    });

    // 2. Animasi Keluar
    gsap.to(flowerElements, {
        x: () => (Math.random() - 0.5) * window.innerWidth * 2,
        y: () => (Math.random() - 0.5) * window.innerHeight * 2,
        opacity: 0,
        scale: 0,
        rotation: () => Math.random() * 360,
        duration: 1.2,
        delay: 4.2, // Tahan nama di layar selama ~4 detik
        ease: "power3.in",
        onComplete: () => {
            layer.innerHTML = "";
            showCover();
        }
    });
}

function switchScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    const targetScreen = document.getElementById(id);
    targetScreen.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (id === 'screen-steps') {
        gsap.fromTo(".step-card",
            { opacity: 0, y: 50, scale: 0.94 },
            { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: "power4.out" }
        );
        gsap.fromTo(".step-card > *",
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.5, delay: 0.2, stagger: 0.06, ease: "power3.out" }
        );
        gsap.fromTo("#btnNextStep, #stepDots",
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.5, delay: 0.4, stagger: 0.1, ease: "power2.out" }
        );
    } else if (id === 'screen-summary') {
        gsap.fromTo("#summaryCard",
            { opacity: 0, y: 60, scale: 0.98 },
            { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: "power3.out" }
        );
        gsap.fromTo("#timelineList li",
            { opacity: 0, x: -30 },
            { opacity: 1, x: 0, duration: 0.5, delay: 0.3, ease: "power2.out", stagger: 0.12 }
        );
        gsap.fromTo(".note-box, .cta-line, #btnSetuju, #btnSave, .btn-link, .save-note",
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.5, delay: 0.6, stagger: 0.08 }
        );
    } else if (id === 'screen-cover') {
        gsap.fromTo("#screen-cover",
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
        );
    }
}

function renderCover() {
    document.getElementById('planningEyebrow').textContent =
        `Planning Play ${CONFIG.pengirim} & ${CONFIG.penerima}`;
    document.getElementById('bookQuote').textContent = CONFIG.quoteBuku;
    document.getElementById('coverName').textContent = CONFIG.penerima;
    document.getElementById('coverDesc').textContent = CONFIG.introLine;
}

function renderStep(isInitial = false) {
    const total = CONFIG.steps.length;
    const s = CONFIG.steps[currentStep];

    const updateContent = () => {
        document.getElementById('stepEyebrow').textContent = `Hal kecil · ${currentStep + 1} dari ${total}`;
        document.getElementById('stepNote').textContent = s.catatan;
        document.getElementById('stepTime').textContent = `Pukul ${s.waktu}`;
        document.getElementById('stepPlace').textContent = s.tempat;
        document.getElementById('stepDesc').textContent = s.deskripsiSingkat;

        const btn = document.getElementById('btnNextStep');
        btn.textContent = (currentStep === total - 1) ? 'Lihat rencana lengkap' : 'Hal kecil berikutnya';

        const dotsWrap = document.getElementById('stepDots');
        dotsWrap.innerHTML = '';
        for (let i = 0; i < total; i++) {
            const dot = document.createElement('span');
            if (i === currentStep) dot.classList.add('active');
            dotsWrap.appendChild(dot);
        }
    };

    if (isInitial) {
        updateContent();
    } else {
        gsap.timeline()
            .to(".step-card > *", { opacity: 0, y: -15, duration: 0.22, stagger: 0.03, ease: "power2.in" })
            .to(".step-card", { scale: 0.97, duration: 0.22, ease: "power2.in" }, "<")
            .call(updateContent)
            .to(".step-card", { scale: 1, duration: 0.5, ease: "back.out(1.4)" })
            .fromTo(".step-card > *",
                { opacity: 0, y: 25 },
                { opacity: 1, y: 0, duration: 0.55, stagger: 0.05, ease: "power4.out" },
                "<"
            );
    }
}

function renderSummary() {
    document.getElementById('summaryRibbon').textContent = CONFIG.ribbon;
    document.getElementById('summaryTitle').textContent = CONFIG.judulRencana;
    document.getElementById('summarySubtitle').textContent = CONFIG.subjudul;
    document.getElementById('summaryDatetime').textContent =
        `${CONFIG.tanggal} · mulai ${CONFIG.jamMulai} · ${CONFIG.jemput}`;
    document.getElementById('noteText').textContent = CONFIG.catatanKecil;
    document.getElementById('noteSign').textContent = `${CONFIG.tandaTangan} — ${CONFIG.pengirim}`;
    document.getElementById('ctaLine').textContent = CONFIG.ctaSetuju;

    const list = document.getElementById('timelineList');
    list.innerHTML = '';
    CONFIG.steps.forEach(s => {
        const li = document.createElement('li');
        li.innerHTML = `
          <div class="tl-icon">${s.icon}</div>
          <div class="tl-body">
            <p class="tl-time">Pukul ${s.waktu}</p>
            <p class="tl-label">${s.label}</p>
            <p class="tl-place">${s.tempat}</p>
            <p class="tl-desc">${s.deskripsiSingkat}</p>
          </div>
          <div class="tl-photo">${s.icon}</div>
        `;
        list.appendChild(li);
    });

    const tagsRow = document.getElementById('tagsRow');
    tagsRow.innerHTML = '';
    CONFIG.tags.forEach(t => {
        const div = document.createElement('div');
        div.className = 'tag';
        div.innerHTML = `<span class="tag-icon">${t.icon}</span>${t.label}`;
        tagsRow.appendChild(div);
    });
}

function spawnPetals(n) {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return;

    const layer = document.getElementById('petalLayer');
    for (let i = 0; i < n; i++) {
        const wrap = document.createElement('div');
        wrap.className = 'petal';
        wrap.style.left = (Math.random() * 100) + 'vw';

        const petalSize = (30 + Math.random() * 30) + 'px';
        wrap.style.width = petalSize;
        wrap.style.height = petalSize;

        wrap.style.animationDuration = (2.4 + Math.random() * 1.8) + 's';
        wrap.style.animationDelay = (Math.random() * 0.6) + 's';
        wrap.innerHTML = `<svg viewBox="0 0 200 200" style="width:100%;height:100%;color:${Math.random() > .5 ? '#EFC576' : '#E2A94F'}"><use href="#petalShape"/></svg>`;
        layer.appendChild(wrap);
        setTimeout(() => wrap.remove(), 5000);
    }
}

// --- EVENT LISTENERS ---
document.getElementById('btnOpenBook').addEventListener('click', () => {
    document.getElementById('bookCover').classList.add('opened');
    spawnPetals(16);
    document.getElementById('btnOpenBook').style.display = 'none';
    setTimeout(() => {
        document.getElementById('startNextWrap').classList.add('show');
    }, 700);
});

document.getElementById('btnMulai').addEventListener('click', () => {
    currentStep = 0;
    renderStep(true);
    switchScreen('screen-steps');
});

document.getElementById('btnNextStep').addEventListener('click', () => {
    if (currentStep < CONFIG.steps.length - 1) {
        currentStep++;
        renderStep(false);
    } else {
        renderSummary();
        switchScreen('screen-summary');
    }
});

document.getElementById('btnSetuju').addEventListener('click', (e) => {
    e.target.textContent = CONFIG.ctaSetelahKlik;
    e.target.disabled = true;
    spawnPetals(20);
});

document.getElementById('btnReset').addEventListener('click', () => {
    currentStep = 0;
    document.getElementById('bookCover').classList.remove('opened');
    document.getElementById('btnOpenBook').style.display = 'block';
    document.getElementById('startNextWrap').classList.remove('show');
    const btnSetuju = document.getElementById('btnSetuju');
    btnSetuju.disabled = false;
    btnSetuju.textContent = 'Aku ikut';
    switchScreen('screen-cover');
});

document.getElementById('btnSave').addEventListener('click', (e) => {
    const btn = e.target;
    const original = btn.textContent;
    btn.textContent = 'Menyiapkan gambar...';
    btn.disabled = true;

    function doCapture() {
        html2canvas(document.getElementById('summaryCard'), {
            backgroundColor: '#FBF1DE',
            scale: 2
        }).then(canvas => {
            const link = document.createElement('a');
            link.download = 'rencana-kencan.png';
            link.href = canvas.toDataURL('image/png');
            link.click();
            btn.textContent = original;
            btn.disabled = false;
        }).catch(() => {
            alert('Gagal menyimpan gambar. Coba screenshot manual ya.');
            btn.textContent = original;
            btn.disabled = false;
        });
    }

    if (window.html2canvas) {
        doCapture();
    } else {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
        script.onload = doCapture;
        script.onerror = () => {
            alert('Tidak bisa memuat fitur simpan gambar (perlu koneksi internet). Coba screenshot manual ya.');
            btn.textContent = original;
            btn.disabled = false;
        };
        document.head.appendChild(script);
    }
});

renderCover();
renderStep(true);

// --- GSAP LOADING TO COVER ANIMATION ---
const progressBar = document.querySelector('.loading-progress');
const percentText = document.getElementById('loadingPercent');
const loadingScreen = document.getElementById('loadingScreen');

gsap.to(".loading-flower", { rotation: 360, duration: 10, repeat: -1, ease: "none" });
gsap.to(".orbit-inner", { rotation: 360, duration: 4, repeat: -1, ease: "none" });
gsap.to(".orbit-outer", { rotation: -360, duration: 5.5, repeat: -1, ease: "none" });

let progress = { value: 0 };

gsap.to(progress, {
    value: 100,
    duration: 3,
    ease: 'power2.out',
    onUpdate: () => {
        const current = Math.floor(progress.value);
        progressBar.style.width = current + '%';
        percentText.textContent = current + '%';
    },
    onComplete: () => {
        gsap.set("#screen-cover", { opacity: 0, y: 40, scale: 0.94 });
        const tl = gsap.timeline();
        tl.to(".loading-flower", { scale: 4.5, duration: 0.6, ease: "power3.in" });
        tl.to(".orbit-inner, .orbit-outer", { scale: 2, opacity: 0, duration: 0.5, ease: "power3.in" }, "<");
        tl.to(".loading-text, .loading-bar, #loadingPercent", { opacity: 0, duration: 0.3 }, "<");
        tl.to("#flashbang", {
            opacity: 1,
            duration: 0.05,
            onComplete: () => {
                loadingScreen.remove();

                spawnFlowerBurst();

                setInterval(() => {
                    spawnPetals(Math.floor(Math.random() * 2) + 1);
                }, 1200);
            }
        });
        tl.to("#flashbang", { opacity: 0, duration: 1.8, ease: "power2.out", onComplete: () => { document.getElementById('flashbang').remove(); } });
    }
});

function spawnFlowerBurst() {
    const layer = document.getElementById('petalLayer');
    layer.innerHTML = "";

    const flowers = ["flowers1.png", "flowers2.png"];
    const items = [];
    const spacing = 120;

    const cols = Math.ceil(window.innerWidth / spacing) + 2;
    const rows = Math.ceil(window.innerHeight / spacing) + 2;

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const img = document.createElement("img");
            img.src = flowers[Math.floor(Math.random() * flowers.length)];
            img.className = "big-flower";

            const size = 170 + Math.random() * 220;
            const x = c * spacing + (Math.random() * 40 - 20);
            const y = r * spacing + (Math.random() * 40 - 20);

            img.style.position = "absolute";
            img.style.left = x + "px";
            img.style.top = y + "px";
            img.style.width = size + "px";
            img.style.height = "auto";
            img.style.transform = "translate(-50%, -50%) scale(0.2)";
            img.style.opacity = 0;

            layer.appendChild(img);
            items.push(img);

            gsap.to(img, {
                opacity: 1,
                scale: 1,
                duration: 0.7,
                ease: "power4.out"
            });
        }
    }

    items.forEach(el => {
        gsap.to(el, {
            rotation: (Math.random() - 0.5) * 10,
            x: "+=" + (Math.random() * 10 - 5),
            y: "+=" + (Math.random() * 10 - 5),
            duration: 1.4,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });
    });

    setTimeout(() => {
        gsap.to(items, {
            x: () => (Math.random() - 0.5) * window.innerWidth * 1.2,
            y: -window.innerHeight - 300,
            opacity: 0,
            scale: 0.2,
            duration: 1,
            stagger: 0.015,
            ease: "power3.in",
            onComplete: () => {
                layer.innerHTML = "";
                formNameAnimation("C I P A A");
            }
        });
    }, 1800);
}

function showCover() {
    const cover = document.getElementById('screen-cover');

    gsap.set(cover, {
        opacity: 0,
        y: 40,
        scale: 0.95
    });

    gsap.to(cover, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1.2,
        ease: "power3.out"
    });
}
