(function($) {
  var $collapse = $('.js-collapse');
  $collapse.on('click', function(e) {
    e.preventDefault();
    var $this = $(this);
    var target = $this.attr('href');
    $(target).toggleClass('u-d-none');
  });

  window.resultsList = new List('results-list', { 
    valueNames: ['name', 'selector'],
  });
})(jQuery);
