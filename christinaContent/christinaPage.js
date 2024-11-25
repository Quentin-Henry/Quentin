$(document).ready(function () {
  $(".mobileMenu").click(function () {
    $(this).toggleClass("active");
    $(".mobile-nav").toggleClass("active");
  });

  // Close menu when clicking outside
  $(document).click(function (event) {
    if (!$(event.target).closest(".mobileMenu, .mobile-nav").length) {
      $(".mobileMenu").removeClass("active");
      $(".mobile-nav").removeClass("active");
    }
  });
});
