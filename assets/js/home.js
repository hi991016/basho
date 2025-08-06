// ===== init =====
const homepage = () => {
  // # fix position
  fixPosition();
  // # init loading
  initLoading();
};

// ===== fix position mobile =====
const fixPosition = () => {
  const vh = document.documentElement.clientHeight;
  document.documentElement.style.setProperty("--vh", `${vh * 0.01}px`);
};
window.addEventListener("resize", fixPosition);

// ===== init loading =====
const preventScroll = (e) => e.preventDefault();
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const playWithPromise = (player) => {
  return new Promise((resolve) => {
    player.on("end", () => resolve(), true);
    player.play();
  });
};

const initLoading = async () => {
  const [loading, logoBasho, playerBashoPC, playerBashoSP] = [
    document.querySelector("[data-loading]"),
    document.querySelector("[data-basho]"),
    document.getElementById("eQ7YifWk5CI1"),
    document.getElementById("emSFKzg9Pox1"),
  ];
  if (!loading) return;

  if (sessionStorage.getItem("opening-displayed") === "true") {
    playerBashoPC.svgatorPlayer.seekTo(3000);
    playerBashoSP.svgatorPlayer.seekTo(3000);
    loading.remove();
    window.lenis.start();
    fvSwiper.autoplay.start();
  } else {
    // # block scroll events
    window.lenis.stop();
    window.addEventListener("wheel", preventScroll, { passive: false });
    window.addEventListener("touchmove", preventScroll, { passive: false });
    window.addEventListener("scroll", preventScroll, { passive: false });

    // # step 1
    await delay(1000);
    if (!isMobile.matches) {
      await playWithPromise(playerBashoPC.svgatorPlayer);
      playerBashoSP.svgatorPlayer.seekTo(3000);
    } else {
      await playWithPromise(playerBashoSP.svgatorPlayer);
      playerBashoPC.svgatorPlayer.seekTo(3000);
    }
    // # step 2
    await delay(500);
    loading.classList.add("--done");
    logoBasho.classList.add("--white");

    // # unblock scroll events
    window.removeEventListener("wheel", preventScroll);
    window.removeEventListener("touchmove", preventScroll);
    window.removeEventListener("scroll", preventScroll);
    window.removeEventListener("keydown", preventScroll);
    window.lenis.start();
    fvSwiper.autoplay.start();

    // # set sessionStorage
    sessionStorage.setItem("opening-displayed", !0);
  }
};

// ===== scroll change color logo =====
const handleBashoLogo = () => {
  const [bashoLogo, header, ost] = [
    document.querySelector("[data-basho]"),
    document.querySelector("[data-header]"),
    document.querySelector("[data-offset-top]"),
  ];
  const scrollPosition = window.scrollY;
  const hSize = ost.getBoundingClientRect().top + scrollPosition;

  bashoLogo.classList.toggle(
    "--white",
    scrollPosition < 50 &&
      sessionStorage.getItem("opening-displayed") === "true"
  );
  header.classList.toggle("--white", scrollPosition + 20 <= hSize);
};
eventsTrigger.forEach((evt) => {
  window.addEventListener(evt, handleBashoLogo);
});

// ===== firstview ======
const fvSwiper = new Swiper("[data-fv-swiper]", {
  effect: "fade",
  speed: 1500,
  allowTouchMove: false,
  autoplay: {
    delay: 4000,
    disableOnInteraction: false,
  },
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
    renderBullet: function (index, className) {
      return '<span class="' + className + '">' + (index + 1) + "</span>";
    },
  },
  on: {
    init: function () {
      this.autoplay.stop();
    },
  },
});

// ### ===== DOMCONTENTLOADED ===== ###
window.addEventListener("pageshow", homepage);
