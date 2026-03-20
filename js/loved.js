let lovedItems = JSON.parse(localStorage.getItem("lovedItems")) || [];

if (lovedItems.length === 0) {
  let cartEmpty = document.querySelector(".cart-empty");
  cartEmpty.style.display = "block";

  if (document.querySelector(".cart-items")) {
    document.querySelector(".cart-items").remove();
  }
}

let numberOfProducts = lovedItems.length;
let cartItemsContainer = document.querySelector(".shopping-cart-container");

if (cartItemsContainer) {
  creatPageItems(cartItemsContainer);

  if (document.querySelector(".cart-items")) {
    document.querySelectorAll(".cart-items .cart-item").forEach((item) => {
      let removeBtn = item.querySelector(".remove-item");
      removeBtn.addEventListener("click", (e) => {
        removeItem(item);
      });
    });
  }

  if (lovedItems.length === 0) {
    if (document.querySelector(".cart-items")) {
      document.querySelector(".cart-items").remove();
    }
  }

  document.querySelector("#closeCart")?.addEventListener("click", (e) => {
    window.history.go(-1);
  });
}

function creatPageItems(cartItemsContainer) {
  let container = document.querySelector(".container");

  let cardHeader = document.createElement("div");
  cardHeader.className = "cart-header";

  cardHeader.innerHTML = `
  
          <div class="cart-title">
            <i class="fa-solid fa-shopping-bag"></i>
            <h2>Loved Items</h2>
            <span class="cart-count">${numberOfProducts}</span>
          </div>
          <button class="close-cart" id="closeCart">
            <i class="fa-solid fa-xmark"></i>
          </button>
        
  `;

  container.prepend(cardHeader);

  let itemsContainer = document.createElement("div");
  itemsContainer.className = "cart-items";

  lovedItems.forEach((item) => {
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
            </div>
    `;

    itemsContainer.appendChild(row);
  });

  container.appendChild(itemsContainer);

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

function removeItem(item) {
  lovedItems.forEach((lovedItem, index) => {
    if (
      lovedItem.id == item.dataset.id &&
      lovedItem.color == item.querySelector(".color-dot").style.backgroundColor
    ) {
      lovedItems.splice(index, 1);
      localStorage.setItem("lovedItems", JSON.stringify(lovedItems));

      numberOfProducts--;
      document.querySelector(".cart-count").innerHTML = numberOfProducts;
    }
  });
  item.remove();

  if (lovedItems.length === 0) {
    if (document.querySelector(".cart-items")) {
      document.querySelector(".cart-items").remove();
    }
    let cartEmpty = document.querySelector(".cart-empty");
    cartEmpty.style.display = "block";
  }
}
