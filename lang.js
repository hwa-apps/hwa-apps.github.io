// Robusztus nyelvváltó zászlós legördülőhöz
(function () {
  const PAGE_MAP = {
    'index.html':            { en: 'index.html',             hu: 'index_hu.html' },
    'index_hu.html':         { en: 'index.html',             hu: 'index_hu.html' },
    'koordkonvert.html':     { en: 'koordkonvert.html',      hu: 'koordkonvert_hu.html' },
    'koordkonvert_hu.html':  { en: 'koordkonvert.html',      hu: 'koordkonvert_hu.html' },
    'hoggps.html':           { en: 'hoggps.html',            hu: 'hoggps_hu.html' },
    'hoggps_hu.html':        { en: 'hoggps.html',            hu: 'hoggps_hu.html' },
    'coords.html':           { en: 'coords.html',            hu: 'coords_hu.html' },
    'coords_hu.html':        { en: 'coords.html',            hu: 'coords_hu.html' },
    'privacy.html':          { en: 'privacy.html',           hu: 'privacy_hu.html' },
    'privacy_hu.html':       { en: 'privacy.html',           hu: 'privacy_hu.html' },
  };

  const FLAG_SRC = {
    en: 'images/eng_us_flag.png',
    hu: 'images/hun_flag.png',
  };

  function getCurrentFile() {
    const f = window.location.pathname.split('/').pop();
    return f && f.length ? f : 'index.html';
  }

  function inferLangFromFile(file) {
    return file.endsWith('_hu.html') ? 'hu' : 'en';
  }

  function getTargetFile(lang, currentFile) {
    const map = PAGE_MAP[currentFile];
    if (map && map[lang]) return map[lang];
    return lang === 'hu' ? 'index_hu.html' : 'index.html';
  }

  function setCurrentFlag(imgEl, lang) {
    if (imgEl && FLAG_SRC[lang]) {
      imgEl.src = FLAG_SRC[lang];
      imgEl.alt = lang === 'hu' ? 'Magyar' : 'English';
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    const currentFile = getCurrentFile();

    // Beállítjuk/kiolvassuk a választott nyelvet
    let savedLang = localStorage.getItem('hwaLang');
    if (!savedLang) {
      savedLang = inferLangFromFile(currentFile);
      localStorage.setItem('hwaLang', savedLang);
    }

    // Ha nem a választott nyelvű oldalon vagyunk, átirányítunk
    const expected = getTargetFile(savedLang, currentFile);
    if (expected !== currentFile) {
      window.location.replace(expected);
      return;
    }

    // Zászló és legördülő működtetése
    const btn = document.querySelector('.lang-btn');
    const dropdown = document.querySelector('.lang-dropdown');
    const currentFlag = document.getElementById('current-flag');

    setCurrentFlag(currentFlag, savedLang);

    if (btn && dropdown) {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdown.style.display = (dropdown.style.display === 'flex') ? 'none' : 'flex';
      });

      dropdown.addEventListener('click', (e) => {
        const img = e.target.closest('img[data-lang]');
        if (!img) return;
        const newLang = img.dataset.lang;
        if (newLang !== savedLang) {
          localStorage.setItem('hwaLang', newLang);
          const target = getTargetFile(newLang, getCurrentFile());
          if (target !== getCurrentFile()) {
            window.location.href = target;
            return;
          } else {
            setCurrentFlag(currentFlag, newLang);
          }
        }
        dropdown.style.display = 'none';
      });

      document.addEventListener('click', () => {
        dropdown.style.display = 'none';
      });
    }
  });
})();
