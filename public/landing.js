function registerNewUser() {
    $('.create-account-btn').on('click', event => {
        event.preventDefault();
        let userData = {
            'email': $('.js-register-form .inputEmail').val(),
            'password': $('.js-register-form .inputPass').val(),
            'name': $('.js-register-form .inputName').val()
        }
        $.ajax({
                type: "POST",
                contentType: 'application/json',
                url: '/user/register',
                data: JSON.stringify(userData)
            })
            .done(function(user) {
                console.log(user);
                $('.input').val("");
            })
            .fail(function(error) {
                console.log(error);
                $('.input').val("");
            })
    })
}
registerNewUser();


function loginExistingUser() {
    $('.login-btn').on('click', event => {
        event.preventDefault();
        let userData = {
            'email': $('.js-login-form .inputEmail').val(),
            'password': $('.js-login-form .inputPass').val(),
        }
        $.ajax({
                type: "POST",
                contentType: 'application/json',
                url: '/user/login',
                data: JSON.stringify(userData)
            })
            .done(function(user) {
                console.log(user);
                $('.input').val("");
                localStorage.setItem('token', user.data.token);
                localStorage.setItem('name', user.data.name);
                localStorage.setItem('userID', user.data.userID);
            })
            .fail(function(error) {
                console.log(error);
                $('.input').val("");
            })
    })
}
loginExistingUser();




















//   C L I C K   O N   T A B   F U N C T I O N A L I T Y   //
$('.js-login-form').hide();
$('.login-tab').css('background', 'none');



$('.login-tab').click(event => {
    event.preventDefault();
    $('.js-register-form').hide();
    $('.js-login-form').show();
    $('.signup-tab').css('background', 'none');
    $('.login-tab').css('background', 'white');
});


$('.signup-tab').click(event => {
    event.preventDefault();
    $('.js-register-form').show();
    $('.js-login-form').hide();
    $('.login-tab').css('background', 'none');
    $('.signup-tab').css('background', 'white');
});