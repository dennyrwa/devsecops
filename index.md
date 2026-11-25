---
layout: default
title: "H. Denny Rakhmad Widi Ashari, S.AP, M.E. - Profil Akademik & CV"
---

<!-- 1. Hero Section -->
{% include hero.html %}

<!-- 2. Academic Profiles & Indexation Badges (Scenario 1) -->
{% include profiles_badges.html %}

<!-- 3. Interactive Publications & Research Section with Client-Side Search -->
{% include publications_search.html %}

<!-- 4. Experience, Education, and Teaching Section -->
<section id="pengalaman" class="section cv-section">
  <div class="container">
    <div class="section-header">
      <div class="section-badge">Rekam Jejak & Pengabdian</div>
      <h2 class="section-title">Riwayat Akademik & Pengalaman</h2>
      <p class="section-description">
        Perjalanan studi, pengajaran, dan dedikasi keilmuan dalam mencerdaskan generasi penerus di bidang ekonomi dan perbankan syariah.
      </p>
    </div>

    <div class="cv-grid">
      <!-- Kolom Pengalaman Kerja & Mengajar -->
      <div class="cv-column">
        <h3 class="cv-col-title">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
          Pengalaman Akademik & Profesional
        </h3>
        <div class="timeline">
          {% for exp in site.data.cv.experience %}
          <div class="timeline-item">
            <div class="timeline-marker"></div>
            <div class="timeline-content">
              <span class="timeline-period">{{ exp.period }}</span>
              <h4 class="timeline-role">{{ exp.role }}</h4>
              <p class="timeline-institution">{{ exp.institution }} &bull; {{ exp.location }}</p>
              <p class="timeline-description">{{ exp.description }}</p>
            </div>
          </div>
          {% endfor %}
        </div>

        <h3 class="cv-col-title mt-8">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
          Mata Kuliah Diampu
        </h3>
        <div class="teaching-cards">
          {% for course in site.data.cv.teaching %}
          <div class="teaching-card">
            <span class="teaching-level">{{ course.level }}</span>
            <h4 class="teaching-name">{{ course.course }}</h4>
            <p class="teaching-topics">{{ course.topics }}</p>
          </div>
          {% endfor %}
        </div>
      </div>

      <!-- Kolom Pendidikan & Keahlian -->
      <div class="cv-column">
        <h3 class="cv-col-title">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
          Riwayat Pendidikan
        </h3>
        <div class="timeline">
          {% for edu in site.data.cv.education %}
          <div class="timeline-item">
            <div class="timeline-marker"></div>
            <div class="timeline-content">
              <span class="timeline-period">{{ edu.year }}</span>
              <h4 class="timeline-role">{{ edu.degree }}</h4>
              <p class="timeline-institution">{{ edu.field }} &bull; {{ edu.institution }}</p>
              <p class="timeline-description">{{ edu.description }}</p>
            </div>
          </div>
          {% endfor %}
        </div>

        <h3 class="cv-col-title mt-8">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          Kompetensi & Perangkat Riset
        </h3>
        <div class="skills-block">
          {% for group in site.data.cv.skills %}
          <div class="skill-group">
            <h4 class="skill-group-name">{{ group.category }}</h4>
            <div class="skill-tags">
              {% for skill in group.items %}
              <span class="skill-badge">{{ skill }}</span>
              {% endfor %}
            </div>
          </div>
          {% endfor %}
        </div>
      </div>
    </div>
  </div>
</section>
