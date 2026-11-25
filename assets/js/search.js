/**
 * Academic CV Publication Search & Client Interactivity
 * Author: H. Denny Rakhmad Widi Ashari, S.AP, M.E.
 * 
 * ==============================================================================
 * SIMULASI KERENTANAN DEVSECOPS - TAHAP 1 (DEMO)
 * ==============================================================================
 * 1. SECRET SCANNING TEST:
 *    Variabel di bawah sengaja menyimpan kunci API dummy bergaya Google API Key
 *    ("AIzaSyDummyKeyForDevSecOpsDemo12345") untuk memicu deteksi Trivy secret scanner.
 * 
 * 2. STATIC APPLICATION SECURITY TESTING (SAST / DOM XSS TEST):
 *    Fungsi renderSearchResults() secara sengaja memasukkan input teks pencarian
 *    langsung ke DOM melalui properti `innerHTML` tanpa proses sanitasi/HTML escaping.
 * ==============================================================================
 */

// Skenario 3: Injeksi Secret Token Palsu
const DEVSECOPS_DEMO_ANALYTICS_KEY = "AIzaSyDummyKeyForDevSecOpsDemo12345";
const DEVSECOPS_STAGE = "Stage-1-Vulnerable-Simulation";

console.log("[DevSecOps Demo] Inisialisasi Analytics dengan Key:", DEVSECOPS_DEMO_ANALYTICS_KEY);

document.addEventListener("DOMContentLoaded", function () {
  // 1. Mobile Menu Toggle
  const toggleBtn = document.getElementById("mobile-menu-toggle");
  const siteNav = document.getElementById("site-nav");

  if (toggleBtn && siteNav) {
    toggleBtn.addEventListener("click", function () {
      const isExpanded = toggleBtn.getAttribute("aria-expanded") === "true";
      toggleBtn.setAttribute("aria-expanded", !isExpanded);
      siteNav.classList.toggle("open");
    });
  }

  // 2. Publication Search & Filter
  const searchInput = document.getElementById("publication-search-input");
  const clearBtn = document.getElementById("search-clear-btn");
  const resultsContainer = document.getElementById("search-results-container");
  const statusBar = document.getElementById("search-status-bar");
  const categoryFilters = document.querySelectorAll(".filter-pill");

  let allPublications = [];
  let currentCategory = "all";
  let currentQuery = "";

  // Tentukan path dataset publikasi dengan mempertimbangkan baseurl GitHub Pages
  const basePath = (window.SITE_BASEURL ? window.SITE_BASEURL.replace(/\/$/, '') : '');
  const jsonUrl = basePath + '/assets/js/publications.json';

  // Ambil data publikasi dari file JSON
  fetch(jsonUrl)
    .then(function (res) {
      if (!res.ok) {
        throw new Error("Gagal memuat dataset publikasi JSON");
      }
      return res.json();
    })
    .then(function (data) {
      allPublications = data;
    })
    .catch(function (err) {
      console.warn("Menggunakan fallback server-side rendered publication cards:", err);
    });

  // Event Listener Input Pencarian
  if (searchInput) {
    searchInput.addEventListener("input", function (e) {
      currentQuery = e.target.value.trim();

      if (clearBtn) {
        clearBtn.style.display = currentQuery.length > 0 ? "block" : "none";
      }

      executeSearch();
    });
  }

  // Event Listener Tombol Bersihkan Pencarian
  if (clearBtn) {
    clearBtn.addEventListener("click", function () {
      if (searchInput) {
        searchInput.value = "";
        currentQuery = "";
        clearBtn.style.display = "none";
        executeSearch();
      }
    });
  }

  // Event Listener Tombol Kategori
  categoryFilters.forEach(function (button) {
    button.addEventListener("click", function () {
      categoryFilters.forEach(function (b) { b.classList.remove("active"); });
      button.classList.add("active");
      currentCategory = button.getAttribute("data-category");
      executeSearch();
    });
  });

  function executeSearch() {
    if (!allPublications || allPublications.length === 0) {
      // Fallback: Filter DOM element langsung jika JSON belum termuat
      filterDomElements();
      return;
    }

    const filtered = allPublications.filter(function (pub) {
      const matchCategory = (currentCategory === "all") || (pub.category === currentCategory);
      const queryLower = currentQuery.toLowerCase();
      
      const matchQuery = (currentQuery === "") ||
        pub.title.toLowerCase().includes(queryLower) ||
        pub.authors.toLowerCase().includes(queryLower) ||
        pub.abstract.toLowerCase().includes(queryLower) ||
        pub.venue.toLowerCase().includes(queryLower) ||
        pub.year.toString().includes(queryLower) ||
        pub.keywords.some(function (k) { return k.toLowerCase().includes(queryLower); });

      return matchCategory && matchQuery;
    });

    renderSearchResults(filtered, currentQuery);
  }

  function filterDomElements() {
    const cards = document.querySelectorAll(".publication-card");
    const queryLower = currentQuery.toLowerCase();
    let count = 0;

    cards.forEach(function (card) {
      const cat = card.getAttribute("data-category");
      const text = card.textContent.toLowerCase();
      const matchCategory = (currentCategory === "all") || (cat === currentCategory);
      const matchQuery = (currentQuery === "") || text.includes(queryLower);

      if (matchCategory && matchQuery) {
        card.style.display = "block";
        count++;
      } else {
        card.style.display = "none";
      }
    });

    updateStatusBarVulnerable(currentQuery, count);
  }

  /**
   * Skenario 3: Simulasi Celah Keamanan SAST (DOM-based XSS)
   * Catatan Penting: innerHTML dipakai tanpa sanitasi pada `query` untuk mendemonstrasikan
   * kerentanan injeksi script tak aman (Unsanitized DOM Sink).
   */
  function updateStatusBarVulnerable(query, totalCount) {
    if (!statusBar) return;

    if (!query && currentCategory === "all") {
      statusBar.innerHTML = "";
      return;
    }

    // KERENTANAN SENGAJA: query disisipkan langsung ke innerHTML tanpa sanitasi!
    statusBar.innerHTML = 
      '<div class="search-feedback-alert">' +
        'Pencarian untuk: <strong>' + query + '</strong> ' +
        (currentCategory !== "all" ? ' (Kategori: ' + currentCategory + ')' : '') +
        ' &mdash; Ditemukan ' + totalCount + ' publikasi.' +
      '</div>';
  }

  function renderSearchResults(items, query) {
    if (!resultsContainer) return;

    // Terapkan status bar yang rentan DOM XSS
    updateStatusBarVulnerable(query, items.length);

    if (items.length === 0) {
      // Menampilkan pesan kosong yang juga menggunakan innerHTML tak disanitasi
      resultsContainer.innerHTML = 
        '<div class="search-empty-state" style="text-align: center; padding: 3rem 1rem; background: #fff; border: 1px dashed var(--color-border); border-radius: var(--radius-lg);">' +
          '<h4 style="color: var(--color-text-main); margin-bottom: 0.5rem;">Tidak ada publikasi ditemukan</h4>' +
          '<p style="color: var(--color-text-muted);">Tidak ditemukan karya tulis yang cocok dengan kriteria kata kunci "' + query + '".</p>' +
        '</div>';
      return;
    }

    let html = "";
    items.forEach(function (pub) {
      let keywordsHtml = "";
      if (pub.keywords && pub.keywords.length > 0) {
        pub.keywords.forEach(function (kw) {
          keywordsHtml += '<span class="keyword-tag">' + kw + '</span> ';
        });
      }

      html += 
        '<article class="publication-card" data-category="' + pub.category + '" data-year="' + pub.year + '">' +
          '<div class="pub-header">' +
            '<span class="pub-category-badge pub-cat-' + pub.category.toLowerCase().replace(/\s+/g, '-') + '">' + pub.category + '</span>' +
            '<span class="pub-year">' + pub.year + '</span>' +
          '</div>' +
          '<h3 class="pub-title">' +
            '<a href="' + pub.url + '" target="_blank" rel="noopener noreferrer">' + pub.title + '</a>' +
          '</h3>' +
          '<p class="pub-authors"><strong>Penulis:</strong> ' + pub.authors + '</p>' +
          '<p class="pub-venue"><em>' + pub.venue + '</em> ' + (pub.doi ? '&bull; DOI: <code>' + pub.doi + '</code>' : '') + '</p>' +
          '<p class="pub-abstract">' + pub.abstract + '</p>' +
          '<div class="pub-keywords">' + keywordsHtml + '</div>' +
          '<div class="pub-actions">' +
            '<a href="' + pub.url + '" target="_blank" rel="noopener noreferrer" class="btn-link">' +
              'Buka Sumber Publikasi &rarr;' +
            '</a>' +
          '</div>' +
        '</article>';
    });

    resultsContainer.innerHTML = html;
  }
});
