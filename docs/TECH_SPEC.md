# Technical Specification (TECH_SPEC)
## Arsitektur & Implementasi Website CV Akademik Jekyll + Lean DevSecOps

---

### 1. Struktur Direktori Proyek
Struktur proyek mengikuti konvensi standar Jekyll Static Site Generator:

```
cv-jekyll-devsecops/
├── .github/
│   └── workflows/
│       └── lean-devsecops.yml     # Pipeline CI/CD GitHub Actions + Trivy Security Scan
├── _config.yml                    # Konfigurasi Jekyll global (disimulasikan secret leak)
├── Gemfile                        # Konfigurasi gem dependencies (versi rentan untuk SCA)
├── Gemfile.lock                   # Lockfile versi terpasang untuk analisis SCA
├── _data/
│   ├── profiles.yml               # Data terstruktur profil akademik & tautan indeksasi
│   ├── publications.yml           # Data publikasi ilmiah, buku, dan proceeding
│   └── cv.yml                     # Data riwayat pendidikan, pengalaman, dan keahlian
├── _includes/
│   ├── header.html                # Navigasi & branding
│   ├── hero.html                  # Ringkasan profil dosen
│   ├── profiles_badges.html       # Grid kartu & lencana indeksasi akademik resmi
│   ├── publications_search.html   # Form & wadah hasil pencarian publikasi
│   └── footer.html                # Informasi hak cipta & kontak
├── _layouts/
│   └── default.html               # Layout dasar HTML5 responsif
├── assets/
│   ├── css/
│   │   └── style.css              # Styling modern, clean academic theme
│   └── js/
│       ├── publications.json      # Dataset publikasi untuk pencarian sisi klien
│       └── search.js              # Logika pencarian publikasi (simulasi DOM XSS & token)
├── docs/
│   ├── PRD.md                     # Product Requirements Document
│   └── TECH_SPEC.md               # Technical Specification Document
└── index.md                       # Halaman utama (berisi integrasi include dan konten)
```

---

### 2. Spesifikasi Data & Manajemen Profil (`_data/profiles.yml`)
Data profil dipisahkan secara deklaratif di `_data/profiles.yml` untuk memudahkan pemeliharaan tanpa menyentuh markup presentasi:

```yaml
author:
  name: "H. Denny Rakhmad Widi Ashari, S.AP, M.E."
  title: "Dosen & Peneliti"
  institution: "Universitas Nahdlatul Ulama Blitar"
  expertise: "Operations Management, Islamic Banking, dan Digital Banking"
  email: "masden@klikada.com"
  website: "https://masden.klikada.com"

academic_profiles:
  - id: "sinta"
    name: "SINTA"
    full_name: "Science and Technology Index"
    identifier: "6802917"
    url: "https://sinta.kemdikbud.go.id/authors/profile/6802917#!"
    badge_color: "#16a34a"
    icon: "award"
  - id: "garuda"
    name: "Garuda"
    full_name: "Garba Rujukan Digital"
    identifier: "647389"
    url: "https://garuda.kemdikbud.go.id/author/view/6473096#!"
    badge_color: "#dc2626"
    icon: "book-open"
  - id: "scholar"
    name: "Google Scholar"
    full_name: "Google Scholar Citations"
    identifier: "36C13s4AAAAJ"
    url: "https://scholar.google.com/citations?user=36C13s4AAAAJ&hl=id"
    badge_color: "#2563eb"
    icon: "graduation-cap"
  - id: "orcid"
    name: "ORCID"
    full_name: "Open Researcher and Contributor ID"
    identifier: "0000-0003-2251-6393"
    url: "https://orcid.org/0000-0003-2251-6393"
    badge_color: "#a3e635"
    icon: "fingerprint"
  - id: "wos"
    name: "Web of Science"
    full_name: "Clarivate Web of Science ResearcherID"
    identifier: "GPK-6712-2022"
    url: "https://www.webofscience.com/wos/author/record/GPK-6712-2022"
    badge_color: "#9333ea"
    icon: "globe"
  - id: "colab"
    name: "CoLab"
    full_name: "Collaborative Research Network"
    identifier: "R-3AE4E-0C776-QE46W"
    url: "https://colab.ws/researchers/R-3AE4E-0C776-QE46W"
    badge_color: "#0284c7"
    icon: "users"
  - id: "adscientific"
    name: "AD Scientific Index"
    full_name: "World Scientist and University Rankings"
    identifier: "6191323"
    url: "https://www.adscientificindex.com/scientist/denny-rakhmad-widi-ashari/6191323"
    badge_color: "#d97706"
    icon: "trending-up"
```

---

### 3. Simulasi Kerentanan (Tahap 1 - DevSecOps Demo)

#### A. Software Composition Analysis (SCA)
- **File**: `Gemfile` & `Gemfile.lock`
- **Kerentanan**:
  - `nokogiri (= 1.10.4)`: Memiliki CVE kritis (seperti CVE-2019-5477, CVE-2020-26247).
  - `jekyll (= 3.8.5)`: Memiliki celah directory traversal dan unsafe deserialization (CVE-2020-14001).
- **Deteksi**: Trivy filesystem scanner membaca `Gemfile.lock` dan memetakan versi terhadap database NVD/GitHub Security Advisory.

#### B. Secret Leakage Detection
- **File**: `_config.yml` & `assets/js/search.js`
- **Pola**: `analytics_api_key: "AIzaSyDummyKeyForDevSecOpsDemo12345"`
- **Deteksi**: Aturan regular expression Trivy secret scanning (`google-api-key`) memicu temuan severity HIGH.

#### C. Static Application Security Testing (SAST) - DOM XSS
- **File**: `assets/js/search.js`
- **Pola**: Penggunaan `element.innerHTML` untuk menampilkan parameter query pencarian tanpa encoding HTML (`innerHTML = '<div class="search-feedback">Hasil untuk: ' + query + '</div>'`).
- **Deteksi**: Linter SAST / Semgrep / Trivy Misconfig / SonarQube mendeteksi sink XSS client-side yang berpotensi mengeksekusi script tak terpercaya.

---

### 4. Desain CI/CD Pipeline Lean DevSecOps (`.github/workflows/lean-devsecops.yml`)
Workflow GitHub Actions dirancang dengan prinsip "Fail Fast" dan gerbang keamanan (Security Gate):

1. **Trigger**: Push ke branch `main` / `master` atau Pull Request.
2. **Tahapan**:
   - Checkout kode repositori.
   - Setup Ruby & validasi dependensi.
   - Menjalankan **Trivy Vulnerability & Secret Scanner** (`aquasecurity/trivy-action`):
     - `scan-type: 'fs'`
     - `scanners: 'vuln,secret,misconfig'`
     - `severity: 'CRITICAL,HIGH'`
     - `exit-code: '1'` (Membuat build gagal jika ditemukan kerentanan berisiko tinggi).
   - Build Jekyll static site (`bundle exec jekyll build`).
   - Deployment ke GitHub Pages (hanya jika lolos uji keamanan).

---

### 5. Panduan Remediasi (Persiapan Tahap 2)
1. Perbarui `Gemfile` ke versi aman (`nokogiri >= 1.15.5` atau hapus spesifikasi versi lama, `jekyll ~> 4.3`).
2. Hapus token sensitif dari `_config.yml` dan `assets/js/search.js`.
3. Ganti manipulasi `innerHTML` dengan `textContent` atau sanitasi input menggunakan helper DOM.
