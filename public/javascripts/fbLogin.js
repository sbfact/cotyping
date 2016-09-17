// This is called with the results from from FB.getLoginStatus().
  function statusChangeCallback(response) {
    console.log('statusChangeCallback');
    console.log(response);
    // The response object is returned with a status field that lets the app know the current login status of the person.
      //response 객체는 현재 로그인 상태를 가지고 있다.
    // Full docs on the response object can be found in the documentation for FB.getLoginStatus().
    // response object의 자세한 정보는 FB.getLoginStatus()의 도큐먼트에서 찾을수 있다.
    if (response.status === 'connected') {
      // Logged into your app and Facebook.
        //facebook을 통해 로그인 되었다.
      testAPI();
    } else if (response.status === 'not_authorized') {
      // The person is logged into Facebook, but not your app.
        // 페이스북에는 로그인 되었지만 앱에는 로그인 되어 있지 않다.
      document.getElementById('status').innerHTML = 'Please log ' +
        'into this app.';
    } else {
      // The person is not logged into Facebook, so we're not sure if they are logged into this app or not.
      // 페이스북에 로그인 되어있지 않기 때문에, 앱에 로그인에 되었는지 안되었는지 알 수 없다.
      document.getElementById('status').innerHTML = 'Please log ' +
        'into Facebook.';
    }
  }

  // This function is called when someone finishes with the Login
    //이 함수는 로그인 버튼이 끝났을때 불러진다.
  // Button.  See the onlogin handler attached to it in the sample
  // code below.
  function checkLoginState() {
    FB.getLoginStatus(function(response) {
      statusChangeCallback(response);
    });
  }

  window.fbAsyncInit = function() {
  FB.init({
    appId      : '1811399525805272',
    cookie     : true,  // enable cookies to allow the server to access the session
                        // 쿠키가 세션을 참조할수 있는지
    xfbml      : true,  // parse social plugins on this page
                        //  이 이페이지에서 소셜로그인 분석
    version    : 'v2.5' // use graph api version 2.5
  });

  // Now that we've initialized the JavaScript SDK, we call
  // FB.getLoginStatus().  This function gets the state of the
  // person visiting this page and can return one of three states to
  // the callback you provide.  They can be:
  //
  // 1. Logged into your app ('connected')
  // 2. Logged into Facebook, but not your app ('not_authorized')
  // 3. Not logged into Facebook and can't tell if they are logged into
  //    your app or not.
  //
  // These three cases are handled in the callback function.
       // 자바스크립트 SDK를 초기화 했으니, FB.getLoginStatus()를 호출한다.
  //.이 함수는 이 페이지의 사용자가 현재 로그인 되어있는 상태 3가지 중 하나를 콜백에 리턴한다.
  // 그 3가지 상태는 아래와 같다.
  // 1. 앱과 페이스북에 로그인 되어있다. ('connected')
  // 2. 페이스북에 로그인되어있으나, 앱에는 로그인이 되어있지 않다. ('not_authorized')
  // 3. 페이스북에 로그인이 되어있지 않아서 앱에 로그인이 되었는지 불확실하다.
  //
  // 위에서 구현한 콜백 함수는 이 3가지를 다루도록 되어있다.

  FB.getLoginStatus(function(response) {
    statusChangeCallback(response);
  });

  };

  // Load the SDK asynchronously
    // SDK를 비동기적으로 호출
  (function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s); js.id = id;
    js.src = "https://connect.facebook.net/en_US/all.js";
    fjs.parentNode.insertBefore(js, fjs);
  }(document, 'script', 'facebook-jssdk'));

  // Here we run a very simple test of the Graph API after login is
  // successful.  See statusChangeCallback() for when this call is made.
    // 로그인이 성공한 다음에는 간단한 그래프API를 호출한다.
  // 이 호출은 statusChangeCallback()에서 이루어진다.
  function testAPI() {
    console.log('Welcome!  Fetching your information.... ');
    FB.api('/me', function(response) {
      console.log("\n=====================================\n")
      console.log('Successful login for: ' + response.name);
      document.getElementById('status').innerHTML =
        'Thanks for logging in, ' + response.name + '!';
    });
  }

  //이 밑은 div의 facebookLogin함수의 정의 입니다. 이러한 방법으로 쉽게 사용이 가능합니다.
    function facebookLogin() {
        FB.login(function (response){
            if (response.status === 'connected') {
                var fbAccessToken = response.authResponse.accessToken;
                console.log(response.authResponse.accessToken);
                console.log("response1: ");
                console.log(response);
                //FB.api('/me',function(response) {
                var url = '/me?fields=name,email';
                FB.api(url,function(response) {
                //FB.api('/me',{fields: 'email'} ,function(response) {
                    var fbUserEmail = response.email;
                    var fbUserName  = response.name;
                    console.log("response2: ");
                    console.log(response);
                    console.log(JSON.stringify(response));
                    document.getElementById('status').innerHTML =
                        'Thanks for logging in, ' + response.name + '!';
                    var postUserInformation = {
                        fbUserEmail: fbUserEmail,
                        fbUserName: fbUserName,
                        fbAccessToken: fbAccessToken
                    };
                    console.log(postUserInformation);
                    $.post('/user/login/fb', postUserInformation, function(response){
                        console.log(response);
                        localStorage.setItem("token", response.token);
                    });
                });
            }
        },{scope: 'public_profile, email'});
    }
    function facebookLogout() {
        FB.logout(function (response){
           alert('logoutted');
           document.getElementById('status').innerHTML = 'Please log ' +
            'into this app.';
        });
    }
