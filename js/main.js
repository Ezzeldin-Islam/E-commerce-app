//* preparing for headroom.js libirary
document.addEventListener("DOMContentLoaded", function () {
  var myElement = document.querySelector(".header");

  if (!myElement) {
    return;
  }

  var options = {
    offset: 100, // ابدأ بعد 100px scroll
    tolerance: {
      up: 10, // حساسية scroll لفوق
      down: 5, // حساسية scroll لتحت
    },
    classes: {
      initial: "header",
      pinned: "header--pinned",
      unpinned: "header--unpinned",
      top: "header--top",
      notTop: "header--not-top",
    },
    onPin: function () {},
    onUnpin: function () {},
    onTop: function () {},
    onNotTop: function () {},
  };

  // إنشاء Headroom
  var headroom = new Headroom(myElement, options);
  headroom.init();
});
window.addEventListener("load", () => {
  const loader = document.querySelector(".loading-overlay");

  if (loader) {
    setTimeout(() => {
      loader.style.opacity = "0";
      loader.style.transition = "opacity 0.5s";

      setTimeout(() => {
        loader.style.display = "none";
      }, 500);
    }, 500);
  }
});

//* scroll to top btn
let scrollTopBtn = document.querySelector(".scroll-top");

window.addEventListener("scroll", (e) => {
  if (window.scrollY >= 500) {
    scrollTopBtn.classList.add("active");
  } else {
    scrollTopBtn.classList.remove("active");
  }
});

scrollTopBtn.addEventListener("click", function (e) {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});

//* toggle menue icon logic

const menuToggle = document.querySelector(".menu-toggle");
const headerLinks = document.querySelector(".header-links");

if (menuToggle) {
  menuToggle.addEventListener("click", function () {
    headerLinks.classList.toggle("active");

    const icon = this.querySelector("i");
    if (headerLinks.classList.contains("active")) {
      icon.classList.remove("fa-bars");
      icon.classList.add("fa-times");
    } else {
      icon.classList.remove("fa-times");
      icon.classList.add("fa-bars");
    }
  });
}

if (document.querySelector(".header")) {
  document.addEventListener("click", function (e) {
    if (!e.target.closest(".header nav")) {
      headerLinks.classList.remove("active");
      const icon = menuToggle.querySelector("i");
      icon.classList.remove("fa-times");
      icon.classList.add("fa-bars");
    }
  });
  countCartElement();
  countLovedElement();
}

const menuLinks = document.querySelectorAll(".header-links a");
menuLinks.forEach((link) => {
  link.addEventListener("click", () => {
    headerLinks.classList.remove("active");
    const icon = menuToggle.querySelector("i");
    icon.classList.remove("fa-times");
    icon.classList.add("fa-bars");
  });
});

//* add landing images
let landingPage = document.querySelector(".home-page .landing-page");
let arrowLeft = document.querySelector(".home-page .landing-page .arrow-left");
let arrowRight = document.querySelector(
  ".home-page .landing-page .arrow-right",
);

let images = [
  "./imgs/home-page/shop-hero-1-product-slide-1.png",
  "./imgs/home-page/landing-3.png",
];

let currentIndex = 0;
if (arrowLeft) {
  arrowLeft.addEventListener("click", (e) => {
    currentIndex--;
    if (currentIndex < 0) {
      currentIndex = images.length - 1;
    }
    changeBackground(landingPage, currentIndex);
  });
}

if (arrowRight) {
  arrowRight.addEventListener("click", (e) => {
    currentIndex++;
    if (currentIndex > images.length - 1) {
      currentIndex = 0;
    }
    changeBackground(landingPage, currentIndex);
  });
}

if (landingPage) {
  autoChangeBackground(landingPage);
}

//*  add bestsellers in home page

let homeProductsContainer = document.querySelector(
  ".home-page .bestseller .products-container",
);

const specialProducts = async () => {
  try {
    let response = await fetch("./products.json");
    let data = await response.json();
    let bestsellers = data.filter((product) => product.badge == "Bestseller");

    return bestsellers;
  } catch (error) {
    console.log(error);
  }
};

if (homeProductsContainer) {
  createHomeBestsellers(specialProducts());
}

//* add main products to the shop page
let mainProductsContainer = document.querySelector(
  ".shop-page .products-container",
);

const mainProducts = async () => {
  try {
    let response = await fetch("./products.json");
    let data = await response.json();
    let products = data;

    return products;
  } catch (error) {
    console.log(error);
  }
};

if (mainProductsContainer) {
  mainProducts()
    .then((products) => {
      if (products.length > 0) {
        createShopProducts(mainProducts());
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Failed to load products. Please refresh the page.",
        });
      }
    })
    .catch((error) => {
      console.error("Failed to load products:", error);

      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Failed to load products. Please refresh the page.",
      });
    });
}

//* count products function
calcNumOfProducts();

//* manage the style to show products grid || list
let gridBtn = document.querySelector(
  ".shop-page .control-products .view-mode .grid-mode",
);
let listBtn = document.querySelector(
  ".shop-page .control-products .view-mode .list-mode",
);

if (gridBtn) {
  switchViewModeToGrid(mainProductsContainer, gridBtn, listBtn);
}

if (listBtn) {
  switchViewModeToList(mainProductsContainer, listBtn, gridBtn);
}

//* manage the select and filter products
let select = document.querySelector(".shop-page .control-products select");
let filterBtn = document.querySelector(".shop-page .control-products .filter");

if (filterBtn) {
  filterBtn.addEventListener("click", async (e) => {
    let selectedValue = select.value;

    if (selectedValue.toLowerCase() === "all") {
      document
        .querySelectorAll(".shop-page .products-container .product")
        .forEach((pro) => pro.remove());

      createShopProducts(mainProducts());
    } else {
      let allProducts = await mainProducts();
      let filteredProducts = allProducts.filter(
        (product) =>
          product.title.toLocaleLowerCase() ===
          selectedValue.toLocaleLowerCase(),
      );
      document
        .querySelectorAll(".shop-page .products-container .product")
        .forEach((pro) => pro.remove());
      filterProducts(filteredProducts);
    }

    calcNumOfProducts();
  });
}

//* create the product details page
//* in shop page
document
  .querySelector(".products-container")
  ?.addEventListener("click", (e) => {
    let product = e.target.closest(".product");

    if (product) {
      let productId = product.dataset.id;
      window.location.href = `product-details.html?id=${productId}`;
    }
  });
//* in home page
document
  .querySelector(".home-page .products-container")
  ?.addEventListener("click", (e) => {
    let product = e.target.closest(".product");

    if (product) {
      let productId = product.dataset.id;
      window.location.href = `product-details.html?id=${productId}`;
    }
  });

if (document.querySelector(".header")) {
  countCartElement();
  countLovedElement();
}

//* manage data in pricing page
let inputSwitch = document.querySelector(".pricing-switch-input");
if (inputSwitch) {
  inputSwitch.addEventListener("change", (e) => {
    inputSwitch.classList.toggle("active");
    let allPlans = document.querySelectorAll(".pricing-card-item");
    if (inputSwitch.classList.contains("active")) {
      allPlans.forEach((plan) => {
        let price = parseFloat(
          plan.querySelector(".pricing-card-price-box .pricing-card-amount")
            .innerHTML,
        );
        let period = plan.querySelector(
          ".pricing-card-price-box .pricing-card-period",
        ).innerHTML;

        price = price * 10;
        period = "yearly";

        plan.querySelector(
          ".pricing-card-price-box .pricing-card-amount",
        ).innerHTML = price.toFixed(2);
        plan.querySelector(
          ".pricing-card-price-box .pricing-card-period",
        ).innerHTML = period;
      });
    } else {
      allPlans.forEach((plan) => {
        let price = parseFloat(
          plan.querySelector(".pricing-card-price-box .pricing-card-amount")
            .innerHTML,
        );
        let period = plan.querySelector(
          ".pricing-card-price-box .pricing-card-period",
        ).innerHTML;

        price = price / 10;
        period = "monthly";

        plan.querySelector(
          ".pricing-card-price-box .pricing-card-amount",
        ).innerHTML = price.toFixed(2);
        plan.querySelector(
          ".pricing-card-price-box .pricing-card-period",
        ).innerHTML = period;
      });
    }
  });
}

//* handle click on sign up of register
let regiterLink = document.querySelector(".log-in-row .register");
let logInLink = document.querySelectorAll(".log-in-row .log-in")[0];

if (regiterLink) {
  regiterLink.addEventListener("click", () => {
    window.location.href = "register.html";
  });
}

function createHomeBestsellers(specialProducts) {
  specialProducts.then((specialProducts) => {
    let productsHtml = specialProducts
      .map((product) => createProductHtml(product))
      .join("");

    homeProductsContainer.innerHTML = productsHtml;
  });
}

function createShopProducts(mainProducts) {
  mainProducts.then((products) => {
    let productsHtml = products
      .map((product) => createProductHtml(product))
      .join("");

    mainProductsContainer.innerHTML = productsHtml;
  });
}

function filterProducts(products) {
  let productsHtml = products
    .map((product) => createProductHtml(product))
    .join("");

  mainProductsContainer.innerHTML = productsHtml;
}

function changeBackground(landingPage, currentIndex) {
  landingPage.style.backgroundImage = `url(${images[currentIndex]})`;
}

function calcNumOfProducts() {
  let numberOfProducts = document.querySelectorAll(
    ".shop-page .products-container .product",
  ).length;

  //* add num of products to the nav control

  let numberSpanProducts = document.querySelector(
    ".control-products .num-of-products span",
  );

  if (numberSpanProducts) {
    numberSpanProducts.textContent = numberOfProducts;
  }
}

function autoChangeBackground(landingPage) {
  setInterval(() => {
    currentIndex++;
    if (currentIndex >= images.length) {
      currentIndex = 0;
    }
    changeBackground(landingPage, currentIndex);
  }, 5000);
}

function countLovedElement() {
  const countLovedElement = document.querySelector(".log-in-row .love .count");
  if (countLovedElement) {
    countLovedElement.innerHTML =
      JSON.parse(localStorage.getItem("lovedItems"))?.length || 0;
  }
}

function countCartElement() {
  const countElement = document.querySelector(".log-in-row .shop .count");
  if (countElement) {
    countElement.innerHTML =
      JSON.parse(localStorage.getItem("cartItems"))?.length || 0;
  }
}

function switchViewModeToGrid(mainProductsContainer, mainBtn, secondBtn) {
  mainBtn.addEventListener("click", (e) => {
    mainBtn.classList.add("active");
    secondBtn.classList.remove("active");
    mainProductsContainer.classList.remove("list");
  });
}
function switchViewModeToList(mainProductsContainer, mainBtn, secondBtn) {
  mainBtn.addEventListener("click", (e) => {
    mainBtn.classList.add("active");
    secondBtn.classList.remove("active");
    mainProductsContainer.classList.add("list");
  });
}

function createProductHtml(product) {
  return `
    <div class="product" data-id="${product.id}">
    <div class="img">
                <img src="${product.img}" alt>
              </div>
              <div class="content">
                <h5 class="title">${product.title}</h5>
                <p class="category">${product.category}</p>
                <div class="price">${product.price}</div>
                <div class="colors">
                ${product.colors
                  .map(
                    (color) =>
                      `<div class="color" style="background: ${color}"></div>`,
                  )
                  .join("")}
                </div>
              </div>
              </div>`;
}

function transformToString(itemColor) {
  if (itemColor == "rgb(35, 166, 240)") {
    return "Blue";
  }
  if (itemColor == "rgb(35, 133, 109)") {
    return "Green";
  }
  if (itemColor == "rgb(231, 124, 64)") {
    return "Orange";
  }
  if (itemColor == "rgb(37, 43, 66)") {
    return "Black";
  }
}
