"use strict";

const menuButton = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".primary-nav");

if (menuButton instanceof HTMLButtonElement && navigation instanceof HTMLElement) {
  menuButton.addEventListener("click", () => {
    const isOpen = menuButton.getAttribute("aria-expanded") === "true";
    menuButton.setAttribute("aria-expanded", String(!isOpen));
    menuButton.setAttribute("aria-label", isOpen ? "Abrir menú" : "Cerrar menú");
    navigation.classList.toggle("is-open", !isOpen);
  });

  navigation.addEventListener("click", (event) => {
    if (event.target instanceof HTMLAnchorElement) {
      menuButton.setAttribute("aria-expanded", "false");
      menuButton.setAttribute("aria-label", "Abrir menú");
      navigation.classList.remove("is-open");
    }
  });
}

document.querySelectorAll("[data-year]").forEach((element) => {
  element.textContent = String(new Date().getFullYear());
});

const form = document.querySelector("#contact-form");

if (form instanceof HTMLFormElement) {
  const params = new URLSearchParams(window.location.search);
  const serviceSelect = form.querySelector("#service");
  const serviceNames = {
    identidad: "Identidad visual",
    digital: "Diseño para redes",
    impresion: "Gráfica impresa",
    "menu-qr": "Menú QR y pedidos online",
    saas: "Software de gestión para restaurantes",
    otro: "Otro proyecto"
  };
  const requestedService = params.get("servicio");
  if (serviceSelect instanceof HTMLSelectElement && requestedService && serviceNames[requestedService]) {
    serviceSelect.value = serviceNames[requestedService];
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const error = form.querySelector("#form-error");
    if (!(error instanceof HTMLElement)) return;

    if (!form.reportValidity()) return;

    const formData = new FormData(form);
    const name = String(formData.get("name") ?? "").trim();
    const business = String(formData.get("business") ?? "").trim();
    const service = String(formData.get("service") ?? "").trim();
    const message = String(formData.get("message") ?? "").trim();
    const consent = formData.get("consent") === "on";

    if (!name || !message || !consent) {
      error.textContent = "Completa los campos obligatorios y acepta la política de privacidad.";
      error.hidden = false;
      return;
    }

    const details = [
      "Hola Billy, quiero hablar de un proyecto de diseño.",
      `Nombre: ${name}`,
      business ? `Negocio o marca: ${business}` : "",
      service ? `Servicio: ${service}` : "",
      `Idea: ${message}`
    ].filter(Boolean);

    error.hidden = true;
    const whatsappUrl = new URL("https://wa.me/34672197472");
    whatsappUrl.searchParams.set("text", details.join("\n"));
    window.open(whatsappUrl.toString(), "_blank", "noopener,noreferrer");
  });
}

const menuList = document.querySelector("#menu-item-list");

if (menuList instanceof HTMLElement) {
  const demoItems = [
    { id: "olivas", name: "Aceitunas aliñadas", description: "Naranja, romero y aceite de la casa", category: "entrantes", price: 3.5, vegetarian: true, icon: "◉", light: "#aeb66e", dark: "#6b774b", tags: ["VEGETARIANO"] },
    { id: "croquetas", name: "Croquetas de temporada", description: "Bechamel suave · 4 unidades", category: "entrantes", price: 5.8, vegetarian: false, icon: "◌", light: "#e5bd80", dark: "#b77b4e", tags: ["MUESTRA"] },
    { id: "berenjena", name: "Berenjena a la brasa", description: "Miel, yogur y hierbas frescas", category: "principales", price: 8.5, vegetarian: true, icon: "◒", light: "#a7a56c", dark: "#65684a", tags: ["VEGETARIANO"] },
    { id: "tosta", name: "Tosta de temporada", description: "Pan rústico y producto local", category: "principales", price: 7.2, vegetarian: true, icon: "◧", light: "#d9a36a", dark: "#947048", tags: ["VEGETARIANO"] },
    { id: "tarta", name: "Tarta de queso", description: "Textura cremosa · receta de muestra", category: "postres", price: 5.2, vegetarian: true, icon: "◩", light: "#e8d3a0", dark: "#bd9766", tags: ["VEGETARIANO"] },
    { id: "fruta", name: "Fruta de temporada", description: "Selección fresca del día", category: "postres", price: 4.1, vegetarian: true, icon: "✳", light: "#c5b976", dark: "#789064", tags: ["VEGETARIANO"] },
    { id: "limonada", name: "Limonada de la casa", description: "Limón, hierbabuena y hielo", category: "bebidas", price: 3.3, vegetarian: true, icon: "◉", light: "#d7dc8d", dark: "#96a264", tags: ["VEGETARIANO"] },
    { id: "cafe", name: "Café de especialidad", description: "Consulta las variedades disponibles", category: "bebidas", price: 2.2, vegetarian: true, icon: "◍", light: "#bd9879", dark: "#715947", tags: ["VEGETARIANO"] }
  ];
  const categoryNames = {
    all: "Para disfrutar",
    entrantes: "Para compartir",
    principales: "Platos principales",
    postres: "Algo dulce",
    bebidas: "Para brindar"
  };
  const categoryKickers = {
    all: "LA CARTA COMPLETA",
    entrantes: "CENTRO DE MESA",
    principales: "COCINA DE TEMPORADA",
    postres: "UN FINAL DULCE",
    bebidas: "BEBIDAS"
  };
  const cart = new Map();
  let activeCategory = "all";
  let vegetarianOnly = false;
  let query = "";
  const search = document.querySelector("#menu-search");
  const categoryLabel = document.querySelector("#menu-category-label");
  const sectionTitle = document.querySelector("#menu-section-title");
  const itemCount = document.querySelector("#menu-item-count");
  const vegFilter = document.querySelector("#veg-filter");
  const cartBar = document.querySelector("#menu-cart-bar");
  const cartCount = document.querySelector("#cart-count");
  const cartSummary = document.querySelector("#cart-summary");
  const cartTotal = document.querySelector("#cart-total");
  const cartDialog = document.querySelector("#cart-dialog");
  const cartLines = document.querySelector("#cart-lines");
  const dialogTotal = document.querySelector("#dialog-total");
  const confirmation = document.querySelector("#demo-confirmation");

  const formatPrice = (amount) => `${amount.toFixed(2).replace(".", ",")} €`;
  const selectedProducts = () => demoItems.filter((item) => {
    const matchesCategory = activeCategory === "all" || item.category === activeCategory;
    const matchesVegetarian = !vegetarianOnly || item.vegetarian;
    const matchesSearch = `${item.name} ${item.description}`.toLocaleLowerCase("es").includes(query);
    return matchesCategory && matchesVegetarian && matchesSearch;
  });
  const renderMenu = () => {
    const products = selectedProducts();
    if (categoryLabel instanceof HTMLElement) categoryLabel.textContent = categoryKickers[activeCategory];
    if (sectionTitle instanceof HTMLElement) sectionTitle.textContent = categoryNames[activeCategory];
    if (itemCount instanceof HTMLElement) itemCount.textContent = `${products.length} ${products.length === 1 ? "propuesta" : "propuestas"}`;
    menuList.innerHTML = products.length ? products.map((item) => `
      <article class="menu-item">
        <span class="menu-item-art" style="--dish-light:${item.light};--dish-dark:${item.dark}" aria-hidden="true">${item.icon}</span>
        <div class="menu-item-info"><h3>${item.name}</h3><p>${item.description}</p><span class="menu-item-tags">${item.tags.map((tag) => `<span>${tag}</span>`).join("")}</span></div>
        <div class="menu-item-price"><strong>${formatPrice(item.price)}</strong><button type="button" data-add="${item.id}" aria-label="Añadir ${item.name} al pedido de muestra">+</button></div>
      </article>`).join("") : '<p class="empty-menu">No encontramos productos con esos filtros.</p>';
  };
  const renderCart = () => {
    const count = [...cart.values()].reduce((sum, quantity) => sum + quantity, 0);
    const total = demoItems.reduce((sum, item) => sum + item.price * (cart.get(item.id) ?? 0), 0);
    if (cartBar instanceof HTMLElement) cartBar.hidden = count === 0;
    if (cartCount instanceof HTMLElement) cartCount.textContent = String(count);
    if (cartSummary instanceof HTMLElement) cartSummary.textContent = count ? `${count} ${count === 1 ? "artículo" : "artículos"} · pedido de muestra` : "Aún no has añadido nada";
    if (cartTotal instanceof HTMLElement) cartTotal.textContent = formatPrice(total);
    if (dialogTotal instanceof HTMLElement) dialogTotal.textContent = formatPrice(total);
    if (cartLines instanceof HTMLElement) {
      const products = demoItems.filter((item) => cart.has(item.id));
      cartLines.innerHTML = products.length ? products.map((item) => `
        <div class="cart-line"><span>${item.name}</span>
          <div class="cart-quantity"><button type="button" data-remove="${item.id}" aria-label="Quitar una unidad de ${item.name}">−</button><span>${cart.get(item.id)}</span><button type="button" data-add="${item.id}" aria-label="Añadir una unidad de ${item.name}">+</button></div>
          <strong>${formatPrice(item.price * (cart.get(item.id) ?? 0))}</strong></div>`).join("") : '<p class="empty-menu">Todavía no has añadido nada.</p>';
    }
  };

  menuList.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const addButton = target.closest("[data-add]");
    if (!(addButton instanceof HTMLElement)) return;
    const id = addButton.dataset.add;
    if (!id || !demoItems.some((item) => item.id === id)) return;
    cart.set(id, (cart.get(id) ?? 0) + 1);
    renderCart();
  });

  document.querySelector(".menu-categories")?.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLButtonElement) || !target.dataset.category) return;
    activeCategory = target.dataset.category;
    document.querySelectorAll(".menu-categories [role='tab']").forEach((tab) => {
      tab.setAttribute("aria-selected", String(tab === target));
    });
    renderMenu();
  });

  if (search instanceof HTMLInputElement) {
    search.addEventListener("input", () => {
      query = search.value.trim().toLocaleLowerCase("es");
      renderMenu();
    });
  }

  if (vegFilter instanceof HTMLButtonElement) {
    vegFilter.addEventListener("click", () => {
      vegetarianOnly = !vegetarianOnly;
      vegFilter.setAttribute("aria-pressed", String(vegetarianOnly));
      renderMenu();
    });
  }

  document.querySelector("#open-cart")?.addEventListener("click", () => {
    if (cartDialog instanceof HTMLDialogElement && !cartDialog.open) cartDialog.showModal();
    renderCart();
  });

  cartDialog?.addEventListener("click", (event) => {
    if (!(event.target instanceof Element)) return;
    const removeButton = event.target.closest("[data-remove]");
    if (!(removeButton instanceof HTMLElement)) return;
    const id = removeButton.dataset.remove;
    if (!id) return;
    const quantity = cart.get(id) ?? 0;
    if (quantity <= 1) cart.delete(id);
    else cart.set(id, quantity - 1);
    renderCart();
  });

  document.querySelector("#demo-confirm")?.addEventListener("click", () => {
    if (confirmation instanceof HTMLElement) confirmation.hidden = false;
  });

  document.addEventListener("keydown", (event) => {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k" && search instanceof HTMLInputElement) {
      event.preventDefault();
      search.focus();
    }
  });

  renderMenu();
  renderCart();
}
