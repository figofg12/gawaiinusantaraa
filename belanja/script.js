document.addEventListener("DOMContentLoaded", function () {
  // ============ Toggle Navbar =============
  const navbarNav = document.querySelector('.navbar-nav');
  const menu = document.querySelector('#menu');

  menu.onclick = () => {
    navbarNav.classList.toggle('active');
  };

  document.addEventListener('click', function (e) {
    if (!menu.contains(e.target) && !navbarNav.contains(e.target)) {
      navbarNav.classList.remove('active');
    }
  });

  // ============ Search Toggle =============
  const searchForm = document.querySelector('.search-form');
  const searchBox = document.querySelector('#search-box');
  const searchButton = document.querySelector('#search-button');

  searchButton.onclick = (e) => {
    e.preventDefault();
    searchForm.classList.toggle('active');
    searchBox.focus();
  };

  document.addEventListener('click', function (e) {
    if (!searchButton.contains(e.target) && !searchForm.contains(e.target)) {
      searchForm.classList.remove('active');
    }
  });

  // ============ Shopping Cart Toggle ============
  const shoppingCart = document.querySelector('.shopping-cart');
  const cartButton = document.querySelector('#shopping-cart-button');

  if (cartButton) {
    cartButton.addEventListener('click', (e) => {
      e.preventDefault();
      shoppingCart.classList.toggle('active');
    });

    document.addEventListener('click', (e) => {
      if (!shoppingCart.contains(e.target) && !cartButton.contains(e.target)) {
        shoppingCart.classList.remove('active');
      }
    });
  }

  // ============ Menu Redirect ============
  const menuCard = document.querySelector(".menu-card-img");
  if (menuCard) {
    menuCard.addEventListener("click", function () {
      window.location.href = "smartphone.html";
    });
  }

  const cards = document.querySelectorAll(".menu-card-img1");
  cards.forEach(card => {
    card.addEventListener("click", function () {
      const targetURL = card.getAttribute("data-url");
      if (targetURL) {
        window.location.href = targetURL;
      }
    });
  });

  // ============ Modal Detail Produk ============
  const itemDetailModal = document.querySelector("#item-detail-modal");
  const closeModal = document.querySelector(".close-icon");
  const itemDetailButtons = document.querySelectorAll(".item-detail-button");

  itemDetailButtons.forEach((button) => {
    button.addEventListener("click", function (event) {
      event.preventDefault();
      itemDetailModal.style.display = "flex";
    });
  });

  if (closeModal) {
    closeModal.addEventListener("click", function (event) {
      event.preventDefault();
      itemDetailModal.style.display = "none";
    });
  }

  window.addEventListener("click", function (event) {
    if (event.target === itemDetailModal) {
      itemDetailModal.style.display = "none";
    }
  });

  // ============ Shopping Cart Logic ============
  const cart = [];
  const cartContainer = document.querySelector(".shopping-cart");
  const totalPriceElement = document.createElement("div");
  totalPriceElement.classList.add("total-price");
  cartContainer.appendChild(totalPriceElement);

  document.querySelectorAll(".shop").forEach((button) => {
    button.addEventListener("click", function (event) {
      event.preventDefault();
      const productContainer = this.closest(".menu-card-img1");
      const name = productContainer.querySelector(".menu-card-title").textContent;
      const price = parseFloat(productContainer.querySelector(".menu-card-more").textContent.replace("Rp. ", "").replace(/\./g, ""));
      const image = productContainer.querySelector("img").getAttribute("src");

      addToCart(name, price, image);
    });
  });

  function addToCart(name, price, image) {
    const existingItem = cart.find(item => item.name === name);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ name, price, image, quantity: 1 });
    }
    updateCart();
  }

  function updateCart() {
    cartContainer.innerHTML = "";
    let totalPrice = 0;

    cart.forEach(item => {
      totalPrice += item.price * item.quantity;
      const cartItem = document.createElement("div");
      cartItem.classList.add("cart-item");
      cartItem.innerHTML = `
        <img src="${item.image}" alt="${item.name}">
        <div class="item-detail">
            <h3>${item.name}</h3>
            <p>Rp. ${item.price.toLocaleString()}</p>
            <p>Quantity: ${item.quantity}</p>
            <button class="remove-item" data-name="${item.name}">Remove</button>
        </div>
      `;
      cartContainer.appendChild(cartItem);
    });

    totalPriceElement.innerHTML = `<h4>Total: Rp. ${totalPrice.toLocaleString()}</h4>`;
    cartContainer.appendChild(totalPriceElement);

    document.querySelectorAll(".remove-item").forEach(button => {
      button.addEventListener("click", function () {
        removeFromCart(this.getAttribute("data-name"));
      });
    });

    // Tambahkan tombol checkout jika belum ada
    if (!document.querySelector(".checkout-button") && cart.length > 0) {
      let checkoutButton = document.createElement("button");
      checkoutButton.textContent = "Checkout";
      checkoutButton.classList.add("checkout-button");
      cartContainer.appendChild(checkoutButton);

      checkoutButton.addEventListener("click", function () {
        const modal = document.getElementById("checkout-modal");
        const orderSummary = document.getElementById("order-summary");
        const totalPriceDisplay = document.getElementById("total-price");
      
        if (!modal || !orderSummary || !totalPriceDisplay) return;
      
        if (cart.length === 0) {
          alert("Keranjang belanja Anda kosong!");
          return;
        }
      
        orderSummary.innerHTML = "";
        let total = 0;
        cart.forEach((item) => {
          let li = document.createElement("li");
          li.style.display = "flex";
          li.style.alignItems = "center";
          li.style.marginBottom = "12px";
          li.style.gap = "12px";
      
          let img = document.createElement("img");
          img.src = item.image;
          img.alt = item.name;
          img.style.width = "60px";
          img.style.height = "60px";
          img.style.borderRadius = "8px";
          img.style.objectFit = "cover";
          img.style.boxShadow = "0 2px 6px rgba(0,0,0,0.1)";
      
          let detail = document.createElement("div");
          detail.innerHTML = `
            <div style="font-weight: bold;">${item.name}</div>
            <div>Rp. ${item.price.toLocaleString()} (x${item.quantity})</div>
          `;
      
          li.appendChild(img);
          li.appendChild(detail);
          orderSummary.appendChild(li);
      
          total += item.price * item.quantity;
        });
      
        totalPriceDisplay.textContent = `Rp. ${total.toLocaleString()}`;
        modal.style.display = "flex";
      });
      
    }
  }

  function removeFromCart(name) {
    const index = cart.findIndex(item => item.name === name);
    if (index !== -1) {
      if (cart[index].quantity > 1) {
        cart[index].quantity -= 1;
      } else {
        cart.splice(index, 1);
      }
    }
    updateCart();
  }

  // ============ Close Modal Checkout ============
  const modal = document.getElementById("checkout-modal");
  const closeModalBtn = document.querySelector(".close-modal");

  if (closeModalBtn && modal) {
    closeModalBtn.addEventListener("click", function () {
      modal.style.display = "none";
    });
  }

  // ============ Alamat Pengiriman Dinamis ============
  const metodePengambilan = document.getElementById("metode-pengambilan");
  const alamatField = document.getElementById("alamat-field");

  if (metodePengambilan && alamatField) {
    metodePengambilan.addEventListener("change", function () {
      if (this.value === "diantar") {
        alamatField.style.display = "block";
      } else {
        alamatField.style.display = "none";
      }
    });
  }
});

document.addEventListener("DOMContentLoaded", function () {
  const cards = document.querySelectorAll(".menu-card-img, .menu-card-img1");

  cards.forEach(card => {
    card.addEventListener("click", function () {
      const targetURL = card.getAttribute("data-url");
      if (targetURL) {
        window.location.href = targetURL;
      }
    });
  });
});

var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

// Mengatur font dan ukuran
ctx.font = "50px 'SF Pro Semibold'";  // Pastikan font SF Pro Semibold terpasang di sistem atau di path yang tepat
ctx.textBaseline = 'middle';
ctx.textAlign = 'center';

var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

// Menetapkan ukuran canvas agar lebih tajam
canvas.width = 1000;
canvas.height = 500;

// Membuat efek warna pelangi
var text = "It Just Works";
var gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
gradient.addColorStop(0, 'purple');
gradient.addColorStop(0.1, 'blue');
gradient.addColorStop(0.2, 'green');
gradient.addColorStop(0.3, 'yellow');
gradient.addColorStop(0.4, 'orange');
gradient.addColorStop(0.5, 'red');
gradient.addColorStop(0.6, 'pink');
gradient.addColorStop(0.7, 'violet');
gradient.addColorStop(1, 'indigo');

// Menggunakan gradient sebagai warna teks
ctx.fillStyle = gradient;

// Mengatur font dan ukuran
ctx.font = "50px 'SF Pro Semibold'";
ctx.textBaseline = 'middle';
ctx.textAlign = 'center';

// Menulis teks di canvas
ctx.fillText(text, canvas.width / 2, canvas.height / 2);


let lastScrollTop = 0; // Variabel untuk menyimpan posisi scroll sebelumnya

window.addEventListener("scroll", function() {
    let navbar = document.querySelector(".navbar");
    let currentScroll = window.pageYOffset || document.documentElement.scrollTop;

    // Jika scroll ke bawah, sembunyikan navbar
    if (currentScroll > lastScrollTop) {
        navbar.style.top = "-100px";  // Atur angka ini sesuai tinggi navbar kamu
    } else {
        navbar.style.top = "0";  // Tampilkan navbar saat scroll ke atas
    }

    lastScrollTop = currentScroll <= 0 ? 0 : currentScroll; // Menghindari nilai negatif
});






