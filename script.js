document.addEventListener("DOMContentLoaded", function () {
  // Mobile Menu Toggle (Updated)
  const mobileMenuToggle = document.getElementById("mobile-menu-toggle");
  const mobileMenu = document.getElementById("mobile-menu");
  const menuIcon = mobileMenuToggle.querySelector("i"); // Select the icon inside the button

  if (mobileMenuToggle && mobileMenu && menuIcon) {
    mobileMenuToggle.addEventListener("click", function () {
      const isOpen = mobileMenu.classList.toggle("hidden");
      this.classList.toggle("active", !isOpen);
      this.setAttribute("aria-expanded", !isOpen);

      // Toggle between menu (bars) and close (times) icon
      menuIcon.classList.toggle("fa-bars", isOpen);
      menuIcon.classList.toggle("fa-times", !isOpen);
    });

    // Prevent menu from closing when clicking inside
    mobileMenu.addEventListener("click", (event) => {
      event.stopPropagation();
    });

    // Close menu when clicking outside
    document.addEventListener("click", function (event) {
      if (
        !mobileMenu.contains(event.target) &&
        !mobileMenuToggle.contains(event.target)
      ) {
        mobileMenu.classList.add("hidden");
        mobileMenuToggle.classList.remove("active");
        mobileMenuToggle.setAttribute("aria-expanded", "false");

        // Reset to menu icon (bars)
        menuIcon.classList.add("fa-bars");
        menuIcon.classList.remove("fa-times");
      }
    });
  }

  // Smooth Scrolling for Navigation Links
  document.querySelectorAll("a[href^='#']").forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        window.scrollTo({
          top: target.offsetTop - 70, // Offset for fixed header
          behavior: "smooth",
        });
      }
    });
  });

  // Shop Button Interaction
  document.querySelectorAll("a[href='#']").forEach((button) => {
    button.addEventListener("click", function (e) {
      e.preventDefault();
      alert("Shop functionality is not implemented yet.");
    });
  });

  // Image Slider Functionality
  document.querySelectorAll(".slider").forEach((slider) => {
    const prevBtn = slider.querySelector(".prev");
    const nextBtn = slider.querySelector(".next");
    const container = slider.querySelector(".slider-container");
    const scrollStep = 300;

    if (prevBtn && nextBtn && container) {
      nextBtn.addEventListener("click", function () {
        container.scrollBy({ left: scrollStep, behavior: "smooth" });
      });

      prevBtn.addEventListener("click", function () {
        container.scrollBy({ left: -scrollStep, behavior: "smooth" });
      });
    }
  });

  // Carousel Navigation for Bestsellers Section
  const productContainer = document.querySelector(".grid");
  const leftArrow = document.querySelector(".fa-angle-left");
  const rightArrow = document.querySelector(".fa-angle-right");

  if (leftArrow && rightArrow && productContainer) {
    rightArrow.addEventListener("click", () => {
      productContainer.scrollBy({ left: 320, behavior: "smooth" });
    });

    leftArrow.addEventListener("click", () => {
      productContainer.scrollBy({ left: -320, behavior: "smooth" });
    });
  }

  // Product Color Selection
  document.querySelectorAll(".fa-circle").forEach((color) => {
    color.addEventListener("click", function (event) {
      event.preventDefault();
      alert("Color selected: " + this.classList[1]); // Simulate color change
    });
  });

  // Hover Effect for Product Color Variations
  document.querySelectorAll(".color-option").forEach((color) => {
    color.addEventListener("mouseenter", function () {
      const newImage = this.dataset.image;
      const productImage =
        this.closest(".product-card").querySelector(".product-image");
      if (productImage) {
        productImage.src = newImage;
      }
    });
  });

  // Email Validation
  const emailInput = document.querySelector("#email");
  const signUpBtn = document.querySelector("button[type='submit']");

  if (emailInput && signUpBtn) {
    signUpBtn.addEventListener("click", function (event) {
      event.preventDefault();
      const emailValue = emailInput.value.trim();

      if (!validateEmail(emailValue)) {
        alert("Please enter a valid email address.");
      } else {
        alert("Thank you for signing up!");
      }
    });
  }

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
});
