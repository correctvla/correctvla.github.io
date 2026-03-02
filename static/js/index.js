window.HELP_IMPROVE_VIDEOJS = false;

$(document).ready(function() {
    // Navbar burger toggle
    $(".navbar-burger").click(function() {
      $(".navbar-burger").toggleClass("is-active");
      $(".navbar-menu").toggleClass("is-active");
    });

    // Tab switching for video demonstrations
    $('#demo-tabs li').click(function() {
      var tabId = $(this).data('tab');
      $('#demo-tabs li').removeClass('is-active');
      $(this).addClass('is-active');
      $('.tab-content').hide();
      $('#' + tabId).show();
    });
});
