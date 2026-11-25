# Product Requirements Document (PRD)
## Website Curriculum Vitae (CV) & Profil Akademik H. Denny Rakhmad Widi Ashari

---

### 1. Ringkasan Eksekutif & Tujuan Proyek
Proyek ini bertujuan membangun website personal Curriculum Vitae (CV) dan Profil Akademik profesional berbasis Static Site Generator (Jekyll) yang siap di-host pada GitHub Pages. Selain berfungsi sebagai etalase rekam jejak akademik, publikasi riset, dan pengajaran, repositori ini didesain sebagai sarana edukasi dan demonstrasi simulasi **Lean DevSecOps Pipeline**.

Website ini mengintegrasikan seluruh identitas profil akademik resmi dan mendemonstrasikan siklus deteksi kerentanan otomatis (Trivy SCA, Secret Scanning, dan SAST) serta strategi remediasi/patching.

---

### 2. Informasi Profil Akademik Resmi
Semua identitas akademik berikut wajib disajikan secara akurat tanpa modifikasi URL atau ID:
- **Nama Lengkap & Gelar**: H. Denny Rakhmad Widi Ashari, S.AP, M.E.
- **Afiliasi**: Dosen Universitas Nahdlatul Ulama Blitar (UNU Blitar)
- **Bidang Keahlian**: Operations Management, Islamic Banking, dan Digital Banking
- **Email Resmi**: masden@klikada.com
- **Website Utama**: [https://masden.klikada.com](https://masden.klikada.com)

#### Indeksasi & Identitas Akademik Terverifikasi:
1. **SINTA (Science and Technology Index)**:
   - ID: `6802917`
   - Profil URL: [https://sinta.kemdikbud.go.id/authors/profile/6802917#!](https://sinta.kemdikbud.go.id/authors/profile/6802917#!)
2. **Garuda (Garba Rujukan Digital)**:
   - ID: `647389`
   - Profil URL: [https://garuda.kemdikbud.go.id/author/view/6473096#!](https://garuda.kemdikbud.go.id/author/view/6473096#!)
3. **Google Scholar**:
   - Profil URL: [https://scholar.google.com/citations?user=36C13s4AAAAJ&hl=id](https://scholar.google.com/citations?user=36C13s4AAAAJ&hl=id)
4. **ORCID (Open Researcher and Contributor ID)**:
   - ID: `0000-0003-2251-6393`
   - Profil URL: [https://orcid.org/0000-0003-2251-6393](https://orcid.org/0000-0003-2251-6393)
5. **Web of Science (WoS) ResearcherID**:
   - ID: `GPK-6712-2022`
   - Profil URL: [https://www.webofscience.com/wos/author/record/GPK-6712-2022](https://www.webofscience.com/wos/author/record/GPK-6712-2022)
6. **CoLab (Collaborative Research Network)**:
   - ID: `R-3AE4E-0C776-QE46W`
   - Profil URL: [https://colab.ws/researchers/R-3AE4E-0C776-QE46W](https://colab.ws/researchers/R-3AE4E-0C776-QE46W)
7. **AD Scientific Index**:
   - ID: `6191323`
   - Profil URL: [https://www.adscientificindex.com/scientist/denny-rakhmad-widi-ashari/6191323](https://www.adscientificindex.com/scientist/denny-rakhmad-widi-ashari/6191323)

---

### 3. Persyaratan Fungsional
1. **Halaman Utama (Landing Page)**:
   - Header & Hero Section menampilkan nama, gelar, jabatan, foto/avatar representatif, afiliasi universitas, kontak, dan tautan media.
   - Kartu / Badge Indeksasi Akademik (SINTA, Garuda, Scholar, ORCID, WoS, CoLab, AD Scientific Index) yang interaktif, responsif, dan langsung mengarah ke halaman profil eksternal masing-masing.
   - Ringkasan profil biografi, fokus riset (Operations Management, Islamic Banking, Digital Banking).
   - Pengalaman Akademik & Pengajaran, Riwayat Pendidikan.
2. **Katalog Publikasi & Pencarian Interaktif**:
   - Daftar publikasi jurnal, buku, dan proceeding.
   - Fitur pencarian instan (client-side search bar) dengan filter kata kunci, kategori, dan tahun terbit berbasis JavaScript tanpa memerlukan reload halaman.
3. **Desain & Responsivitas**:
   - Tampilan bersih (clean), modern, cepat diakses (zero bloatware), tipografi nyaman dibaca, dan fully mobile-responsive.

---

### 4. Skenario Simulasi DevSecOps (Tahap Demo Kerentanan vs Remediasi)
Website ini mengimplementasikan dua tahapan simulasi:

#### Tahap 1: Injeksi Kerentanan (Demo Vulnerabilities)
1. **Software Composition Analysis (SCA) - Vulnerable Gems**:
   - `Gemfile` dan `Gemfile.lock` memuat versi dependensi yang diketahui memiliki CVE publik berstatus HIGH/CRITICAL (contoh: `gem "nokogiri", "1.10.4"` yang terasosiasi dengan CVE memory issue/command injection, dan `gem "jekyll", "3.8.5"`).
2. **Secret Scanning - Hardcoded Credential / API Key**:
   - Injeksi string token API palsu bermotif kunci Google API (`analytics_api_key: "AIzaSyDummyKeyForDevSecOpsDemo12345"`) pada konfigurasi `_config.yml` dan script client-side `assets/js/search.js`.
3. **Static Application Security Testing (SAST) - DOM-based Cross-Site Scripting (XSS)**:
   - Implementasi pencarian pada `assets/js/search.js` yang langsung merender query pencarian pengguna menggunakan `element.innerHTML` tanpa escaping/sanitasi input (`<div>Hasil untuk: " + query + "</div>`).

#### Tahap 2: Remediasi (Patched State)
- Peningkatan versi library ke versi terbaru yang aman (Green SCA).
- Pemindahan / penghapusan token sensitif dan penggunaan environment variable jika dibutuhkan (Clean Secret Scan).
- Sanitasi input dan penggunaan `textContent` / safe DOM manipulation (Clean SAST).

---

### 5. Metrik Keberhasilan
- Build Jekyll berjalan sukses di GitHub Pages.
- Trivy Security Scanner dapat mendeteksi celah keamanan pada tahap 1 dengan `exit-code: 1` saat workflow dijalankan.
- Tampilan UI tetap elegan, interaktif, dan akurat menampilkan profil H. Denny Rakhmad Widi Ashari.
