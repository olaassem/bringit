
/***   Random Quote   ***/


$.get('/quote/all', (allQuotes) => {
	let num = Math.floor(Math.random() * allQuotes.data.length);
	console.log(num);
	let randomQuote = allQuotes.data[num].quote; 
	console.log(randomQuote);
	$('.random-quote').html(`${randomQuote}`);
})

/*
let now = new Date();
let millisTill00 = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 20, 0, 0, 0) - now;
if (millisTill00 < 0) {
     millisTill00 += 86400000; // it's after 8pm, try 8pm tomorrow.
}
setTimeout(function(){alert("It's 8pm!")}, millisTill00);
*/




/***   Fit Goal   ***/
$.get('/goal/all', (allGoals) => {
	console.log(allGoals);
	allGoals.data.forEach( (goal)=> {
		$('.goalhistory-list').append(`
			<li>${goal.title}: ${goal.description}</li>	
		`)
	})
})


/*
//Post a new fit goal
$('.post-fitgoal-form').on('submit', event => {
	event.preventDefault();
	let params = {
		//createDate: $().val;
		title: $('#fitgoal-title').val(),
		description: $('#fitgoal-description').val(),  
		//completed: $().val()
	}
	$.post( '/goal/new', params )
		.done(function( data ){
			console.log( newFitGoal );
		})
		.fail(function( data ){
			console.log('Post new fit goal failed!')
		})
});


/*
	$.ajax({
		method: 'POST',
		url: '/goal/new',
		data: fitgoal,
		//contentType: 'application/json',
		//dataType: 'json',
		success: ( newFitGoal ) => {
			console.log( newFitGoal );
			$('.current-fitgoal').removeClass('hidden');
			$('.current-fitgoal-title').append(newFitGoal.title);
			$('.current-fitgoal-description').append(newFitGoal.description);
			//$('.current-fitgoal-date').append(newFitGoal.createDate);
		},
		error: ( error ) => console.log(error)
	});
});
*/






/***   Categories   ***/

//Get all categories
$.get('/category/all', (allCategories) => {
	console.log(allCategories);
	allCategories.data.forEach( (category)=> {
		$('.category-icons').append(`
			<div class="icon">
				<p class="category-name">${category.name}</p>
				<img class="category-img" src=${category.img}/>
			</div>	
		`)
	})

})


//Post a new category
$('.post-category-form').submit('#addcategorybutton', event => {
	event.preventDefault();
	let params = {
		name: $('#category-name').val(),
		img: $('#category-img').val()  
	}
	console.log(params);
	$.post( '/category/new', params )
	.done(function( data ){
		console.log( data );
	})
	.fail(function( data ){
		console.log('Post new category failed!')
	})
});


/*
I feel like the same thing was happening to me 
recently until we figured out that we needed 
to add this to the server: 
app.use(bodyParser.urlencoded({ extended: false }));
*/
