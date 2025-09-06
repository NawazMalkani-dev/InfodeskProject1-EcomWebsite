document.addEventListener("DOMContentLoaded", () => {
  // Smooth scrolling anchors
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });

  // Hero image fallback
  const heroImage = new Image();
  heroImage.src = "https://placehold.co/1920x1080";
  heroImage.onerror = function () {
    const hero = document.querySelector(".hero");
    if (hero) {
      hero.style.background =
        "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";
    }
  };

  // Cart add-to-cart buttons
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  document.querySelectorAll(".add-to-cart").forEach((button) => {
    button.addEventListener("click", () => {
      const productAttr = button.getAttribute("data-product");
      const priceAttr = button.getAttribute("data-price");
      if (!productAttr) {
        alert("Product data missing!");
        return;
      }
      const product = String(productAttr);
      const price = parseFloat(priceAttr);
      if (isNaN(price)) {
        alert("Price data missing or invalid!");
        return;
      }

      const existingItem = cart.find((item) => item.product === product);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cart.push({ product, price, quantity: 1 });
      }

      localStorage.setItem("cart", JSON.stringify(cart));
      alert(`${product} added to cart!`);
    });
  });
});

// Slider code (IIFE)
(function () {
  const slides = document.querySelectorAll(".slide");
  const dots = document.querySelectorAll(".dot");
  const prevBtn = document.querySelector(".prev");
  const nextBtn = document.querySelector(".next");
  const slidesContainer = document.querySelector(".slides");
  let currentIndex = 0;
  const totalSlides = slides.length;
  let autoSlideInterval;

  function updateSlider(index) {
    if (index < 0) index = totalSlides - 1;
    if (index >= totalSlides) index = 0;
    currentIndex = index;

    if (slidesContainer) {
      slidesContainer.style.transform = `translateX(-${index * 100}%)`;
    }

    slides.forEach((slide, i) => {
      slide.setAttribute("aria-hidden", i !== index);
    });
    dots.forEach((dot, i) => {
      dot.classList.toggle("active", i === index);
      dot.setAttribute("aria-selected", i === index);
    });
  }

  function nextSlide() {
    updateSlider(currentIndex + 1);
  }

  function prevSlide() {
    updateSlider(currentIndex - 1);
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      nextSlide();
      resetAutoSlide();
    });
  }
  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      prevSlide();
      resetAutoSlide();
    });
  }
  dots.forEach((dot, i) => {
    dot.addEventListener("click", () => {
      updateSlider(i);
      resetAutoSlide();
    });
  });

  function startAutoSlide() {
    autoSlideInterval = setInterval(nextSlide, 6000);
  }
  function resetAutoSlide() {
    clearInterval(autoSlideInterval);
    startAutoSlide();
  }

  updateSlider(0);
  startAutoSlide();
})();
