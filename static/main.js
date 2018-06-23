$(document).ready(function() {
  $("#urlForm").validate({
    rules: {
      url: {
        required: true,
        url: true
      }
    },
    errorElement: "span",
    messages: {
      url: "Please enter a valid URL (eg: https://www.example.com)"
    },
    submitHandler: function(e) {
      var t = $("#urlForm").serialize();
      $.ajax({
        type: "get",
        async: true,
        url: "/api/fetch-as-ajax/",
        data: t,
        datatype: "json",
        cache: !0,
        global: !1,
        beforeSend: function() {
          $("#submitButtonLabel").html("Fetching...");
        },
        success: function(data) {
          $(".resultWrapper").show();
          $("#result").html(JSON.stringify(data, null, 2));
          $("#submitButtonLabel").html("Fetch Website Details");
          $("#urlForm")[0].reset();
        },
        error: function(jqXHR, exception) {
          var msg = jqXHR.responseJSON.error.message;
          $(".errorWrapper")
            .show()
            .html(msg);
        },
        complete: function() {}
      });
    }
  });
});
