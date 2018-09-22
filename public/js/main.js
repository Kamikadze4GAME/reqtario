$(function() {
  $('.file').each(function() {
    var $input = $(this),
      $label = $input.next('label'),
      labelVal = $label.html();


    $($label).find('.del').on('click', function(e) {
      e.preventDefault();
      $($input).val('');
      $input.trigger('change');
    });

    $input.on('change', function(e) {
      var fileName = '';

      if (this.files && this.files.length > 1)
        fileName = (this.getAttribute('data-multiple-caption') || '').replace('{count}', this.files.length);
      else if (e.target.value)
        fileName = e.target.value.split('\\').pop();

      if(fileName) {
        $($input).addClass('select').removeClass('no-select');
        $label.find('.file-name').html(fileName);
      }
      else {
        $($input).addClass('no-select').removeClass('select');
        $label.find('.file-name').html('');
      }
    });

    // Firefox bug fix
    $input
      .on('focus', function() {
        $input.addClass('has-focus');
      })
      .on('blur', function() {
        $input.removeClass('has-focus');
      });
  });



  $('.inputfile').each(function() {
    var $input = $(this),
      $label = $input.next('label'),
      labelVal = $label.html();

    $input.on('change', function(e) {

      var fileName = '';

      if (this.files && this.files.length > 1)
        fileName = (this.getAttribute('data-multiple-caption') || '').replace('{count}', this.files.length);
      else if (e.target.value)
        fileName = e.target.value.split('\\').pop();

      if (fileName)
        $label.find('span').html(fileName);
      else
        $label.html(labelVal);
    });

    // Firefox bug fix
    $input
      .on('focus', function() {
        $input.addClass('has-focus');
      })
      .on('blur', function() {
        $input.removeClass('has-focus');
      });
  });
});
