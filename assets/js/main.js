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
  // #
  document.body.classList.remove("fadeout");
  // # app height
  appHeight();
  // # init menu
  initMenu();
  // # init cart
  initCart();
  // # init newsletter
  initNewsletter();
  // # lazy load
  const ll = new LazyLoad({
    threshold: 400,
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

// ### ===== DOMCONTENTLOADED ===== ###
window.addEventListener("pageshow", init);
