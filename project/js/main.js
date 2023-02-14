
function myFunction() {
  // use jQuery ($ is shorthand) to find the div on the page and then change the html
  // jQuery can do a lot of crazy stuff so make sure to google around to find out more

  $("#demo").html("NEWWW PARAGRAPH #javascript #fire");

  // 'img-circle' is a bootstrap thing! Check out more here: http://getbootstrap.com/css/
  $("#doge-image").append(`<img class="img-circle" src="images/wowdoge.jpeg" />`);
}

$(document).ready(function() {
  // getWeather();
  getPosts();
})

function getWeather(searchQuery) {
  var url = "https://api.openweathermap.org/data/2.5/weather?q="+searchQuery+"&units=metric&appid="+apiKey;

  $(".city").text("");
  $(".temp").text("");
  $(".error-message").text("");

  $.ajax(url,{success: function(data) {
    $(".city").text(data.name);
    $(".temp").text(data.main.temp + " °C");
  }, error: function(error) {
    $(".error-message").text("An error occurred");
  }})
}

function searchWeather() {
  var searchQuery = $(".search").val();
  getWeather(searchQuery);
}

function handleSignIn() {
  var provider = new firebase.auth.GoogleAuthProvider();

  firebase.auth().signInWithPopup(provider).then(function(result) {
    var token = result.credential.accessToken;
    var user = result.user;
    console.log(user.email);
  }).catch(function(error) {
    var errorCode = error.code;
    var errorMessage = error.message;
    var email = error.email;
    var credential = error.credential;
    console.log(errorMessage);
  });
}

function addMessage(postTitle, postBody) {
  var postData = {
    title: postTitle,
    body: postBody
  }
  console.log(postData);

  var database = firebase.database().ref("posts");

  var newPostRef = database.push();
  newPostRef.set(postData, function(error) {
    if (error) {
      $(".error").text("Must be logged in");
    } else {
      window.location.reload();
    }
  });
}

function handleMessageFormSubmit() {
  var postTitle = $("#post-title").val();
  var postBody = $("#post-body").val();
  addMessage(postTitle, postBody);
}

function getPosts() {
  return firebase.database().ref("posts").once('value').then(function(snapshot) {
    var posts = snapshot.val();

    for(var postKey in posts) {
      var post = posts[postKey];
      $("#post-listing").append("<div>" + post.title+" - " + post.body + "</div>");
    }
  });
}