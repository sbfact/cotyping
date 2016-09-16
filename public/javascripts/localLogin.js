function localLogin() {
    var localEmail = $("#localLoginForm .email").val();
    var localPassword = $("#localLoginForm .password").val();
    console.log(localEmail);
    console.log(localPassword);
    var postUserInformation = {
        email: localEmail,
        password: localPassword
    };
    $.post('/user/login/local', postUserInformation,
        function(response){
            console.log(response);
            if (response.type == true){
                localStorage.setItem("token", response.token);
            }
         });
    $("#localLoginForm .email").val("");
    $("#localLoginForm .password").val("");
}

function localSignup() {
    var localEmail = $("#localSignupForm .email").val();
    var localPassword = $("#localSignupForm .password").val();
    console.log(localEmail);
    console.log(localPassword);
    var postUserInformation = {
        email: localEmail,
        password: localPassword
    };
    $.post('/user/login/local/signup', postUserInformation,
        function(response){
            console.log(response);
            if (response.type == true){
                localStorage.setItem("token", response.token);
            }
         });
    $("#localSignupForm .email").val("");
    $("#localSignupForm .password").val("");
}
