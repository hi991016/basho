"use strict";

// ===== globals =====
const isMobile = window.matchMedia("(max-width: 1024px)");
const eventsTrigger = ["pageshow", "scroll"];

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
  // # lazy load
  const ll = new LazyLoad({
    threshold: 0,
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
function raf(time) {
  lenis.raf(time);
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
    'a:not([href^="#"]):not([target]):not([href^="mailto"]):not([href^="tel"])'
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
const [toggleMenus, menus, toggleCarts, carts, header, basho] = [
  document.querySelectorAll("[data-menu-toggle]"),
  document.querySelector("[data-menu]"),
  document.querySelectorAll("[data-cart-toggle]"),
  document.querySelector("[data-cart]"),
  document.querySelector("[data-header]"),
  document.querySelector("[data-basho]"),
];

const initMenu = () => {
  if (!menus || !toggleMenus.length) return;
  toggleMenus.forEach((toggle) => {
    toggle.addEventListener("click", () => {
      const shouldBeActive = !menus.classList.contains("--show");

      menus.classList.toggle("--show", shouldBeActive);
      header.classList.toggle("--black", shouldBeActive);
      basho.classList.toggle("--black", shouldBeActive);

      toggle.textContent = shouldBeActive ? "Close" : "Menu";
      shouldBeActive ? window.lenis.stop() : window.lenis.start();
    });
  });
};

const initCart = () => {
  if (!carts || !toggleCarts.length) return;

  toggleCarts.forEach((toggle) => {
    toggle.addEventListener("click", () => {
      const shouldBeActive = !carts.classList.contains("--show");
      carts.classList.toggle("--show", shouldBeActive);

      if (menus && menus.classList.contains("--show")) {
        menus.classList.remove("--show");
        toggleMenus.forEach((btn) => (btn.textContent = "Menu"));
        header.classList.remove("--black");
        basho.classList.remove("--black");
      }

      shouldBeActive ? window.lenis.stop() : window.lenis.start();
    });
  });
};

// ### ===== DOMCONTENTLOADED ===== ###
window.addEventListener("load", init);
