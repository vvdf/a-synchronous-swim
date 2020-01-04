(function() {

  const serverUrl = 'http://127.0.0.1:3000';

  //
  // TODO: build the swim command fetcher here
  const getSwimCommand = () => {
    $.ajax({
      url: serverUrl + "/swim",
      type: 'GET',
      success: (data) => SwimTeam.move(data),
      error: (err, type, text) => console.log("ERROR: ", err, type, text)
    })
  }

  setInterval(getSwimCommand, 3000);

  const getBackground = () => {
    $.ajax({
      url: serverUrl + "/background",
      type: 'GET',
      success: (data) => {
        $('.pool').css('background-image', `url('${serverUrl}/background')`);
        $('.pool').css('background-size', 'cover');
      },
      error: (err, type, text) => console.log("ERROR: ", err, type, text)
    })
  }
  getBackground();

  /////////////////////////////////////////////////////////////////////
  // The ajax file uplaoder is provided for your convenience!
  // Note: remember to fix the URL below.
  /////////////////////////////////////////////////////////////////////

  const ajaxFileUpload = (file) => {
    var formData = new FormData();
    formData.append('file', file);
    $.ajax({
      type: 'POST',
      data: formData,
      url: serverUrl,
      cache: false,
      contentType: false,
      processData: false,
      success: () => {
        // reload the page
        window.location = window.location.href;
      }
    });
  };

  $('form').on('submit', function(e) {
    e.preventDefault();

    var form = $('form .file')[0];
    if (form.files.length === 0) {
      console.log('No file selected!');
      return;
    }

    var file = form.files[0];
    if (file.type !== 'image/jpeg') {
      console.log('Not a jpg file!');
      return;
    }

    ajaxFileUpload(file);
  });

})();
