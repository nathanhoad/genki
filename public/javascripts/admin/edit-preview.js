$(document).ready(function() {
  var form = $('form.formtastic');

  if (form.length > 0 && form.attr('id').match(/^(new_post|edit_post|new_page|edit_page)/)) {
    var dest = window.location.href;
    if (!dest.match(/\/new$/)) {
      dest = dest.replace(/\/\d+$/, '');
      dest = dest + '/new';
    }
    dest = dest + '/preview'

    var toggle_preview = function() {
      if ($('#preview').length == 0) {
        form.hide();
        form.after('<div id="preview"><h3>Your entry will be formatted like this:</h3><p>Use Ctrl+E to return to edit mode.</p><div class="content"><p>Please wait...</p></div></div>');

        jQuery.ajax({
          type: 'POST',
          data: form.serialize().replace(/&*_method=\w+&*/, ''),
          url: dest,
          error: function() {
            $('#preview .content').html('<p>Failed to generate preview. Toggle back to edit mode and check that all required fields are filled in and valid.</p>');
          },
          success: function(r) {
            $('#preview .content').html(r);
            if (window.prettyPrint) {
              prettyPrint();
            }
          }
        });
      }
      else {
        $('#preview').remove();
        form.show();
      }
    }

    $(document).keyup(function(e) {
      if (e.metaKey && (e.which == 69)) { // Works in recent Safari and FF, unsure about IE
        toggle_preview();
        e.preventDefault();
      }
    });
  }
});
