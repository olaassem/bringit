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
		<button class="edit-fitgoal-button" value="${fitgoal.data._id}"><img class="edit-icon" src="https://i.pinimg.com/originals/2b/5d/21/2b5d21752e9b782f5b97e07b2317314f.png" alt="edit icon"/></button></button>
		<button class="delete-fitgoal-button" value="${fitgoal.data._id}"><img class="delete-icon" src="https://png.icons8.com/metro/1600/delete.png" alt="delete icon"/></button>
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
			$('.popup').fadeOut(350);
	        displayEditedFitGoal( fitgoal );
		})
		.fail(function( fitgoal ){
	    	console.log('Updating new fit goal failed!');
	    })
	})  
}
putFitGoalEdits();


//Cancel fitgoal update.
function cancelFitGoalUpdate(){
	$('.edit-fitgoal-form').on('click', '#cancel-fitgoal-button', event => {
		$('.popup').fadeOut(350);
	});
}
cancelFitGoalUpdate();


function displayEditedFitGoal( fitgoal ){
	let formatedDate = moment(fitgoal.data.createDate).format('dddd, MMMM Do YYYY');
	$('#fitgoal-title').val('');
	$('#fitgoal-description').val('');
    $('.current-fitgoal').html(`
    	<p class="current-fitgoal-date">${formatedDate}</p>
    	<h3 class="current-fitgoal-title">${fitgoal.data.title}</h3>
		<p class="current-fitgoal-description">${fitgoal.data.description}</p>
		<button class="completed-fitgoal-button" value="${fitgoal.data._id}">Completed!</button>
		<button class="edit-fitgoal-button" value="${fitgoal.data._id}"><img class="edit-icon" src="https://i.pinimg.com/originals/2b/5d/21/2b5d21752e9b782f5b97e07b2317314f.png" alt="edit icon"/></button>
		<button class="delete-fitgoal-button" value="${fitgoal.data._id}"><img class="delete-icon" src="https://png.icons8.com/metro/1600/delete.png" alt="delete icon"/></button>
    `)
}






/***   F I T   W E E K  ***/

//'.add-day-plan-btn'







/***   C A T E G O R I E S   ***/

//Get all categories
function getAllCategories(){
	$.get('/category/all', ( allCategories ) => {
		console.log(allCategories);
		displayAllCategories( allCategories );
	})
}
getAllCategories();


function renderCategories( category ){
	return `
		<div class="col-3">
			<div class="category-container">
				<button type="submit" class="select-category-btn" value="${category._id}"><img class="category-img" src="${category.img}" alt="${category.name} image" width="80px" height="80px"/>${category.name}</button>
				<button class="delete-category-btn" value="${category._id}"><img class="delete-icon" src="https://png.icons8.com/metro/1600/delete.png" alt="delete icon"/></button>
			</div>
		</div>
	`	
} 
//ADD CATEGORY EDIT BUTTON???
//	<button class="edit-category-btn"><img class="edit-icon" src="https://i.pinimg.com/originals/2b/5d/21/2b5d21752e9b782f5b97e07b2317314f.png" alt="edit icon"/></button>


function displayAllCategories( allCategories ){
	let categoriesOutput = allCategories.data.map( category => renderCategories( category )).join('');
	$('.category-icons').html(categoriesOutput);
}


function revealNewCategoryForm(){
	$('.popdown-post-category').on('click', event => {
		event.preventDefault();
		$('.new-category-form').removeClass('hidden');
	})
}
revealNewCategoryForm();	


//Post a new category
function postNewCategory(){
	$('.new-category-form').on('click', '.post-category-btn', event => {
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
	        getAllCategories( data );
	        $('.new-category-form').addClass('hidden');
	    })
	    .fail(function( error ){
	        console.log('Posting new category failed!')
	    })
	})
}
postNewCategory();


function cancelNewCategory(){
	$('.new-category-form').on('click','.cancel-category-btn', event =>{
		event.preventDefault();
		$('.new-category-form').addClass('hidden');
	});	
}
cancelNewCategory();


//Delete category.
function deleteCategory(){
	$('.category-icons').on('click', '.delete-category-btn', event => {
		event.preventDefault();
		let ID = $(event.currentTarget).attr("value");
		console.log(ID);
		$.ajax({
            url: `/category/${ID}`,
            type: 'DELETE'
        }).done(( category ) => {
        	console.log( category );
        	getAllCategories();
        }).fail(( error ) => {
        	console.log('Deleting category failed!');
        })
    });    
}
deleteCategory();


//Remove category delete button on category focus.
$('.category-icons').on('focus','.select-category-btn', function( event ){
   $(event.target).next('.delete-category-btn').addClass('hidden');
});

//Return category delete button on category focusout.
$('.category-icons').on('focusout','.select-category-btn', function(){
   $('.category-container').children('.delete-category-btn').removeClass('hidden');
});



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


function clearExerciseValue(){
	$('#exercise-name').val("");
	$('#exercise-sets').val(""); 
	$('#exercise-reps').val("");
	$('#exercise-weight').val("");
}


//Get all exercises.
function getAllExercises(){
	$.get('/exercise/all', ( allExercises ) => {
		console.log( allExercises );
		displayExercises( allExercises );
	});
}
getAllExercises();


function renderExercises( exercise ){
	return `
	  <tr class="exercise-rows">
	 	<td><input type="checkbox" id="select-exercise" name="select" value=""></td>
	    <td class="td-exercise-name" width="25%">${exercise.name}</td>
	    <td class="td-exercise-weight" width="25%">${exercise.weight}</td> 
	    <td class="td-exercise-sets" width="25%">${exercise.sets}</td>
	    <td class="td-exercise-reps" width="25%">${exercise.reps}</td>
	    <td><button type="submit" class="edit-exercise-btn" value="${exercise._id}"><img class="edit-icon" src="https://i.pinimg.com/originals/2b/5d/21/2b5d21752e9b782f5b97e07b2317314f.png"/></button></td>
	    <td><button type="submit" class="delete-exercise-btn" value="${exercise._id}"><img class="delete-icon" src="https://png.icons8.com/metro/1600/delete.png"/></button></td>
	  </tr>
	`	
} 


function displayExercises( allExercises ){
	let exercisesOutput = allExercises.data.map( exercise => renderExercises( exercise )).join('');
	$('.exercise-list').html(exercisesOutput);
}


function showNewExerciseForm(){
	$('.popdown-post-exercise').on('click', event => {
		event.preventDefault();
		$('.new-exercise-form').removeClass('hidden');
	})
}
showNewExerciseForm();


//Post new exercise.
function postNewExercise(){
	$('.post-exercise-form').on('click', '.post-exercise-btn', event => {
		event.preventDefault();
		let body = {
			//activityID:{type: mongoose.Schema.Types.ObjectId, ref: 'activity'},	
			'name': $('#exercise-name').val(),  //string
			'sets': $('#exercise-sets').val(),  //string
			'reps': $('#exercise-reps').val(),  //string
			'weight': $('#exercise-weight').val()  //string
		}
		$.ajax({
		    type: "POST",
		    contentType: 'application/json',
		    url: '/exercise/new',
		    data: JSON.stringify(body)
	  	})
		.done(function( newExercise ){
			console.log( newExercise );
			clearExerciseValue();
			$('.new-exercise-form').addClass('hidden');
			getAllExercises();
		})
		.fail(function( error ){
	    	console.log('Post new weights routine failed!');
	    })
	})
}
postNewExercise();

//Cancel adding new exercise.
function cancelNewExercise(){
	$('.new-exercise-form').on('click','.cancel-exercise-btn', event =>{
		event.preventDefault();
		clearExerciseValue();
		$('.new-exercise-form').addClass('hidden');
	});	
}
cancelNewExercise();


//Delete exercise table.
function deleteExerciseTable(){
	$('.exercise-list').on('click', '.delete-exercise-btn', event => {
		event.preventDefault();
		let ID = $(event.currentTarget).attr("value");
		console.log(ID);
		$.ajax({
            url: `/exercise/${ID}`,
            type: 'DELETE'
        }).done(( exerciseRoutine ) => {
        	console.log( exerciseRoutine );
        	getAllExercises();
        }).fail(( error ) => {
        	console.log('Deleting exercise routine table failed!');
        })
    });    
}
deleteExerciseTable();


//Get exercise details when edit button is clicked.
function showEditExerciseForm() {
	$('exercise-list').on('click', '.edit-exercise-btn', event => {
		event.preventDefault();
		$('.popdown-edit-exercise').removeClass('hidden');
		let ID = $(event.currentTarget).attr("value");
		$.ajax({
            url: `/exercise/${ID}`,
            type: 'GET'
        }).done(function( exercise ){
			console.log( exercise );
			$('.edit-exercise-form').html(`
				<fieldset>
					<legend>Update Exercise Routine</legend>
					<label for="exercise-name-edit">Name:</label>
					<input id="exercise-name-edit" type="text" value="${exercise.data.name}"/>	
					</br>
					<label for="exercise-weight-edit">Weight:</label>
					<input id="exercise-weight-edit" type="text" value="${exercise.data.weight}"/>
					</br>		
					<label for="exercise-sets-edit">Sets:</label>
					<input id="exercise-sets-edit" type="text" value="${exercise.data.sets}"/>	
					</br>
					<label for="exercise-reps-edit">Reps:</label>
					<input id="exercise-reps-edit" type="text" value="${exercise.data.reps}"/>
					</br>
					<button type="submit" class="post-exercise-btn" value="${exercise.data._id}">Update</button>
					<button type="submit" class="cancel-exercise-btn">Cancel</button>
				</fieldset>	
			`);
		}).fail(function( error ){
	    	console.log('Updating exercise failed!');
	    });    
	});	
}
showEditExerciseForm();



//Put exercise edits.
function putExerciseEdits() {
	$('.edit-exercise-form').on('click', '#update-exercise-button', event => {
		event.preventDefault();
		let ID = $(event.currentTarget).attr("value");
		let body = {
			'_id' : `${ID}`,
			//'activityID':{type: mongoose.Schema.Types.ObjectId, ref: 'activity'},	
			'name': $('#exercise-name-edit').val(),  
			'sets': $('#exercise-sets-edit').val(),  
			'reps': $('#exercise-reps-edit').val(),  
			'weight': $('#exercise-weight-edit').val() 
			}
		$.ajax({
		    type: "PUT",
		    contentType: 'application/json',
		    url: `exercise/${ID}`,
		   	data: JSON.stringify(body)
	  	})
	  	.done(function( exercise ){
			console.log( exercise );
			$('.popup').fadeOut(350);
	        getAllExercises();
		})
		.fail(function( exercise ){
	    	console.log('Updating weights routine failed!');
	    })
	})  
}
putExerciseEdits();



//Cancel exercise update.
function cancelExerciseEdit(){
	$('.edit-exercise-form').on('click', '#cancel-exercise-button', event => {
		$('.popup').fadeOut(350);
	});
}
cancelExerciseEdit();







/***   M O D A L   F U N C T I O N A L I T Y   ***/

function openModal(){
	$('[data-popup-open]').on('click', function( event )  {
		event.preventDefault();
		let targeted_popup_class = $( this ).attr('data-popup-open');
		$('[data-popup="' + targeted_popup_class + '"]').fadeIn(350);
		//clearWeightsRoutineValue();
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
		$('.popup').fadeOut(350).removeClass("active");
	});
	$('.popup-inner').click(function( event ){
		event.stopPropagation();
	});
}
closeModalOnClickOutsideModal();
