function registerNewUser() {
    $('.create-account-btn').on('click', event => {
        event.preventDefault();
        let userData = {
            'username': $('.js-register-form .inputUsername').val(),
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
                $('.input').val("");
                $('.register-alert').html("");
                $('.register-alert').html(`
                    <p class="landing-alert">New account created. Please login :-) </p>
                `);
            })
            .fail(function(error) {
                $('.input').val("");
                console.log(error);
                $('.register-alert').html("");
                $('.register-alert').html(`
                    <p class="landing-alert">${error.responseJSON.message}</p>
                `);
            })
    })
}
registerNewUser();


function loginExistingUser() {
    $('.login-btn').on('click', event => {
        event.preventDefault();
        let userData = {
            'username': $('.js-login-form .inputUsername').val(),
            'password': $('.js-login-form .inputPass').val(),
        }
        $.ajax({
                type: "POST",
                contentType: 'application/json',
                url: '/user/login',
                data: JSON.stringify(userData)
            })
            .done(function(user) {
                $('.input').val("");
                localStorage.setItem('token', user.data.token);
                localStorage.setItem('name', user.data.name);
                localStorage.setItem('userID', user.data.userID);
                debugger
                localStorage.setItem('randomQuote', user.data.currentQuote);
                window.location.href = 'home.html'; //directs to home pg
            })
            .fail(function(error) {
                $('.input').val("");
                $('.login-alert').html(`
                    <p class="landing-alert">${error.responseJSON.message}</p>
                `);
            })
    })
}
loginExistingUser();




















//   C L I C K   O N   T A B   F U N C T I O N A L I T Y   //
$('.login-form').hide();
$('.login-tab').css('background', 'none');



$('.login-tab').click(event => {
    event.preventDefault();
    $('.register-form').hide();
    $('.login-form').show();
    $('.signup-tab').css('background', 'none');
    $('.login-tab').css('background', 'white');
});


$('.signup-tab').click(event => {
    event.preventDefault();
    $('.register-form').show();
    $('.login-form').hide();
    $('.login-tab').css('background', 'none');
    $('.signup-tab').css('background', 'white');
});