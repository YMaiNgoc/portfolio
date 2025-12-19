
const ComponentLoader = {
  async loadComponent(id, file) {
    try {
      const response = await fetch(file);
      if (!response.ok) {
        throw new Error(`Không tìm thấy ${file}`);
      }
      const data = await response.text();
      const element = document.getElementById(id);
      if (element) {
        element.innerHTML = data;
        return true;
      }
      return false;
    } catch (error) {
      console.error(`Error loading ${file}:`, error);
      return false;
    }
  },

  async loadAllComponents() {
    const components = [
      { id: 'header', file: './html/header.html' },
      { id: 'hero', file: './html/hero.html' },
      { id: 'about', file: './html/about.html' },
      { id: 'portfolio', file: './html/portfolio.html' },
      { id: 'contact', file: './html/contact.html' },
      { id: 'footer', file: './html/footer.html' }
    ];

    try {
      await Promise.all(
        components.map(comp => this.loadComponent(comp.id, comp.file))
      );
      
      // Initialize all features after components are loaded
      setTimeout(() => {
        this.initAll();
      }, 100);
    } catch (error) {
      console.error('Error loading components:', error);
    }
  },

  initAll() {
    Navigation.init();
    ScrollAnimations.init();
    BackToTop.init();
    HeaderScroll.init();
    LazyLoading.init();
    ContactModal.init();
    MobileMenu.init();
  }
};

const Navigation = {
  init() {
    this.initSmoothScroll();
    this.initActiveLink();
    this.initDropdown();
  },

  initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#' || href === '#contact') return;
        
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          const headerOffset = 80;
          const elementPosition = target.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
  },

  initActiveLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

    const updateActiveLink = () => {
      let current = '';
      const scrollY = window.pageYOffset;

      sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.offsetHeight;
        
        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
          current = section.getAttribute('id');
        }
      });

      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
          link.classList.add('active');
        }
      });
    };

    window.addEventListener('scroll', this.throttle(updateActiveLink, 100));
    updateActiveLink();
  },

  initDropdown() {
    const dropdown = document.querySelector('.dropdown');
    const dropdownToggle = document.querySelector('.dropdown-toggle');
    
    if (dropdown && dropdownToggle) {
      dropdownToggle.addEventListener('click', (e) => {
        e.preventDefault();
        dropdown.classList.toggle('active');
      });
      
      document.addEventListener('click', (e) => {
        if (!dropdown.contains(e.target)) {
          dropdown.classList.remove('active');
        }
      });
      
      const dropdownLinks = dropdown.querySelectorAll('.dropdown-menu a');
      dropdownLinks.forEach(link => {
        link.addEventListener('click', () => {
          dropdown.classList.remove('active');
        });
      });
    }
  },

  throttle(func, limit) {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }
};
const ScrollAnimations = {
  init() {
    if ('IntersectionObserver' in window) {
      this.observeElements();
    } else {
      this.fallbackAnimation();
    }
  },

  observeElements() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Observe elements
    const elementsToAnimate = document.querySelectorAll(
      '.project, .skill-card, .about-text, .hero-content, .hero-image'
    );

    elementsToAnimate.forEach(el => {
      el.classList.add('animate-on-scroll');
      observer.observe(el);
    });
  },

  fallbackAnimation() {
    const elements = document.querySelectorAll('.project, .skill-card');
    elements.forEach(el => el.classList.add('animate-in'));
  }
};

const BackToTop = {
  init() {
    this.createButton();
    this.handleScroll();
  },

  createButton() {
    const button = document.createElement('button');
    button.id = 'backToTop';
    button.innerHTML = '<i class="fa-solid fa-arrow-up"></i>';
    button.setAttribute('aria-label', 'Back to top');
    button.classList.add('back-to-top');
    document.body.appendChild(button);

    button.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  },

  handleScroll() {
    const button = document.getElementById('backToTop');
    if (!button) return;

    const toggleButton = () => {
      if (window.pageYOffset > 300) {
        button.classList.add('show');
      } else {
        button.classList.remove('show');
      }
    };

    window.addEventListener('scroll', this.throttle(toggleButton, 100));
    toggleButton();
  },

  throttle(func, limit) {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }
};

const HeaderScroll = {
  init() {
    const header = document.querySelector('header');
    if (!header) return;

    const handleScroll = () => {
      if (window.pageYOffset > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    };

    window.addEventListener('scroll', this.throttle(handleScroll, 50));
    handleScroll();
  },

  throttle(func, limit) {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }
};

const LazyLoading = {
  init() {
    if ('IntersectionObserver' in window) {
      this.lazyLoadImages();
    } else {
      this.loadAllImages();
    }
  },

  lazyLoadImages() {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            img.classList.add('loaded');
            observer.unobserve(img);
          }
        }
      });
    });

    const images = document.querySelectorAll('img[data-src]');
    images.forEach(img => imageObserver.observe(img));
  },

  loadAllImages() {
    const images = document.querySelectorAll('img[data-src]');
    images.forEach(img => {
      img.src = img.dataset.src;
      img.removeAttribute('data-src');
    });
  }
};

const ContactModal = {
  init() {
    window.openContactModal = this.open.bind(this);
    window.closeContactModal = this.close.bind(this);
    setTimeout(() => {
      this.setupEventListeners();
    }, 200);
  },

  setupEventListeners() {
    const modal = document.getElementById('contactModal');
    if (!modal) return;
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        this.close();
      }
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('active')) {
        this.close();
      }
    });
  },

  open() {
    const modal = document.getElementById('contactModal');
    if (modal) {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  },

  close() {
    const modal = document.getElementById('contactModal');
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = 'auto';
    }
  }
};
const MobileMenu = {
  init() {
    this.createToggleButton();
    this.handleResize();
  },

  createToggleButton() {
    const nav = document.querySelector('nav');
    if (!nav) return;

    const toggleBtn = document.createElement('button');
    toggleBtn.classList.add('mobile-menu-toggle');
    toggleBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';
    toggleBtn.setAttribute('aria-label', 'Toggle menu');
    
    nav.appendChild(toggleBtn);

    toggleBtn.addEventListener('click', () => {
      const navLinks = document.querySelector('.nav-links');
      navLinks.classList.toggle('active');
      toggleBtn.classList.toggle('active');
    });
  },

  handleResize() {
    window.addEventListener('resize', () => {
      const navLinks = document.querySelector('.nav-links');
      const toggleBtn = document.querySelector('.mobile-menu-toggle');
      
      if (window.innerWidth > 768) {
        navLinks.classList.remove('active');
        if (toggleBtn) toggleBtn.classList.remove('active');
      }
    });
  }
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    ComponentLoader.loadAllComponents();
  });
} else {
  ComponentLoader.loadAllComponents();
}

