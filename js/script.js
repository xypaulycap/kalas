/*!
 * Katlashipping B.V. — Core Interactive & Functional Scripts
 * Domain: https://katlashippingbv.nl
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    /* ======================================================================
       1. Dynamic Copyright Year
       ====================================================================== */
    var yearEl = document.getElementById('current-year');
    if (yearEl) {
      yearEl.textContent = new Date().getFullYear();
    }

    /* ======================================================================
       2. Sticky Header Elevation
       ====================================================================== */
    var header = document.querySelector('.ks-header');
    function handleScroll() {
      if (!header) return;
      if (window.scrollY > 20) {
        header.classList.add('is-scrolled');
      } else {
        header.classList.remove('is-scrolled');
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    /* ======================================================================
       3. Mobile Navigation Drawer & Dropdown Accordion
       ====================================================================== */
    var mobileToggle = document.querySelector('.ks-mobile-toggle');
    var navMenu = document.querySelector('.ks-nav-menu');

    if (mobileToggle && navMenu) {
      mobileToggle.addEventListener('click', function (e) {
        e.stopPropagation();
        var isOpen = navMenu.classList.toggle('is-open');
        mobileToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      });

      document.addEventListener('click', function (e) {
        if (navMenu.classList.contains('is-open') && !navMenu.contains(e.target) && !mobileToggle.contains(e.target)) {
          navMenu.classList.remove('is-open');
          mobileToggle.setAttribute('aria-expanded', 'false');
        }
      });
    }

    var dropdownItems = document.querySelectorAll('.ks-nav-item.has-dropdown');
    dropdownItems.forEach(function (item) {
      var trigger = item.querySelector('.ks-nav-link');
      if (!trigger) return;

      trigger.addEventListener('click', function (e) {
        if (window.innerWidth <= 1120) {
          var isAlreadyOpen = item.classList.contains('dropdown-open');
          if (!isAlreadyOpen) {
            e.preventDefault();
            dropdownItems.forEach(function (other) {
              if (other !== item) other.classList.remove('dropdown-open');
            });
            item.classList.add('dropdown-open');
          }
        }
      });
    });

    /* ======================================================================
       4. Home Hero Interactive Pillar Switcher
       ====================================================================== */
    var pillarItems = document.querySelectorAll('.ks-pillar-item');
    var heroImg = document.getElementById('ks-hero-img');

    if (pillarItems.length > 0) {
      pillarItems.forEach(function (pillar) {
        pillar.addEventListener('click', function () {
          pillarItems.forEach(function (el) {
            el.classList.remove('active');
          });
          pillar.classList.add('active');

          var newBg = pillar.getAttribute('data-bg');
          if (heroImg && newBg && heroImg.getAttribute('src') !== newBg) {
            heroImg.style.opacity = '0.12';
            setTimeout(function () {
              heroImg.setAttribute('src', newBg);
              heroImg.style.opacity = '0.32';
            }, 180);
          }
        });
      });
    }

    /* ======================================================================
       5. Projects Portfolio Filter & Lightbox Modal
       ====================================================================== */
    var filterBtns = document.querySelectorAll('.ks-filter-btn');
    var projectCards = document.querySelectorAll('.ks-project-card');
    var projectCountEl = document.getElementById('ks-project-count');

    if (filterBtns.length > 0 && projectCards.length > 0) {
      filterBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
          var filterVal = btn.getAttribute('data-filter') || 'all';

          filterBtns.forEach(function (b) {
            b.classList.remove('active');
          });
          btn.classList.add('active');

          var visibleCount = 0;
          projectCards.forEach(function (card) {
            var cat = card.getAttribute('data-category');
            if (filterVal === 'all' || cat === filterVal) {
              card.classList.remove('is-hidden');
              visibleCount++;
            } else {
              card.classList.add('is-hidden');
            }
          });

          if (projectCountEl) {
            projectCountEl.textContent = visibleCount;
          }
        });
      });
    }

    /* Lightbox Modal */
    var lightbox = document.getElementById('ks-lightbox');
    var lightboxImg = document.getElementById('ks-lightbox-img');
    var lightboxTitle = document.getElementById('ks-lightbox-title');
    var lightboxCat = document.getElementById('ks-lightbox-cat');
    var lightboxDesc = document.getElementById('ks-lightbox-desc');
    var lightboxClose = document.getElementById('ks-lightbox-close');

    if (lightbox && projectCards.length > 0) {
      projectCards.forEach(function (card) {
        var thumb = card.querySelector('.ks-project-thumb');
        if (!thumb) return;

        thumb.addEventListener('click', function () {
          var imgEl = card.querySelector('.ks-project-thumb img');
          var titleEl = card.querySelector('.ks-project-body h4');
          var catEl = card.querySelector('.ks-project-cat');
          var descEl = card.querySelector('.ks-project-body p');

          if (lightboxImg && imgEl) {
            lightboxImg.src = imgEl.src;
            lightboxImg.alt = titleEl ? titleEl.textContent : 'Project Specification';
          }
          if (lightboxTitle && titleEl) lightboxTitle.textContent = titleEl.textContent;
          if (lightboxCat && catEl) lightboxCat.textContent = catEl.textContent;
          if (lightboxDesc && descEl) lightboxDesc.textContent = descEl.textContent;

          lightbox.classList.add('is-open');
          lightbox.setAttribute('aria-hidden', 'false');
        });
      });

      function closeLightbox() {
        lightbox.classList.remove('is-open');
        lightbox.setAttribute('aria-hidden', 'true');
      }

      if (lightboxClose) {
        lightboxClose.addEventListener('click', closeLightbox);
      }

      lightbox.addEventListener('click', function (e) {
        if (e.target === lightbox) {
          closeLightbox();
        }
      });

      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && lightbox.classList.contains('is-open')) {
          closeLightbox();
        }
      });
    }

    /* ======================================================================
       6. Formspree AJAX Submission (Contact & Quote Forms)
       ====================================================================== */
    var forms = document.querySelectorAll('#quote-request, #contact-us');
    forms.forEach(function (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();

        var resultsEl = form.querySelector('.form-results');
        var submitBtn = form.querySelector('button[type="submit"]');
        var originalBtnText = submitBtn ? submitBtn.innerHTML : 'Submit';

        /* Honeypot spam check */
        var honeypot = form.querySelector('input[name="form-anti-honeypot"]');
        if (honeypot && honeypot.value !== '') {
          return;
        }

        var actionUrl = form.getAttribute('action') || 'https://formspree.io/f/mojnkynp';
        var formData = new FormData(form);

        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.textContent = 'Transmitting Inquiry...';
        }

        if (resultsEl) {
          resultsEl.className = 'form-results';
          resultsEl.style.display = 'none';
        }

        fetch(actionUrl, {
          method: 'POST',
          body: formData,
          headers: {
            Accept: 'application/json'
          }
        })
          .then(function (response) {
            if (response.ok) {
              form.reset();
              if (resultsEl) {
                resultsEl.className = 'form-results alert-success';
                resultsEl.textContent = 'Thank you. Your inquiry has been received by the Katlashipping B.V. commercial desk. A specialist will respond shortly.';
                resultsEl.style.display = 'block';
              }
            } else {
              return response.json().then(function (data) {
                throw new Error(data && data.error ? data.error : 'Submission error.');
              });
            }
          })
          .catch(function () {
            if (resultsEl) {
              resultsEl.className = 'form-results alert-danger';
              resultsEl.textContent = 'We were unable to process your transmission automatically. Please contact us directly at support@katlashippingbv.nl or +31 635250178.';
              resultsEl.style.display = 'block';
            }
          })
          .finally(function () {
            if (submitBtn) {
              submitBtn.disabled = false;
              submitBtn.innerHTML = originalBtnText;
            }
          });
      });
    });

    /* ======================================================================
       7. Footer Newsletter Subscription Handler
       ====================================================================== */
    var newsletterForms = document.querySelectorAll('.ks-newsletter-form');
    newsletterForms.forEach(function (nForm) {
      nForm.addEventListener('submit', function (e) {
        e.preventDefault();
        var input = nForm.querySelector('input[type="email"]');
        var btn = nForm.querySelector('button[type="submit"]');
        if (input && input.value.trim() !== '') {
          input.value = '';
          input.setAttribute('placeholder', 'Subscribed — Thank you');
          if (btn) {
            btn.textContent = 'Confirmed';
          }
        }
      });
    });

    /* ======================================================================
       8. Cookie Consent Notice
       ====================================================================== */
    var cookieNotice = document.getElementById('cookie-notice');
    var acceptCookiesBtn = document.getElementById('accept-cookies');

    if (cookieNotice) {
      var cookiesAccepted = false;
      try {
        cookiesAccepted = localStorage.getItem('katla_cookies_accepted') === 'true' || localStorage.getItem('cookiesAccepted') === 'true';
      } catch (err) {
        cookiesAccepted = false;
      }

      if (!cookiesAccepted) {
        cookieNotice.classList.remove('hidden');
      } else {
        cookieNotice.classList.add('hidden');
      }

      if (acceptCookiesBtn) {
        acceptCookiesBtn.addEventListener('click', function () {
          try {
            localStorage.setItem('katla_cookies_accepted', 'true');
            localStorage.setItem('cookiesAccepted', 'true');
          } catch (err) {}
          cookieNotice.classList.add('hidden');
        });
      }
    }

    /* ======================================================================
       9. Multi-Language Selector (Google Translate Integration)
       ====================================================================== */
    var translatorToggle = document.getElementById('php-g-translator');
    var langOptions = document.querySelector('.g-translator-custom .language-options');

    if (translatorToggle && langOptions) {
      translatorToggle.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        langOptions.classList.toggle('hidden');
      });

      document.addEventListener('click', function (e) {
        if (!langOptions.classList.contains('hidden') && !langOptions.contains(e.target) && e.target !== translatorToggle) {
          langOptions.classList.add('hidden');
        }
      });

      var langLinks = langOptions.querySelectorAll('a[data-lang-pair]');
      langLinks.forEach(function (link) {
        link.addEventListener('click', function (e) {
          e.preventDefault();
          var pair = link.getAttribute('data-lang-pair');
          if (typeof window.GTranslator === 'function' && pair) {
            window.GTranslator(pair);
          }
          var img = link.querySelector('img');
          var text = link.textContent.trim();
          if (img) {
            translatorToggle.innerHTML = '<img src="' + img.getAttribute('src') + '" alt="' + text + '"> ' + text + ' <span class="toggle-cert"></span>';
          }
          langOptions.classList.add('hidden');
        });
      });
    }
  });

  /* Google Translate Global Helpers */
  window.googleTranslateElementInit2 = function () {
    if (window.google && window.google.translate) {
      new window.google.translate.TranslateElement(
        { pageLanguage: 'en', autoDisplay: false },
        'google_translate_element2'
      );
    }
  };

  window.GTranslator = function (langPair) {
    if (!langPair) return;
    var parts = langPair.split('|');
    var targetLang = parts.length > 1 ? parts[1] : parts[0];
    var combo = document.querySelector('.goog-te-combo');
    if (combo) {
      combo.value = targetLang;
      var event;
      if (typeof Event === 'function') {
        event = new Event('change', { bubbles: true });
      } else {
        event = document.createEvent('HTMLEvents');
        event.initEvent('change', true, true);
      }
      combo.dispatchEvent(event);
    }
  };

  /* Load Google Translate script asynchronously */
  window.addEventListener('load', function () {
    if (document.getElementById('google_translate_element2')) {
      var gtScript = document.createElement('script');
      gtScript.type = 'text/javascript';
      gtScript.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit2';
      gtScript.async = true;
      document.body.appendChild(gtScript);
    }
  });
})();
