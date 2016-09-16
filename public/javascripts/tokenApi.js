function getEmail() {
    var token = localStorage.getItem("token");
    $.ajax({
        type: "GET",
        url: "/user/me",
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization","Bearer " + token);
        },
        success: function (res) {
            console.log(res);
            document.getElementById('getEmail').innerHTML = res.data.email;
        }
    });
}
function clenaEmail() {
    document.getElementById('getEmail').innerHTML = '';
}
function logout() {
    localStorage.removeItem("token");
}
