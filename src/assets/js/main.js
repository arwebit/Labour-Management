(function ($) {
  "use strict";
  // Sidebar Toggler
  $(document).on("click", ".sidebar-toggler", function (e) {
    e.preventDefault(); // to prevent jumping because of #
    $(".sidebar, .content").toggleClass("open");
  });

  $(document).on("click", function (e) {
    // Check if the click target is outside the sidebar and toggler
    if (
      !$(e.target).closest(".sidebar").length &&
      !$(e.target).closest(".sidebar-toggler").length
    ) {
      // If sidebar is open, then close it
      if ($(".sidebar").hasClass("open")) {
        $(".sidebar, .content").removeClass("open");
      }
    }
  });
})(jQuery);
