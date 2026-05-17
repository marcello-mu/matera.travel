const slides = document.querySelectorAll(".slide");
const credit = document.getElementById("photo-credit");

let current = 0;
const slideDurationMs = 6000;

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function updateCredit() {
  const text = slides[current].dataset.credit || "";
  const url = slides[current].dataset.creditUrl || "";

  if (!text) {
    credit.textContent = "";
    credit.hidden = true;
    return;
  }

  credit.hidden = false;

  if (url) {
    credit.innerHTML = `<a href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(text)}</a>`;
  } else {
    credit.textContent = text;
  }
}

function showNextSlide() {
  slides[current].classList.remove("active");
  current = (current + 1) % slides.length;
  slides[current].classList.add("active");
  updateCredit();
}

updateCredit();
setInterval(showNextSlide, slideDurationMs);
