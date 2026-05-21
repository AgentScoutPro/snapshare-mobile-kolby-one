const contact = {
  firstName: "Kolby",
  lastName: "Kolibas",
  fullName: "Kolby Kolibas",
  title: "Chief Algorithm Alchemist & AI Strategist",
  company: "C0d3xAI",
  phone: "+14809018393",
  phoneDisplay: "480-901-8393",
  email: "kolby@c0de3ai.com",
  bookingUrl: "",
};

const bookingRequestUrl = `mailto:${contact.email}?subject=${encodeURIComponent(
  `Book time with ${contact.fullName}`,
)}&body=${encodeURIComponent(
  `Hi ${contact.firstName},\n\nI'd like to book time on your calendar.\n\nBest,\n`,
)}`;

const contactUrlLines = contact.bookingUrl ? [`URL:${contact.bookingUrl}`] : [];

const vcard = [
  "BEGIN:VCARD",
  "VERSION:3.0",
  `FN:${contact.fullName}`,
  `N:${contact.lastName};${contact.firstName};;;`,
  `ORG:${contact.company}`,
  `TITLE:${contact.title}`,
  `TEL;TYPE=CELL:${contact.phone}`,
  `EMAIL:${contact.email}`,
  ...contactUrlLines,
  "END:VCARD",
].join("\n");

const qrCode = document.querySelector("#qrCode");
const bookTime = document.querySelector("#bookTime");
const saveContact = document.querySelector("#saveContact");
const shareContact = document.querySelector("#shareContact");
const contactCard = document.querySelector(".contact-card");
const scanToggle = document.querySelector("#scanToggle");

qrCode.src = `https://api.qrserver.com/v1/create-qr-code/?size=320x320&margin=18&data=${encodeURIComponent(vcard)}`;
qrCode.addEventListener("load", () => {
  qrCode.classList.add("is-loaded");
});

bookTime.href = contact.bookingUrl || bookingRequestUrl;

saveContact.addEventListener("click", () => {
  const blob = new Blob([vcard], { type: "text/vcard;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "kolby-kolibas.vcf";
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  saveContact.classList.remove("pulse-confirm");
  requestAnimationFrame(() => saveContact.classList.add("pulse-confirm"));
});

scanToggle.addEventListener("click", () => {
  scanToggle.classList.remove("is-scanning");
  requestAnimationFrame(() => scanToggle.classList.add("is-scanning"));
  window.setTimeout(() => {
    scanToggle.classList.remove("is-scanning");
  }, 1600);
});

shareContact.addEventListener("click", async () => {
  if (navigator.share) {
    await navigator.share({
      title: `${contact.fullName} | ${contact.company}`,
      text: `Save ${contact.fullName} at ${contact.company}.`,
      url: window.location.href,
    });
    return;
  }

  await navigator.clipboard.writeText(window.location.href);
  shareContact.textContent = "Link Copied";
  shareContact.classList.remove("pulse-confirm");
  requestAnimationFrame(() => shareContact.classList.add("pulse-confirm"));
  window.setTimeout(() => {
    shareContact.textContent = "Share Card";
  }, 1600);
});

if (contactCard && window.matchMedia("(pointer: fine)").matches) {
  contactCard.addEventListener("pointermove", (event) => {
    const bounds = contactCard.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;

    contactCard.style.setProperty("--tilt-x", `${(-y * 5).toFixed(2)}deg`);
    contactCard.style.setProperty("--tilt-y", `${(x * 6).toFixed(2)}deg`);
    document.documentElement.style.setProperty("--glow-x", `${(event.clientX / window.innerWidth) * 100}%`);
    document.documentElement.style.setProperty("--glow-y", `${(event.clientY / window.innerHeight) * 100}%`);
  });

  contactCard.addEventListener("pointerleave", () => {
    contactCard.style.setProperty("--tilt-x", "0deg");
    contactCard.style.setProperty("--tilt-y", "0deg");
  });
}
