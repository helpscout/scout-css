(function($) {
  var $collapse = $('.js-collapse');
  var $search = $('.js-search');
  var $details = $('.js-details');

  $collapse.on('click', function(e) {
    e.preventDefault();
    var $this = $(this);
    var target = $this.attr('href');
    $(target).toggleClass('u-d-none');
  });

  $search.on('keyup', function() {
    var $this = $(this);
    var val = $this.val();
    if (!val || !val.length || val === '') {
      list.search();
    } else {
      list.search(val);
    }
    $details.addClass('u-d-none');
  });

  var list = new List('results-list', { 
    valueNames: [
      'name',
      'keywords',
    ],
  });

  window.resultsList = list;
})(jQuery);
