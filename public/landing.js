function registerNewUser(){
	$('.create-account-btn').on('click', event => {
		event.preventDefault();
		let userData = {
			'email': $('.inputEmail').val(),
			'password': $('.inputPass').val(),
			'name': $('.inputName').val()
		}
		$.ajax({
		    type: "POST",
		    contentType: 'application/json',
		    url: '/user/register',
		    data: JSON.stringify( userData )
	  	})
		.done(function( user ){
			console.log( user );
		})
		.fail(function( error ){
	    	console.log('Registering user failed!');
	    })
	})
}
registerNewUser();
















//////////
$('.login-form').hide();
$('.login').css('background', 'none');



$('.login').click(function() {
    $('.signup-form').hide();
    $('.login-form').show();
    $('.signup').css('background', 'none');
    $('.login').css('background', '#fff');
});


$('.signup').click(function() {
    $('.signup-form').show();
    $('.login-form').hide();
    $('.login').css('background', 'none');
    $('.signup').css('background', '#fff');
});


$('.btn').click(function() {
    $('.input').val("");
});