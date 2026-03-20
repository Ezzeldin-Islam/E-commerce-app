const allProducts = async () => {
  try {
    let response = await fetch("./products.json");
    let products = await response.json();
    return products;
  } catch (error) {
    console.error("Failed to load products:", error);

    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Failed to load products. Please refresh the page.",
    });

    return [];
  }
};

let urlParams = new URLSearchParams(window.location.search);
let productId = urlParams.get("id");

if (!productId || isNaN(parseInt(productId))) {
  alert("the id is wrong");
  window.location.href = "shop.html";
}

(async () => {
  let products = await allProducts();
  let product = products.find((product) => product.id == productId);
  if (!product) {
    alert("there is no product with this id");
    window.location.href = "shop.html";
  }
  let shipping = product.shipping;
  //* create product details page
  createProductDetails(product, shipping);

  let colors = document.querySelectorAll(".colors .color");

  let addToCartBtn = document.querySelector(".product-details .select-btn");
  let loveBtn = document.querySelector(".icon-btn.heart");

  //* choose color

  let firstColor = colors[0];
  let selectedColor = null;

  if (firstColor) {
    colors[0].classList.add("active");

    selectedColor = firstColor.style.backgroundColor;
  }

  if (loveBtn && selectedColor) {
    updateLoveBtn(product.id, selectedColor, loveBtn);
  }

  if (colors) {
    colors.forEach((color) => {
      color.addEventListener("click", (e) => {
        colors.forEach((color) => color.classList.remove("active"));
        color.classList.add("active");
        selectedColor = color.style.background;

        if (loveBtn && selectedColor) {
          updateLoveBtn(product.id, selectedColor, loveBtn);
        }
      });
    });
  }

  if (loveBtn) {
    loveBtn.addEventListener("click", (e) => {
      const selectedProduct = {
        id: product.id,
        img: product.img,
        description: product.description,
        title: product.title,
        price: product.price,
        oldPrice: product.oldPrice,
        color: selectedColor,
        badge: product.badge,
        loved: product.loved,
      };

      addToLove(selectedProduct, loveBtn, selectedColor);
      updateLoveBtn(product.id, selectedColor, loveBtn);
      countLovedElement();
    });
  }

  if (addToCartBtn) {
    addToCartBtn.addEventListener("click", (e) => {
      const selectedProduct = {
        id: product.id,
        img: product.img,
        description: product.description,
        title: product.title,
        price: product.price,
        oldPrice: product.oldPrice,
        color: selectedColor,
        quantity: 1,
        badge: product.badge,
        loved: product.loved,
      };

      addToCart(selectedProduct, shipping);
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "product has been added to cart items",
        showConfirmButton: false,
        timer: 1000,
      });
    });
  }

  //* control img slider
  let smallImages = document.querySelectorAll(
    ".product-images .smaller-imgs img",
  );
  let theMainImage = document.querySelector(".product-images .main-img img");

  if (smallImages) {
    smallImages.forEach((img) => {
      img.addEventListener("click", (e) => {
        theMainImage.src = img.src;
      });
    });
  }
})();

if (document.querySelector(".header")) {
  countCartElement();
  countLovedElement();
}

function createProductDetails(product, shipping) {
  let productDetailsContainer = document.querySelector(
    ".product-details-container",
  );

  let container = document.createElement("div");
  container.classList.add("container");

  container.innerHTML = `<div class="product-details">

            <div class="product-images">
              <div class="main-img">
                <img src="imgs/shop-page/products/product-cover-${product.id}.png"
                  alt="Product Main Image" id="main-product-img">
              </div>

              <div class="smaller-imgs">
                <img src="imgs/shop-page/products/product-cover-${product.id}.png"
                  alt="Product Thumbnail 1" class="thumbnail">
                <img src="imgs/shop-page/products/product-cover-${product.id + 1}.png"
                  alt="Product Thumbnail 2" class="thumbnail">
                <img src="imgs/shop-page/products/product-cover-${product.id + 2}.png"
                  alt="Product Thumbnail 3" class="thumbnail">
              </div>
            </div>

            <div class="product-content">
              <h1 id="product-title" class="product-title">${product.title}</h1>

              <h2 class="product-category">category : ${product.category}</h2>

              <div class="rating-and-reviews">
                <div class="rating">
                  <div><span>${product.rating}</span> <i class="fa-solid fa-star"></i></div>
                </div>
                <div class="reviews"><span>${product.reviews}</span> reviews</div>
              </div>

              <div class="total-pricing">
                <div class="old-pricing">${product.oldPrice}</div>
                <div class="pricing">${product.price}</div>
              </div>

              <div class="total-pricing">
                shipping : <div class="shipping btn">${shipping}</div>
                badge : <div class="badge btn">${product.badge}</div>
              </div>

              <div class="availability">
                Availability : <span class="in-stock"> ${product.availability}</span>
              </div>

              <p class="description">
                ${product.description}
              </p>

              <hr>

              <div class="colors">
                ${product.colors
                  .map(
                    (color) =>
                      `<div class="color" style="background: ${color}"></div>`,
                  )
                  .join("")}
                </div>

              <div class="select-options">
                <button class="btn select-btn">Add to cart</button>
                <button class="icon-btn heart">
                  <i class="fa-regular fa-heart"></i>
                </button>
              </div>
            </div>

          </div>`;

  productDetailsContainer.appendChild(container);
}

function addToCart(selectedProduct) {
  let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];

  let existingProductIndex = cartItems.findIndex(
    (item) =>
      item.id === selectedProduct.id && item.color === selectedProduct.color,
  );

  if (existingProductIndex !== -1) {
    cartItems[existingProductIndex].quantity += 1;
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  } else {
    cartItems.push(selectedProduct);
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }

  localStorage.setItem("cartItems", JSON.stringify(cartItems));
  countCartElement();
}

function addToLove(selectedProduct, selectedColor, loveBtn) {
  let lovedItems = JSON.parse(localStorage.getItem("lovedItems")) || [];
  if (loveBtn) {
    updateLoveBtn(selectedProduct.id, selectedColor, loveBtn);
  }

  let existingProductIndex = lovedItems.findIndex(
    (item) =>
      item.id === selectedProduct.id && item.color === selectedProduct.color,
  );

  if (existingProductIndex === -1) {
    lovedItems.push(selectedProduct);
    Swal.fire({
      position: "top-end",
      icon: "success",
      title: "product has been added to loved items",
      showConfirmButton: false,
      timer: 1000,
    });
  } else {
    lovedItems.splice(existingProductIndex, 1);
    Swal.fire({
      position: "top-end",
      icon: "success",
      title: "product has been removed from loved items",
      showConfirmButton: false,
      timer: 1000,
    });
  }

  localStorage.setItem("lovedItems", JSON.stringify(lovedItems));
}

function countLovedElement() {
  const countLovedElement = document.querySelector(".log-in-row .love .count");
  if (countLovedElement) {
    countLovedElement.textContent =
      JSON.parse(localStorage.getItem("lovedItems"))?.length || 0;
  }
}

function updateLoveBtn(productId, selectedColor, loveBtn) {
  let lovedItems = JSON.parse(localStorage.getItem("lovedItems")) || [];
  let isLoved = lovedItems.some(
    (item) => item.id === productId && item.color === selectedColor,
  );
  let icon = document.querySelector(".icon-btn.heart i");
  if (isLoved) {
    if (icon.classList.contains("fa-regular")) {
      icon.className = "fa-solid fa-heart";
    } else {
      icon.className = "fa-regular fa-heart";
    }
  } else {
    icon.className = "fa-regular fa-heart";
  }
}

function countCartElement() {
  const countElement = document.querySelector(".log-in-row .shop .count");
  if (countElement) {
    countElement.textContent =
      JSON.parse(localStorage.getItem("cartItems"))?.length || 0;
  }
}
