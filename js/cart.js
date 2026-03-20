let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
let shipping = "$2.99";

if (cartItems.length === 0) {
  let cartEmpty = document.querySelector(".cart-empty");
  cartEmpty.style.display = "block";

  if (document.querySelector(".cart-items")) {
    document.querySelector(".cart-items").remove();
  }
  if (document.querySelector(".cart-summary")) {
    document.querySelector(".cart-summary").remove();
  }
}

let numberOfProducts = cartItems.length;
let cartItemsContainer = document.querySelector(".shopping-cart-container");

if (cartItemsContainer) {
  creatPageItems(cartItemsContainer);

  if (document.querySelector(".cart-items")) {
    document.querySelectorAll(".cart-items .cart-item").forEach((item) => {
      let plusBtn = item.querySelector(".qty-btn.plus");
      let minusBtn = item.querySelector(".qty-btn.minus");

      plusBtn.addEventListener("click", (e) => {
        increaseQuantity(item, cartItems);
      });

      minusBtn.addEventListener("click", (e) => {
        decreaseQuantity(item, cartItems);
      });

      let removeBtn = item.querySelector(".remove-item");
      removeBtn.addEventListener("click", (e) => {
        removeItem(item, cartItems);
      });
    });
  }

  if (cartItems.length === 0) {
    if (document.querySelector(".cart-items")) {
      document.querySelector(".cart-items").remove();
    }
    if (document.querySelector(".cart-summary")) {
      document.querySelector(".cart-summary").remove();
    }
  }

  document.querySelector("#closeCart")?.addEventListener("click", (e) => {
    window.history.go(-1);
  });

  let proceedBtn = document.querySelector(
    ".cart-summary .btn.btn-primary.checkout",
  );

  if (proceedBtn) {
    proceedBtn.addEventListener("click", (e) => {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, proceed the order!",
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire({
            title: "order proceeded!",
            text: "Your order Will Be Delivered Soon.",
            icon: "success",
          }).then((result) => {
            localStorage.removeItem("cartItems");
            window.location.href = "shop.html#products";
          });
        }
      });
    });
  }
}

function creatPageItems(cartItemsContainer) {
  let container = document.querySelector(".container");

  let cardHeader = document.createElement("div");
  cardHeader.className = "cart-header";

  cardHeader.innerHTML = `
  
          <div class="cart-title">
            <i class="fa-solid fa-shopping-bag"></i>
            <h2>Shopping Cart</h2>
            <span class="cart-count">${numberOfProducts}</span>
          </div>
          <button class="close-cart" id="closeCart">
            <i class="fa-solid fa-xmark"></i>
          </button>
        
  `;

  container.prepend(cardHeader);

  let itemsContainer = document.createElement("div");
  itemsContainer.className = "cart-items";

  cartItems.forEach((item) => {
    let row = document.createElement("div");
    row.className = "cart-item";
    row.dataset.id = item.id;

    row.innerHTML = `
    
            <div class="item-image">
              <img src="${item.img}"
                alt="Product">
              <span class="item-badge">${item.badge}</span>
            </div>
            <div class="item-details">
              <h3 class="item-name">${item.title}</h3>
              <p class="item-description">${item.description}</p>
              <div class="item-meta">
                <span class="item-color">
                  <span class="color-dot"
                    style="background-color: ${item.color};"></span>
                  ${transformToString(item.color)}
                </span>
              </div>
              <div class="item-price">
                <span class="old-price">${item.oldPrice}</span>
                <span class="new-price">${item.price}</span>
              </div>
            </div>
            <div class="item-actions">
              <button class="remove-item" title="Remove">
                <i class="fa-solid fa-trash-can"></i>
              </button>
              <div class="quantity-control">
                <button class="qty-btn minus">
                  <i class="fa-solid fa-minus"></i>
                </button>
                <input type="number" value="${item.quantity}" min="1" max="99"
                  class="qty-input" readonly>
                <button class="qty-btn plus">
                  <i class="fa-solid fa-plus"></i>
                </button>
              </div>
            </div>
    `;

    itemsContainer.appendChild(row);
  });

  container.appendChild(itemsContainer);

  let totalPrice = 0;
  let itemShipping =
    shipping == "free" ? 0 : parseFloat(shipping.replace("$", ""));

  for (let i = 0; i < cartItems.length; i++) {
    let itemPrice = parseFloat(cartItems[i].price.replace("$", ""));
    let totalItemPrice = cartItems[i].quantity * itemPrice;

    totalPrice += totalItemPrice;
  }

  let cardSummary = document.createElement("div");
  cardSummary.className = "cart-summary";

  cardSummary.innerHTML = `
  <div class="summary-details">
            <div class="summary-row">
              <span>Subtotal</span>
              <span class="summary-value subtotal">$${totalPrice.toFixed(2)}</span>
            </div>
            <div class="summary-row">
              <span>Shipping</span>
              <span class="summary-value shipping free">$${itemShipping.toFixed(2)}</span>
            </div>

            <div class="summary-divider"></div>
            <div class="summary-row total">
              <span>Total</span>
              <span class="summary-value total">$${(totalPrice + itemShipping).toFixed(2)}</span>
            </div>
          </div>

          <div class="cart-actions-buttons">
            
              <button class="btn btn-secondary continue-shopping">
              <i class="fa-solid fa-arrow-left"></i>
              Continue Shopping
            </button>
            
            <button class="btn btn-primary checkout">
              Proceed to Checkout
              <i class="fa-solid fa-arrow-right"></i>
            </button>
          </div>

          <div class="secure-checkout">
            <i class="fa-solid fa-lock"></i>
            <span>Secure Checkout</span>
          </div>
  `;

  container.appendChild(cardSummary);

  cartItemsContainer.appendChild(container);

  document
    .querySelector(".btn.btn-secondary.continue-shopping")
    ?.addEventListener("click", (e) => {
      window.location.replace("shop.html#products");
    });

  document
    .querySelector(".btn continue-shopping")
    ?.addEventListener("click", (e) => {
      window.location.replace("shop.html#products");
    });
}
function increaseQuantity(item, cartItems) {
  cartItems.forEach((cartItem) => {
    if (
      cartItem.id == item.dataset.id &&
      cartItem.color == item.querySelector(".color-dot").style.backgroundColor
    ) {
      cartItem.quantity++;
      localStorage.setItem("cartItems", JSON.stringify(cartItems));

      item.querySelector(".qty-input").value = cartItem.quantity;

      updateTotalPrice();
    }
  });
}
function decreaseQuantity(item, cartItems) {
  if (item.querySelector(".qty-input").value == 1) {
  } else {
    cartItems.forEach((cartItem) => {
      if (
        cartItem.id == item.dataset.id &&
        cartItem.color == item.querySelector(".color-dot").style.backgroundColor
      ) {
        cartItem.quantity--;
        localStorage.setItem("cartItems", JSON.stringify(cartItems));

        item.querySelector(".qty-input").value = cartItem.quantity;

        updateTotalPrice();
      }
    });
  }
}

function removeItem(item, cartItems) {
  cartItems.forEach((cartItem, index) => {
    if (
      cartItem.id == item.dataset.id &&
      cartItem.color == item.querySelector(".color-dot").style.backgroundColor
    ) {
      cartItems.splice(index, 1);
      localStorage.setItem("cartItems", JSON.stringify(cartItems));

      numberOfProducts--;
      document.querySelector(".cart-count").innerHTML = numberOfProducts;
    }
    item.remove();
    updateTotalPrice();
  });

  if (JSON.parse(localStorage.getItem("cartItems")).length == 0) {
    document.querySelector(".cart-empty").style.display = "block";
    document.querySelector(".cart-items").remove();
    document.querySelector(".cart-summary").remove();
  }
}

function updateTotalPrice() {
  let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
  let totalPrice = 0;
  let itemShipping =
    shipping == "free" ? 0 : parseFloat(shipping.replace("$", ""));

  for (let i = 0; i < cartItems.length; i++) {
    let itemPrice = parseFloat(cartItems[i].price.replace("$", ""));
    let totalItemPrice = cartItems[i].quantity * itemPrice;

    totalPrice += totalItemPrice;
  }

  document.querySelector(".subtotal").innerHTML = `$${totalPrice.toFixed(2)}`;
  document.querySelector(".summary-value.total").innerHTML =
    `$${(totalPrice + itemShipping).toFixed(2)}`;
}
