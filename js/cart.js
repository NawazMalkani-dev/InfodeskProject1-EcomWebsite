const cartBody = document.getElementById("cart-body");
const totalPriceEl = document.getElementById("total-price");
const emptyMessage = document.getElementById("empty-message");
const clearCartBtn = document.getElementById("clear-cart");

let cart = JSON.parse(localStorage.getItem("cart")) || [];

function renderCart() {
  cartBody.innerHTML = "";

  if (cart.length === 0) {
    emptyMessage.style.display = "block";
    totalPriceEl.textContent = "Total: ₹0.00";
    clearCartBtn.disabled = true;
    return;
  } else {
    emptyMessage.style.display = "none";
    clearCartBtn.disabled = false;
  }

  let total = 0;

  cart.forEach((item, index) => {
    const subtotal = item.price * item.quantity;
    total += subtotal;

    const tr = document.createElement("tr");

    tr.innerHTML = `
          <td>${item.product}</td>
          <td>₹${item.price.toFixed(2)}</td>
          <td>
            <input type="number" min="1" value="${
              item.quantity
            }" aria-label="Quantity for ${
      item.product
    }" data-index="${index}" />
          </td>
          <td>₹${subtotal.toFixed(2)}</td>
          <td>
            <button aria-label="Remove ${
              item.product
            } from cart" data-index="${index}">X</button>
          </td>
        `;

    cartBody.appendChild(tr);
  });

  totalPriceEl.textContent = `Total: ₹${total.toFixed(2)}`;

  // Add event listeners for quantity inputs
  cartBody.querySelectorAll('input[type="number"]').forEach((input) => {
    input.addEventListener("change", (e) => {
      const idx = e.target.getAttribute("data-index");
      let val = parseInt(e.target.value);
      if (isNaN(val) || val < 1) {
        val = 1;
        e.target.value = val;
      }
      cart[idx].quantity = val;
      saveCart();
      renderCart();
    });
  });

  // Add event listeners for remove buttons
  cartBody.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", (e) => {
      const idx = button.getAttribute("data-index");
      cart.splice(idx, 1);
      saveCart();
      renderCart();
    });
  });
}

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

clearCartBtn.addEventListener("click", () => {
  if (confirm("Are you sure you want to clear your cart?")) {
    cart = [];
    saveCart();
    renderCart();
  }
});

// Initial render
renderCart();
