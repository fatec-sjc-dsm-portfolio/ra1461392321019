const revealItems = document.querySelectorAll('.reveal');

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('is-visible'));
}

const siteHeader = document.querySelector('.site-header');
const navToggle = document.querySelector('.nav-toggle');
const siteNav = document.querySelector('.site-nav');
const navLinks = document.querySelectorAll('.site-nav a[href^="#"]');

const setNavOpen = (isOpen) => {
  if (!siteHeader || !navToggle) {
    return;
  }

  siteHeader.classList.toggle('is-nav-open', isOpen);
  navToggle.setAttribute('aria-expanded', String(isOpen));
};

if (navToggle && siteHeader) {
  navToggle.addEventListener('click', () => {
    const isOpen = siteHeader.classList.contains('is-nav-open');
    setNavOpen(!isOpen);
  });
}

navLinks.forEach((link) => {
  link.addEventListener('click', () => {
    if (window.innerWidth <= 920) {
      setNavOpen(false);
    }
  });
});

window.addEventListener('resize', () => {
  if (window.innerWidth > 920) {
    setNavOpen(false);
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    setNavOpen(false);
  }
});

const projectTracks = document.querySelectorAll('.project-track');

const updateCarouselState = (track) => {
  const carousel = track.querySelector('.project-carousel');
  const buttons = track.querySelectorAll('.project-carousel-btn');

  if (!carousel || buttons.length === 0) {
    return;
  }

  const isScrollable = carousel.scrollWidth > carousel.clientWidth + 2;
  track.classList.toggle('is-scrollable', isScrollable);

  const canScrollLeft = carousel.scrollLeft > 0;
  const canScrollRight = carousel.scrollLeft + carousel.clientWidth < carousel.scrollWidth - 2;

  buttons.forEach((button) => {
    const action = button.dataset.carouselAction;

    if (!isScrollable) {
      button.disabled = true;
      return;
    }

    button.disabled = action === 'prev' ? !canScrollLeft : !canScrollRight;
  });
};

projectTracks.forEach((track) => {
  const carousel = track.querySelector('.project-carousel');
  const buttons = track.querySelectorAll('.project-carousel-btn');

  if (!carousel || buttons.length === 0) {
    return;
  }

  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      const direction = button.dataset.carouselAction === 'prev' ? -1 : 1;
      const card = carousel.querySelector('.project-card');
      const gapValue = Number.parseFloat(window.getComputedStyle(carousel).gap || '0') || 16;
      const cardWidth = card ? card.getBoundingClientRect().width : carousel.clientWidth / 3;
      const scrollAmount = cardWidth + gapValue;

      carousel.scrollBy({
        left: direction * scrollAmount,
        behavior: 'smooth',
      });
    });
  });

  carousel.addEventListener('scroll', () => updateCarouselState(track), { passive: true });
  carousel.scrollLeft = 0;
  updateCarouselState(track);
});

window.addEventListener('resize', () => {
  projectTracks.forEach((track) => updateCarouselState(track));
});