(function () {
  document.addEventListener("DOMContentLoaded", () => {
    const dropdowns = Array.from(document.querySelectorAll(".nav-dropdown"));
    if (!dropdowns.length) return;

    const submenuLinks = document.querySelectorAll(".nav-submenu a");

    function closeAll(except) {
      dropdowns.forEach(dropdown => {
        if (dropdown !== except) dropdown.removeAttribute("open");
      });
    }

    dropdowns.forEach(dropdown => {
      dropdown.addEventListener("toggle", () => {
        if (dropdown.open) {
          closeAll(dropdown);
        }
      });
    });

    document.addEventListener("click", event => {
      if (!event.target.closest(".nav-dropdown")) {
        closeAll();
      }
    });

    submenuLinks.forEach(link => {
      link.addEventListener("click", () => {
        closeAll();
      });
    });
  });
})();
