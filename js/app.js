(function () {
  'use strict';

  // Apply saved theme immediately to prevent any flash of unstyled theme (FOUC)
  var savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    document.documentElement.setAttribute('data-theme', savedTheme);
  }

  function getActiveTheme() {
    var explicit = document.documentElement.getAttribute('data-theme');
    if (explicit) return explicit;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function updateThemeMeta(theme) {
    var meta = document.querySelector('meta[name="theme-color"]:not([media])');
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'theme-color';
      document.head.appendChild(meta);
    }
    meta.content = theme === 'dark' ? '#0d120f' : '#f1f5f0';
  }

  function updateToggleUI(theme) {
    var toggleBtn = document.getElementById('theme-toggle');
    updateThemeMeta(theme);
    if (!toggleBtn) return;
    var isDark = theme === 'dark';
    toggleBtn.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
    toggleBtn.setAttribute('title', isDark ? 'Switch to light mode' : 'Switch to dark mode');
  }

  function initScrollSpy() {
    var navLinks = document.querySelectorAll('.nav__menu .nav__link');
    if (!navLinks.length) return;

    var linkMap = {};
    var sections = [];

    Array.prototype.forEach.call(navLinks, function (link) {
      var href = link.getAttribute('href');
      if (href && href.charAt(0) === '#') {
        var id = href.slice(1);
        var target = document.getElementById(id);
        if (target) {
          linkMap[id] = link;
          sections.push(target);
        }
      }
    });

    if (!sections.length) return;

    var currentActiveId = null;

    function setActiveLink(id) {
      if (currentActiveId === id) return;
      currentActiveId = id;

      Array.prototype.forEach.call(navLinks, function (link) {
        link.classList.remove('nav__link--active');
        link.removeAttribute('aria-current');
      });

      if (id && linkMap[id]) {
        linkMap[id].classList.add('nav__link--active');
        linkMap[id].setAttribute('aria-current', 'true');
      }
    }

    if ('IntersectionObserver' in window) {
      var visibleSections = {};

      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              visibleSections[entry.target.id] = true;
            } else {
              delete visibleSections[entry.target.id];
            }
          });

          var scrollY = window.pageYOffset || document.documentElement.scrollTop;
          if (scrollY < 120) {
            setActiveLink(null);
            return;
          }

          var isAtBottom = window.innerHeight + scrollY >= document.documentElement.scrollHeight - 50;
          if (isAtBottom && sections.length) {
            setActiveLink(sections[sections.length - 1].id);
            return;
          }

          var keys = Object.keys(visibleSections);
          if (keys.length > 0) {
            var candidateId = null;
            var minTop = Infinity;

            keys.forEach(function (id) {
              var el = document.getElementById(id);
              if (el) {
                var rect = el.getBoundingClientRect();
                if (rect.top <= window.innerHeight * 0.6 && rect.bottom >= 75) {
                  if (rect.top < minTop) {
                    minTop = rect.top;
                    candidateId = id;
                  }
                }
              }
            });

            if (candidateId) {
              setActiveLink(candidateId);
            } else {
              for (var i = 0; i < sections.length; i++) {
                if (visibleSections[sections[i].id]) {
                  setActiveLink(sections[i].id);
                  break;
                }
              }
            }
          }
        },
        {
          rootMargin: '-75px 0px -40% 0px',
          threshold: [0, 0.1, 0.25, 0.5, 0.75, 1.0]
        }
      );

      sections.forEach(function (sec) {
        observer.observe(sec);
      });

      window.addEventListener('scroll', function () {
        var scrollY = window.pageYOffset || document.documentElement.scrollTop;
        if (scrollY < 120) {
          setActiveLink(null);
        } else if (window.innerHeight + scrollY >= document.documentElement.scrollHeight - 40) {
          setActiveLink(sections[sections.length - 1].id);
        }
      }, { passive: true });
    }
  }

  function init() {
    var toggleBtn = document.getElementById('theme-toggle');
    updateToggleUI(getActiveTheme());
    initScrollSpy();

    if (toggleBtn) {
      toggleBtn.addEventListener('click', function () {
        var current = getActiveTheme();
        var next = current === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
        updateToggleUI(next);
      });
    }

    if (window.matchMedia) {
      var mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      var handleChange = function (e) {
        if (!localStorage.getItem('theme')) {
          updateToggleUI(e.matches ? 'dark' : 'light');
        }
      };
      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener('change', handleChange);
      } else if (mediaQuery.addListener) {
        mediaQuery.addListener(handleChange);
      }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
