const mobileMenuToggle = document.getElementById("mobile-menu-toggle");
const mobileMenu = document.getElementById("mobile-menu");

mobileMenuToggle.addEventListener("click", () => {
  mobileMenu.classList.toggle("hidden");
});


 // Mobile Hamburger Menu toggle
  const toggleMenu = () => {
    const menu = document.getElementById('menu');
    menu.classList.toggle('hidden');
  };

  // Add event listeners to hamburger menu toggle
  document.getElementById('hamburger').addEventListener('click', toggleMenu);