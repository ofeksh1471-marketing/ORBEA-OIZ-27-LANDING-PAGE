const accordionGroups = document.querySelectorAll("[data-accordion-group]");

accordionGroups.forEach((group) => {
  const cards = [...group.querySelectorAll(".expand-card")];

  cards.forEach((card) => {
    const button = card.querySelector(".expand-toggle");

    button.addEventListener("click", () => {
      const shouldOpen = !card.classList.contains("open");

      cards.forEach((item) => {
        item.classList.remove("open");
        item.querySelector(".expand-toggle").setAttribute("aria-expanded", "false");
      });

      if (shouldOpen) {
        card.classList.add("open");
        button.setAttribute("aria-expanded", "true");
      }
    });
  });
});

const revealItems = document.querySelectorAll(".reveal-on-scroll");

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.18 }
  );

  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

const models = [
  { name: "Oiz M-LTD", image: "assets/media/OIZ M-LTD.jpg" },
  { name: "Oiz M-Team FACTORY", image: "assets/media/OIZ M-TEAM FACTORY.jpg" },
  { name: "Oiz M-PRO", image: "assets/media/OIZ M-PRO.jpg" },
  { name: "Oiz M10 AXS", image: "assets/media/Oiz M10 AXS.jpg" },
  { name: "Oiz M10", image: "assets/media/OIZ M10.jpg" },
  { name: "Oiz M20", image: "assets/media/OIZ M20.jpg" },
  { name: "Oiz M30", image: "assets/media/OIZ M30.jpg" },
];

const modelName = document.querySelector("#model-name");
const modelImage = document.querySelector("#model-image");
const modelTabs = document.querySelector(".model-tabs");
let activeModel = 0;
let modelTimer;

function showModel(index) {
  activeModel = (index + models.length) % models.length;
  const model = models[activeModel];
  modelName.textContent = model.name;
  modelImage.style.opacity = "0";
  modelImage.style.transform = "translateY(8px) scale(0.985)";

  window.setTimeout(() => {
    modelImage.src = model.image;
    modelImage.alt = model.name;
    modelImage.style.opacity = "1";
    modelImage.style.transform = "translateY(0) scale(1)";
  }, 160);

  [...modelTabs.children].forEach((tab, tabIndex) => {
    tab.classList.toggle("active", tabIndex === activeModel);
  });
}

function startModelRotation() {
  clearInterval(modelTimer);
  modelTimer = setInterval(() => showModel(activeModel + 1), 2800);
}

models.forEach((model, index) => {
  const tab = document.createElement("button");
  tab.className = "model-tab";
  tab.type = "button";
  tab.textContent = model.name;
  tab.addEventListener("click", () => {
    showModel(index);
    startModelRotation();
  });
  modelTabs.append(tab);
});

showModel(0);
startModelRotation();

document.querySelector(".lead-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const button = form.querySelector(".submit-button");
  const formData = new FormData(form);

  button.disabled = true;
  button.textContent = "שולח...";

  try {
    await fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(formData).toString(),
    });

    form.reset();
    form.classList.add("submitted");
    button.textContent = "נשלח";
  } catch (error) {
    button.disabled = false;
    button.textContent = "נסה שוב";
  }
});
