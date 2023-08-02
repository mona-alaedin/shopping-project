// ? dropDown

const dropLink = document.querySelector("#nav-drop");
const dropDown = document.querySelector(".drop-down");

function toggleDropdown() {
  dropDown.classList.toggle("show");
}

dropLink.addEventListener("click", (e) => {
  e.stopPropagation();
  toggleDropdown();
});
document.documentElement.addEventListener("click", function () {
  if (dropDown.classList.contains("show")) {
    toggleDropdown();
  }
});

//? swiper

const swiper = new Swiper(".swiper", {
  // Optional parameters
  direction: "horizontal",
  loop: true,

  // If we need pagination
  pagination: {
    el: ".swiper-pagination",
  },

  // Navigation arrows
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
});

// ? show modal

// selects
const cartBtn = document.querySelector(".cart-btn");
const backDrop = document.querySelector(".cart-backdrop");
const cartModal = document.querySelector(".cart");
const closeModal = document.querySelector(".cart-item-confirm");

// events
cartBtn.addEventListener("click", showModalFunction);
backDrop.addEventListener("click", closeModalFunction);
closeModal.addEventListener("click", closeModalFunction);

// functions
function showModalFunction() {
  backDrop.style.display = "block";
  cartModal.style.top = "50%";
  cartModal.style.opacity = "1";
}
function closeModalFunction() {
  backDrop.style.display = "none";
  cartModal.style.top = "-100";
  cartModal.style.opacity = "0";
}

// * select

const productsDOM = document.querySelector(".product-center");
const cartTotal = document.querySelector(".cart-total");
const cartItems = document.querySelector(".cart-items");
const cartContent = document.querySelector(".cart-content");
const clearCartBtn = document.querySelector(".clear-cart");

// ? get products

import { productsData } from "./products.js";

let cart = [];
let buttonsDOM = [];

class Products {
  getProducts() {
    return productsData;
  }
}

// ? display products

class UI {
  displayProducts(products) {
    let result = "";

    products.forEach((p) => {
      result += `<div class="product">
          <div class="img-container">
            <img src=${p.imgUrl} class="product-img"/>
          </div>
          <div class="product-desc">
            <p class="product-title">نام محصول :${p.title}</p>
            <p class="product-title">قیمت :${new Intl.NumberFormat("en-US", {
              style: "decimal",
            }).format(p.price)}</p>
          </div>
          <button class="add-to-cart" data-id=${p.id}>خرید محصول</button>
        </div>`;
      productsDOM.innerHTML = result;
    });
  }

  getAddToCartBtns() {
    const addToCartBtns = [...document.querySelectorAll(".add-to-cart")];
    buttonsDOM = addToCartBtns;
    addToCartBtns.forEach((btn) => {
      const id = btn.dataset.id;
      cart = Storage.getCart();
      const isInCart = cart.find((c) => c.id === parseInt(id));
      if (isInCart) {
        btn.innerText = "موجود در سبد خرید";
        btn.disabled = true;
      }
      btn.addEventListener("click", (e) => {
        e.target.innerText = "موجود در سبد خرید";
        e.target.disabled = true;
        const id = e.target.dataset.id;
        const product = { ...Storage.getProduct(id), quantity: 1 };
        cart = [...cart, product];
        Storage.saveCart(cart);
        this.setCartValue(cart);
        this.addCartItem(product);
      });
    });
  }

  setCartValue(cart) {
    let tempCartItems = 0;
    const totalPrice = cart.reduce((acc, curr) => {
      tempCartItems += curr.quantity;
      return acc + curr.quantity * curr.price;
    }, 0);
    cartTotal.innerText = ` جمع کل :  ${new Intl.NumberFormat("en-US", {
      style: "decimal",
    }).format(totalPrice)} تومان`;
    cartItems.innerText = tempCartItems;
  }

  addCartItem(cartItem) {
    const div = document.createElement("div");
    div.classList.add("cart-item");
    div.innerHTML = `
            <i data-id=${
              cartItem.id
            } class="remove-cart-btn clear-product fas fa-trash-alt"></i>
          <div class="cart-item-conteoller">
            <i data-id=${
              cartItem.id
            } class="increment-count fas fa-chevron-up"></i>
            <span class="count">1</span>
            <i data-id=${
              cartItem.id
            } class="decrement-count fas fa-chevron-down"></i>
          </div>
          <div class="cart-item-desc">
            <h4>نام محصول : ${cartItem.title}</h4>
            <h5>قیمت : ${new Intl.NumberFormat("en-US", {
              style: "decimal",
            }).format(cartItem.price)}</h5>
          </div>
          <img class="cart-item-img" src=${cartItem.imgUrl} alt="">`;
    cartContent.appendChild(div);
  }

  setUpApp() {
    cart = Storage.getCart();
    cart.forEach((c) => this.addCartItem(c));
    this.setCartValue(cart);
  }

  cartLogic() {
    clearCartBtn.addEventListener("click", () => this.clearCart());

    cartContent.addEventListener("click", (e) => {
      const classlist = e.target.classList;
      if (classlist.contains("fa-chevron-up")) {
        const addQuantity = e.target;
        const addedItem = cart.find(
          (cItem) => cItem.id == addQuantity.dataset.id
        );
        addedItem.quantity++;
        this.setCartValue(cart);
        Storage.saveCart(cart);
        addQuantity.nextElementSibling.innerText = addedItem.quantity;
      } else if (classlist.contains("fa-trash-alt")) {
        const removeItem = e.target;
        const _findRemoveItem = cart.find((c) => c.id == removeItem.dataset.id);
        this.removeItem(_findRemoveItem.id);
        Storage.saveCart(cart);
        cartContent.removeChild(removeItem.parentElement);
      } else if (classlist.contains("fa-chevron-down")) {
        const subQuantity = e.target;
        const substractedItem = cart.find(
          (cItem) => cItem.id == subQuantity.dataset.id
        );
        if (substractedItem.quantity === 1) {
          this.removeItem(substractedItem.id);
          cartContent.removeChild(subQuantity.parentElement.parentElement);
          return;
        }
        substractedItem.quantity--;
        this.setCartValue(cart);
        Storage.saveCart(cart);
        subQuantity.previousElementSibling.innerText = substractedItem.quantity;
      }
    });
  }

  clearCart() {
    cart.forEach((cartItem) => this.removeItem(cartItem.id));
    while (cartContent.children.length) {
      cartContent.removeChild(cartContent.children[0]);
    }
    closeModalFunction();
  }

  removeItem(id) {
    cart = cart.filter((cart) => cart.id !== id);
    this.setCartValue(cart);
    Storage.saveCart(cart);
    this.getSingleBtn(id);
  }
  getSingleBtn(id) {
    const button = buttonsDOM.find(
      (btn) => parseInt(btn.dataset.id) === parseInt(id)
    );
    button.innerText = "خرید محصول";
    button.disabled = false;
  }
}

// ? storage

class Storage {
  static saveProducts(products) {
    localStorage.setItem("products", JSON.stringify(products));
  }
  static getProduct(id) {
    const _products = JSON.parse(localStorage.getItem("products"));
    return _products.find((p) => p.id === parseInt(id));
  }
  static saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
  }
  static getCart() {
    return JSON.parse(localStorage.getItem("cart"))
      ? JSON.parse(localStorage.getItem("cart"))
      : [];
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const products = new Products();
  const productsData = products.getProducts();
  const ui = new UI();
  ui.displayProducts(productsData);
  ui.getAddToCartBtns();
  ui.setUpApp();
  ui.cartLogic();
  Storage.saveProducts(productsData);
});
