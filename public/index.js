
/***   Random Quote   ***/


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

/*
$.get('/quote/all', (allQuotes) => {
	let num = Math.floor(Math.random() * allQuotes.data.length);
	console.log(num);
	let randomQuote = allQuotes.data[num].quote; 
	console.log(randomQuote);
	$('.random-quote').html(`${randomQuote}`);
})
*/

/*
let now = new Date();
let millisTill00 = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 20, 0, 0, 0) - now;
if (millisTill00 < 0) {
     millisTill00 += 86400000; // it's after 8pm, try 8pm tomorrow.
}
setTimeout(function(){alert("It's 8pm!")}, millisTill00);
*/





/***   FIT GOALS   ***/

//Get all fit goals
function getAllGoals(){
	$.get('/goal/all', (allGoals) => {
		console.log(allGoals);
		displayAllGoals(allGoals);
	})
}

function displayAllGoals( allGoals ){
	allGoals.data.forEach( (goal) => {
		$('.goalhistory-list').append(`
			<li>${goal.title}: ${goal.description}</li>	
		`)
	})
}

getAllGoals();







/*
// Get modal element
var modal = document.getElementById('simpleModal');
// Get open modal button
var modalBtn = document.getElementById('modalBtn');
// Get close button
var closeBtn = document.getElementsByClassName('closeBtn')[0];

// Listen for open click
modalBtn.addEventListener('click', openModal);
// Listen for close click
closeBtn.addEventListener('click', closeModal);
// Listen for outside click
window.addEventListener('click', outsideClick);

// Function to open modal
function openModal(){
  modal.style.display = 'block';
}

// Function to close modal
function closeModal(){
  modal.style.display = 'none';
}

// Function to close modal if outside click
function outsideClick(e){
  if(e.target == modal){
    modal.style.display = 'none';
  }
}
*/



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
		let params = {
			title: $('#fitgoal-title').val(),
			//createDate: 
			description: $('#fitgoal-description').val(),  
		}
		$.ajax({
		    type: "POST",
		    contentType: 'application/json',
		    url: '/goal/new',
		    data: JSON.stringify(params)
	  	})
		.done(function( data ){
			console.log( data );
	        displayNewFitGoal( data );
	        $('.fitgoal-modal-form').addClass('hidden');
		})
		.fail(function( data ){
	    	console.log('Post new fit goal failed!');
	    })
	})
}

function displayNewFitGoal( data ){
	$('#fitgoal-title').val('');
	$('#fitgoal-description').val('');
    $('.current-fitgoal').removeClass('hidden');
    $('.current-fitgoal').html(`
    	<h3 class="current-fitgoal-title">${data.data.title}</h3>
		<p class="current-fitgoal-description">${data.data.description}</p>
    `)
}

postNewFitGoal();










/***   CATEGORIES   ***/

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



/***   ACTIVITY   ***/
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



//Post new activity.
function postNewActivity(){

}





/*
	name: {type: String, required: true},
	time: {type: String, required: true},
	duration: {type: Number, required: false},
	cardio: {
				distance: {type: Number, required: false},
				duration: {type: Number, required: false},
			},
	routine: [{type: mongoose.Schema.Types.ObjectId, ref: 'exercise'}],
	location: {type: String, required: false}, //may integrate google maps API
	inspiration: {type: String, required: false}, //link to routine blog/pic/video
	completed: {type: Boolean, default: false}
*/
