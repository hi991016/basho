"use strict";

// ===== globals =====
const isMobile = window.matchMedia("(max-width: 1024px)");
const eventsTrigger = ["pageshow", "scroll"];

const detectScroll = (detect) => {
  if (detect) {
    window.lenis.stop();
    document.body.style.overflow = "hidden";
  } else {
    window.lenis.start();
    document.body.style.removeProperty("overflow");
  }
};

// ===== init =====
const init = () => {
  // # app height
  appHeight();
  // # init menu
  initMenu();
  // # init cart
  initCart();
  // # init newsletter
  initNewsletter();
  // # init tabs
  initTabs();
  // # init product feature swiper
  initProdfeatSwipers();
  // # lazy load
  const ll = new LazyLoad({
    threshold: 100,
    elements_selector: ".lazy",
  });
};

// ===== lenis =====
window.lenis = new Lenis({
  duration: 1.0,
  easing: (t) => Math.min(1, 1.001 - Math.pow(1 - t, 2.5)),
  smooth: true,
  mouseMultiplier: 1.0,
  smoothTouch: true,
  touchMultiplier: 1.5,
  infinite: false,
  direction: "vertical",
  gestureDirection: "vertical",
});
function raf(t) {
  window.lenis.raf(t);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// ===== app height =====
const appHeight = () => {
  const doc = document.documentElement;
  const menuH = Math.max(doc.clientHeight, window.innerHeight || 0);

  if (!isMobile.matches) return;

  doc.style.setProperty("--app-height", `${doc.clientHeight}px`);
  doc.style.setProperty("--menu-height", `${menuH}px`);
};
window.addEventListener("resize", appHeight);

// ===== href fadeout =====
document.addEventListener("click", (evt) => {
  const link = evt.target.closest(
    'a:not([href^="#"]):not([href^="/#"]):not([target]):not([href^="mailto"]):not([href^="tel"])'
  );
  if (!link) return;

  evt.preventDefault();
  const url = link.getAttribute("href");

  if (url && url !== "") {
    const idx = url.indexOf("#");
    const hash = idx !== -1 ? url.substring(idx) : "";

    if (hash && hash !== "#") {
      try {
        const targetElement = document.querySelector(hash);
        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
          return false;
        }
      } catch (err) {
        console.error("Invalid hash selector:", hash, err);
      }
    }

    document.body.classList.add("fadeout");
    setTimeout(function () {
      window.location = url;
    }, 500);
  }

  return false;
});

// ===== menu/cart/newsletter =====
const [
  toggleMenus,
  toggleCarts,
  toggleLetters,
  menus,
  carts,
  letters,
  header,
  basho,
] = [
  document.querySelectorAll("[data-menu-toggle]"),
  document.querySelectorAll("[data-cart-toggle]"),
  document.querySelectorAll("[data-newsletter-toggle]"),
  document.querySelector("[data-menu]"),
  document.querySelector("[data-cart]"),
  document.querySelector("[data-newsletter]"),
  document.querySelector("[data-header]"),
  document.querySelector("[data-basho]"),
];

const resetMenu = () => {
  menus.classList.remove("--show");
  toggleMenus.forEach((btn) => (btn.textContent = "Menu"));
  header.classList.remove("--black");
  basho.classList.remove("--black");
  detectScroll(false);
};

// # menu

const initMenu = () => {
  if (!menus || !toggleMenus.length) return;

  // # toggle menu
  toggleMenus.forEach((toggle) => {
    toggle.addEventListener("click", () => {
      const shouldBeActive = !menus.classList.contains("--show");

      menus.classList.toggle("--show", shouldBeActive);
      header.classList.toggle("--black", shouldBeActive);
      basho.classList.toggle("--black", shouldBeActive);

      toggle.textContent = shouldBeActive ? "Close" : "Menu";
      detectScroll(shouldBeActive);
    });
  });

  // # toggle link
  const links = document.querySelectorAll("[data-menu] a");
  links.forEach((toggle) => {
    toggle.addEventListener("click", () => {
      resetMenu();
    });
  });
};

// # click/hover accordion

const [menuItems, menuAccordion, menuPanel] = [
  document.querySelectorAll(".c-menu_left li"),
  document.querySelectorAll("[data-menu-accordion]"),
  document.querySelectorAll("[data-menu-panel]"),
];

const handleHoverMenu = () => {
  menuAccordion.forEach((menu) => {
    menu.addEventListener("mouseenter", () => {
      menuItems.forEach((item) => {
        if (item !== menu) item.classList.add("--dimmed");
      });
    });

    menu.addEventListener("mouseleave", () => {
      menuItems.forEach((item) => item.classList.remove("--dimmed"));
    });
  });
};

const handleClickMenu = () => {
  menuAccordion.forEach((btn, i) => {
    btn.addEventListener("click", (e) => {
      const panel = menuPanel[i];
      const isOpening = !panel.style.maxHeight;

      // show accordion
      panel.style.maxHeight = isOpening ? panel.scrollHeight + "px" : null;
      btn.classList.toggle("--active", isOpening);

      // --dim other items when opening accordion
      menuItems.forEach((item) => {
        if (item !== btn) {
          item.classList.toggle("--dimmed", isOpening);
        }
      });
    });
  });

  // click outside to reset
  document.addEventListener("click", (e) => {
    const isMenuClick = [...menuAccordion, ...menuPanel].some((element) =>
      element.contains(e.target)
    );
    if (!isMenuClick) {
      menuPanel.forEach((panel) => (panel.style.maxHeight = null));
      menuItems.forEach((item) => item.classList.remove("--dimmed"));
    }
  });
};

const HandleResponsiveMenu = () => {
  // reset
  menuPanel.forEach((panel) => (panel.style.maxHeight = null));
  menuItems.forEach((item) => item.classList.remove("--dimmed"));

  // setup
  if (!isMobile.matches) {
    handleHoverMenu();
  } else {
    handleClickMenu();
  }
};

HandleResponsiveMenu();
window.addEventListener("resize", HandleResponsiveMenu);

// # cart

const initCart = () => {
  if (!carts || !toggleCarts.length) return;

  toggleCarts.forEach((toggle) => {
    toggle.addEventListener("click", () => {
      const shouldBeActive = !carts.classList.contains("--show");
      carts.classList.toggle("--show", shouldBeActive);
      if (menus && menus.classList.contains("--show")) {
        resetMenu();
      }
      detectScroll(shouldBeActive);
    });
  });
};

// # newsletter

const initNewsletter = () => {
  if (!letters || !toggleLetters.length) return;
  toggleLetters.forEach((toggle) => {
    toggle.addEventListener("click", () => {
      const shouldBeActive = !letters.classList.contains("--show");
      letters.classList.toggle("--show", shouldBeActive);
    });
  });
};

// ===== handle tabs change ======

const initTabs = () => {
  const tabs = document.querySelectorAll("[data-tabs-items]");
  const panels = document.querySelectorAll("[data-tabs-panels]");
  if (!tabs.length || !panels.length) return;

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const targetId = tab.getAttribute("data-tabs-items");
      const contentWrapper = document.querySelector("[data-tabs]");
      contentWrapper?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      window.lenis.stop();

      // remove active classes
      tabs.forEach((t) => t.classList.remove("--active"));
      panels.forEach((c) => c.classList.remove("--active"));

      // add active to clicked tab and corresponding content
      window.lenis.start();
      document
        .querySelectorAll(`[data-tabs-items="${targetId}"]`)
        .forEach((matchedTab) => matchedTab.classList.add("--active"));
      const content = document.querySelector(
        `[data-tabs-panels="${targetId}"]`
      );
      if (content) content.classList.add("--active");
    });
  });
};

// ===== swiper product feature ======

const initProdfeatSwipers = () => {
  const [tabsPanels, swiperEls, navPrev, navNext] = [
    document.querySelectorAll("[data-tabs-panels]"),
    document.querySelectorAll("[data-prodfeat-swiper]"),
    document.querySelector("[data-prodfeat-prev]"),
    document.querySelector("[data-prodfeat-next]"),
  ];
  if (!navPrev || !navNext || swiperEls.length === 0) return;
  const swipers = [];

  // init all swiper
  swiperEls.forEach((el) => {
    const swiper = new Swiper(el, {
      speed: 700,
      allowTouchMove: true,
      slidesPerView: 1.369,
      spaceBetween: 12,
      breakpoints: {
        1025: {
          allowTouchMove: false,
          slidesPerView: 4,
          spaceBetween: 20,
        },
      },
      navigation: {
        nextEl: navNext,
        prevEl: navPrev,
      },
    });
    swipers.push({ el, swiper });
  });

  // auto enable navigation for active panel
  const updateActiveSwiperNav = () => {
    swipers.forEach((obj) => {
      const { el, swiper } = obj;
      const isVisible = el
        .closest("[data-tabs-panels]")
        ?.classList.contains("--active");

      if (isVisible) {
        swiper.params.navigation.nextEl = navNext;
        swiper.params.navigation.prevEl = navPrev;
        swiper.navigation.init();

        swiper.slideTo(0, 0);
        swiper.updateSize();
        swiper.updateSlides();

        requestAnimationFrame(() => {
          swiper.navigation.update();
        });
      } else {
        swiper.navigation.destroy();
      }
    });
  };
  
  if (tabsPanels.length) {
    updateActiveSwiperNav();
  }

  // if tabs exist, detect for tab change event
  tabsPanels.forEach((panel) => {
    const observer = new MutationObserver(() => {
      updateActiveSwiperNav();
    });
    observer.observe(panel, { attributes: true, attributeFilter: ["class"] });
  });
};

// ### ===== DOMCONTENTLOADED ===== ###
window.addEventListener("pageshow", () => {
  document.body.classList.remove("fadeout");
});
window.addEventListener("DOMContentLoaded", init);
