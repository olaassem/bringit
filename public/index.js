//motifit quote
//fitgoals
//fitweek
//categories
//exercises




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

//Get all fit goals
function getAllGoals(){
	$.get('/goal/all', (allGoals) => {
		console.log(allGoals);
		displayAllGoals(allGoals);
	})
}
getAllGoals();



function displayAllGoals( allGoals ){
	allGoals.data.forEach( (goal) => {
		$('.goalhistory-list').append(`
			<li>${goal.title}: ${goal.description}</li>	
		`)
	})
}



//Open post fit goal form modal 
function openFitGoalModal(){
	$('.open-fitgoal-modal').click( event => {
		event.preventDefault();
		$('.fitgoal-modal-form').removeClass('hidden');
	});	
}
openFitGoalModal();



//Post a new fit goal
function postNewFitGoal(){
	$('.post-fitgoal-form').on('submit', event => {
		event.preventDefault();
		$('.fitgoal-modal-form').addClass('hidden');
		let params = {
			title: $('#fitgoal-title').val(),
			createDate:  Date.now(),
			description: $('#fitgoal-description').val(),
			completed: false  
		}
		$.ajax({
		    type: "POST",
		    contentType: 'application/json',
		    url: '/goal/new',
		    data: JSON.stringify(params)
	  	})
		.done(function( fitgoal ){
			console.log( fitgoal );
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
		<button class="completed-fitgoal-button" value="${fitgoal.data.completed}">Completed!</button>
		<button class="edit-fitgoal-button" value="${fitgoal.data._id}">Edit</button>
		<button class="delete-fitgoal-button" value="${fitgoal.data._id}">Delete</button>
    `)
}
postNewFitGoal();



let ID;
//Delete selected fit goal.
function deleteFitGoal(){
	$('.current-fitgoal').on('click', '.delete-fitgoal-button', event => {
		event.preventDefault();
		let ID = $(event.currentTarget).attr("value");
		debugger
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








//Get fitgoal details when edit button is selected
function editFitGoalModalLoad() {

}
editFitGoalModalLoad();



//Displays trip details in create trip page form inputs so that user can edit
function displayFitGoalToEdit(trip) {

}


//Put request to update edited fitgoal details
function submitFitGoalChanges() {

}
submitFitGoalChanges();


/*
//Open Edit FitGoal Form Modal.
function editFitGoalForm( fitgoal ){
	$('.current-fitgoal').on('click', '.edit-fitgoal-button', event => {
		event.preventDefault();
		$('.edit-fitgoal-modal-form').removeClass('hidden');
		$('.edit-fitgoal-form').html(`
			<legend>Update Current Fit Goal</legend>
				<label for="fitgoal-title">Fit Goal</label>
				<input id="fitgoal-title" type="text" value="${fitgoal.data.title}" />
				<label for="fitgoal-description">Description</label>
				<textarea id="fitgoal-description" type="text" value="${fitgoal.data.description}" cols="70" rows="5"></textarea>
				<button type="submit" id="update-fitgoal-button">Update</button>
				<button type="submit" id="cancel-fitgoal-button">Cancel</button>
		`);


	//$('.edit-fitgoal-modal-form').removeClass('hidden');
	})
}
editFitGoalForm();



let ID;

//Update fitgoal.
function updateFitGoal(){
	$('.current-fitgoal').on('click', '.edit-fitgoal-button', event => {
		event.preventDefault();
		let ID = $(event.currentTarget).attr("value");
		
		let params = {
			title: $('#fitgoal-title').val(),
			createDate:  Date.now(),
			description: $('#fitgoal-description').val(),
			completed: false  
		}
		
		$.ajax({
		    type: "PUT",
		    contentType: 'application/json',
		    url: `/goal/${ID}`,
		   // data: JSON.stringify(params)
	  	})
	  	.done(function( fitgoal ){
			console.log( fitgoal );
	        $('.edit-fitgoal-modal-form').removeClass('hidden');
			$('.edit-fitgoal-form').html(`
				<fieldset>
					<legend>Update Current Fit Goal</legend>
					<label for="fitgoal-title">Fit Goal</label>
					<input id="fitgoal-title" type="text" value="${fitgoal.data.title}" />
					<label for="fitgoal-description">Description</label>
					<textarea id="fitgoal-description" type="text" value="${fitgoal.data.description}" cols="70" rows="5"></textarea>
					<button type="submit" id="update-fitgoal-button">Update</button>
					<button type="submit" id="cancel-fitgoal-button">Cancel</button>
				</fieldset>	
			`);
		})
		.fail(function( fitgoal ){
	    	console.log('Updating new fit goal failed!');
	    })
	})  	
}
updateFitGoal();
*/










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
	let params = {
		name: $('#category-name').val(),
		img: $('#category-img').val()  
	}
	$.ajax({
	    type: "POST",
	    contentType: 'application/json',
	    url: '/category/new',
	    data: JSON.stringify(params),
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
		let params = {
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
		    data: JSON.stringify(params)
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
*/






//Update selected activity.
function updateActivity(){

}



/***   E X E R C I S E S   ***/

//Get exercises.


//Post exercises.


//Edit exercises.


//Delete exercises.
