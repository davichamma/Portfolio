const CACHE_NAME = "offline-cache-v1";
const ASSETS = [
  "./assets/arrowLeft.svg",
  "./assets/arrowRight.svg",
  "./assets/rightArrow.svg",
  "./assets/leftArrow.svg",
  "./assets/ssi.svg",
  "./assets/sstBL.svg",
  "./assets/innovationBL.svg",
  "./assets/innovation.svg",
  "./assets/educationBL.svg",
  "./assets/basicEducation.svg",
  "./assets/responsibilityBL.svg",
  "./assets/socialResponsibility.svg",
  "./assets/projectsBL.svg",
  "./assets/projects.svg",
  "./assets/search.svg",
  "./assets/filter.svg",
  "./assets/searchBackground.svg",
  "./assets/selo.svg",
  "./assets/leftArrowWhite.svg",
  "./assets/clockIcon.svg",
  "./assets/hatIcon.svg",
  "./assets/pdfIcon.svg",
  "./assets/calculateButton.svg",
  "./assets/ods01.svg",
  "./assets/ods02.svg",
  "./assets/ods03.svg",
  "./assets/ods04.svg",
  "./assets/ods05.svg",
  "./assets/ods06.svg",
  "./assets/ods07.svg",
  "./assets/ods08.svg",
  "./assets/ods09.svg",
  "./assets/ods10.svg",
  "./assets/ods11.svg",
  "./assets/ods12.svg",
  "./assets/ods13.svg",
  "./assets/ods14.svg",
  "./assets/ods15.svg",
  "./assets/ods16.svg",
  "./assets/ods17.svg",
  "./assets/ods18.svg",
  "./assets/playButton.svg",
  "./assets/home.svg",
  "./assets/catalog.svg",
  "./assets/fav.svg",
  "./assets/calculator.svg",
  "./assets/check.svg",
  "./assets/loading.svg",
  "./assets/portfolio.svg",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache
        .addAll(ASSETS)
        .then(() => {})
        .catch((err) => {
          console.error("Error caching assets:", err);
        });
    })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches
      .match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
      .catch((err) => {
        console.error("Fetch failed:", err);
      })
  );
});
