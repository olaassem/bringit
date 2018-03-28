//motifit quote
//fitgoals
//fitweek
//categories
//exercises
//modal functionality




/***   M O T I F I T   Q U O T E    ***/

//add the db into app to persist
//can only have this functionality when u add user functionality
function getMotiFitQuote(){
	$('.motifit-button').on('click', event => {
		event.preventDefault();
		$('.random-quote').removeClass('hidden');
		$.get('/quote/all', (allQuotes) => {
			let num = Math.floor(Math.random() * allQuotes.data.length);
			console.log(num);
			let randomQuote = allQuotes.data[num].quote; 
			console.log(randomQuote);
			$('.random-quote').html(`"${randomQuote}"`);
		})
	})
}
getMotiFitQuote();





/***   F I T   G O A L S   ***/

//Get all completed fit goals (for history log).
function getAllCompletedGoals(){
	$('.fitgoal-history-button').on('click', event => {
		event.preventDefault();
		$('[data-popup="popup-fitgoal-history"]').fadeIn(350);
		$.get('/goal/all', ( allGoals ) => {
			console.log( allGoals );
			displayCompletedFitGoals( allGoals );
		})
	});
}
getAllCompletedGoals();



function renderCompletedFitGoals( fitgoal ){
	let formatedDate = moment(fitgoal.createDate).format('dddd, MMMM Do YYYY');
	if(fitgoal.completed === true){	
		return `
			<div class="completed-goal">
				<p>Completed on: ${formatedDate}</p>
				<h3>Title: ${fitgoal.title}</h3>
				<p>Description: ${fitgoal.description}</p>
			</div>	
		`
	}	
} 


function displayCompletedFitGoals( allGoals ){
	let completedFitGoalOutput = allGoals.data.map( fitgoal => renderCompletedFitGoals( fitgoal )).join('');
	$('.goalhistory-list').html(completedFitGoalOutput);
}




//Post a new fit goal
function postNewFitGoal(){
	$('.post-fitgoal-form').on('click', '#add-fitgoal-button', event => {
		event.preventDefault();
		let body = {
			title: $('#fitgoal-title').val(),
			createDate:  Date.now(),
			description: $('#fitgoal-description').val(),
			completed: false  
		}
		$.ajax({
		    type: "POST",
		    contentType: 'application/json',
		    url: '/goal/new',
		    data: JSON.stringify(body)
	  	})
		.done(function( fitgoal ){
			console.log( fitgoal );
			closeModal();
	        displayNewFitGoal( fitgoal );
		})
		.fail(function( fitgoal ){
	    	console.log('Post new fit goal failed!');
	    })
	})
}


function displayNewFitGoal( fitgoal ){
	console.log( fitgoal );
	let formatedDate = moment(fitgoal.data.createDate).format('dddd, MMMM Do YYYY');
	$('#fitgoal-title').val('');
	$('#fitgoal-description').val('');
    $('.current-fitgoal').removeClass('hidden');
    $('.current-fitgoal').html(`
    	<p class="current-fitgoal-date">${formatedDate}</p>
    	<h3 class="current-fitgoal-title">${fitgoal.data.title}</h3>
		<p class="current-fitgoal-description">${fitgoal.data.description}</p>
		<button class="completed-fitgoal-button" value="${fitgoal.data._id}">Completed!</button>
		<button class="edit-fitgoal-button" value="${fitgoal.data._id}">Edit</button>
		<button class="delete-fitgoal-button" value="${fitgoal.data._id}">Delete</button>
    `)
}
postNewFitGoal();


let ID;


//Completed fit goal.
function completedFitGoal(){
	$('.current-fitgoal').on('click', '.completed-fitgoal-button', event => {
		event.preventDefault();
		let ID =  $(event.currentTarget).attr( 'value' );
		console.log(ID);
		let body = {
			'_id' : `${ID}`,
			'completed': true,
			'createDate': Date.now()
		};	 
		$.ajax({
		    type: 'PUT',
		    url: `/goal/${ID}`,
		    contentType: 'application/json',
		    data: JSON.stringify( body )
	  	}).done((fitgoal) =>{
	  		$('.current-fitgoal').html("");
	  		getAllCompletedGoals();
	  	}).fail((error) => {
	  		console.log('Completeing fit goal failed!');
	  	})
	});  	
}
completedFitGoal();




//Delete selected fit goal.
function deleteFitGoal(){
	$('.current-fitgoal').on('click', '.delete-fitgoal-button', event => {
		event.preventDefault();
		let ID = $(event.currentTarget).attr("value");
		console.log(ID);
		$.ajax({
            url: `goal/${ID}`,
            type: 'DELETE'
        }).done(( fitgoal ) => {
        	console.log( fitgoal );
        	$('.current-fitgoal').addClass('hidden');
        }).fail(( error ) => {
        	console.log('Deleting fit goal failed!');
        })
    });    
}
deleteFitGoal();






//Get fitgoal details when edit button is clicked.
function openEditFitGoalModal() {
	$('body').on('click', '.edit-fitgoal-button', event => {
		event.preventDefault();
		$('[data-popup="popup-edit-fitgoal"]').fadeIn(350);
		let ID = $(event.currentTarget).attr("value");
		$.ajax({
            url: `goal/${ID}`,
            type: 'GET'
        }).done(function( fitgoal ){
			console.log( fitgoal );
			$('.edit-fitgoal-form').html(`
				<fieldset>
					<legend>Update Current Fit Goal</legend>
					<label for="fitgoal-title-edit">Fit Goal</label>
					</br>
					<input id="fitgoal-title-edit" type="text" value="${fitgoal.data.title}" />
					</br>
					<label for="fitgoal-description-edit">Description</label>
					</br>
					<input id="fitgoal-description-edit" type="text" value="${fitgoal.data.description}" />
					<button type="submit" id="update-fitgoal-button" data-popup-close="popup-edit-fitgoal" value="${fitgoal.data._id}">Update</button>
					<button type="submit" id="cancel-fitgoal-button" data-popup-close="popup-edit-fitgoal">Cancel</button>
				</fieldset>	
			`);
		}).fail(function( fitgoal ){
	    	console.log('Updating new fit goal failed!');
	    });    
	});	
}
openEditFitGoalModal();




//Put fitgoal edits.
function putFitGoalEdits() {
	$('.edit-fitgoal-form').on('click', '#update-fitgoal-button', event => {
		event.preventDefault();
		let ID = $(event.currentTarget).attr("value");
		let body = {
				'_id' : `${ID}`,
				'title': $('#fitgoal-title-edit').val(),
				'createDate':  Date.now(),
				'description': $('#fitgoal-description-edit').val(),
				'completed': false  
			}
		$.ajax({
		    type: "PUT",
		    contentType: 'application/json',
		    url: `/goal/${ID}`,
		   	data: JSON.stringify(body)
	  	})
	  	.done(function( fitgoal ){
			console.log( fitgoal );
			closeModal();
	        displayEditedFitGoal( fitgoal );
		})
		.fail(function( fitgoal ){
	    	console.log('Updating new fit goal failed!');
	    })
	})  
}
putFitGoalEdits();



function displayEditedFitGoal( fitgoal ){

	let formatedDate = moment(fitgoal.data.createDate).format('dddd, MMMM Do YYYY');
	
	$('#fitgoal-title').val('');
	$('#fitgoal-description').val('');
    $('.current-fitgoal').html(`
    	<p class="current-fitgoal-date">${formatedDate}</p>
    	<h3 class="current-fitgoal-title">${fitgoal.data.title}</h3>
		<p class="current-fitgoal-description">${fitgoal.data.description}</p>
		<button class="completed-fitgoal-button" value="${fitgoal.data._id}">Completed!</button>
		<button class="edit-fitgoal-button" value="${fitgoal.data._id}">Edit</button>
		<button class="delete-fitgoal-button" value="${fitgoal.data._id}">Delete</button>
    `)
}
















/***   C A T E G O R I E S   ***/
/*
//Get all categories
function getAllCategories(){
	$.get('/category/all', ( allCategories ) => {
		console.log(allCategories);
		displayAllCategories( allCategories );
	})
}

function displayAllCategories( allCategories ){
	allCategories.data.forEach( (category)=> {
		$('.category-icons').append(`
			<div class="icon">
				<p class="category-name">${category.name}</p>
				<img class="category-img" src=${category.img}/>
			</div>	
		`)
	})
}

getAllCategories();



//Post a new category
$('.post-category-form').submit('#addcategorybutton', event => {
	event.preventDefault();
	let body = {
		name: $('#category-name').val(),
		img: $('#category-img').val()  
	}
	$.ajax({
	    type: "POST",
	    contentType: 'application/json',
	    url: '/category/new',
	    data: JSON.stringify(body),
  	})
    .done(function( data ){
        console.log( data );
    })
    .fail(function( data ){
        console.log('Post new category failed!')
    })
})




/***   A C T I V I T Y   ***

function displayRoutineForm(){
	$('.post-activity-form').on('click', '.add-routine-icon', event => {
		event.preventDefault();
		$('.routine-form-section').removeClass('hidden');
	})
}
displayRoutineForm();



//Get all activities.
function getAllActivities(){
	$.get('/activity/all', ( allActivities ) => {
		console.log( allActivities );
	});
}
getAllActivities();
*/


/*
//Post new activity.
function postNewActivity(){
	$('.post-activity-form').on('submit', '#add-newactivity-button', event => {
		event.preventDefault();
		let body = {
			name: $('#activity-name').val(),
			time:  $('#activity-time').val(),
			duration: $('#activity-duration').val(),
			cardio: {
				distance: $('#cardio-distance').val(),
				duration: $('#cardio-duration').val(),
			},
			//routine: ,
			location: $('#activity-location').val(),
			inspiration: $('#activity-inspiration').val(),
			completed: false 
		}
		$.ajax({
		    type: "POST",
		    contentType: 'application/json',
		    url: '/activity/new',
		    data: JSON.stringify(body)
	  	})
		.done(function( data ){
			console.log( data );
	        displayNewActivity( data );
		})
		.fail(function( data ){
	    	console.log('Post new fit goal failed!');
	    })
	})
}




//Update selected activity.
function updateActivity(){

}



/***   E X E R C I S E S   ***/

//Get exercises.


//Post exercises.


//Edit exercises.


//Delete exercises.





/***   M O D A L   F U N C T I O N A L I T Y   ***/

function openModal(){
	$('[data-popup-open]').on('click', function( event )  {
		event.preventDefault();
		let targeted_popup_class = $( this ).attr('data-popup-open');
		$('[data-popup="' + targeted_popup_class + '"]').fadeIn(350);
	});
}
openModal();	



function closeModal(){
		$('[data-popup-close]').on('click', function( event )  {
		event.preventDefault();
		let targeted_popup_class = $( this ).attr('data-popup-close');
		$('[data-popup="' + targeted_popup_class + '"]').fadeOut(350);
	});
}
closeModal();



function closeModalOnClickOutsideModal(){
	//Close Modal on click outside of modal
	$(".popup").click(function(){
		$(".popup").fadeOut(350).removeClass("active");
	});
	$(".popup-inner").click(function( event ){
		event.stopPropagation();
	});
}
closeModalOnClickOutsideModal();
