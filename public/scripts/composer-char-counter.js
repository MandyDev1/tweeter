$(document).ready(function() {
  $('textarea').on('input', function() {
    let count = $(this).val().length;
    if (count <= 140) {
      $(this)
      .closest(".form")
      .find(".counter")
      .removeClass("negative-count")
      .text(140 - count);
    } else {
      $(this)
      .closest(".form")
      .find(".counter")
      .addClass("negative-count")
      .text(140 - count);
    }
  });
});