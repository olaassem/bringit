//motifit quote
//fitgoals
//fitweek
//categories
//exercises
//modal functionality


//token --local storage

//will be executed anytime we refresh
function initApp() {
    let userName = localStorage.getItem('name');
    if (userName) {
        $('.greeting .firstname').html(userName);
        getCurrentFitGoals();
        getUserWeek();
        showMotiFitQuote();
    }
    //anytime we check, and we don't have have the token it will go back to index pg
    if (!localStorage.getItem('token')) {
        window.location.href = 'index.html'; //always an object
    }
    //token and ID exists
    //We do the check to get user info
    else {
        console.log(localStorage.getItem('userID'));
    }
}
initApp();



/***   S I G N  O U T    ***/
function signOut() {
    $('.signout').on('click', event => {
        event.preventDefault();
        localStorage.clear();
        window.location.href = 'index.html';
    });
}
signOut();



/***   M O T I F I T   Q U O T E    ***/

//calls take the most time
// do the random grab serverside
//adds button listener
function setupMotiFitQuote() {
    $('.motifit-button').on('click', event => {
        event.preventDefault();

        $.get('/quote/random/' + localStorage.getItem('token'), (randomQuote) => {

            localStorage.setItem('randomQuote', randomQuote.data);

            showMotiFitQuote();
        })
    })
}
setupMotiFitQuote();


// displays the given quote to the "random-quote" element
function showMotiFitQuote() {

    let currentQuote = localStorage.getItem('randomQuote');

    $('.random-quote').html(`${currentQuote}`);
}
showMotiFitQuote();







/***   F I T   G O A L S   ***/

//Get all completed fit goals (for history log).
function getAllCompletedGoals() {
    $('.fitgoal-history-button').on('click', event => {
        event.preventDefault();
        $('[data-popup="popup-fitgoal-history"]').fadeIn(350);
        let url = '/goal/all/' + localStorage.getItem('token');
        $.get(url, (allGoals) => {
            console.log(allGoals);
            displayCompletedFitGoals(allGoals);
        })
    });
}
getAllCompletedGoals();


function renderCompletedFitGoals(fitgoal) {
    let formatedDate = moment(fitgoal.createDate).format('dddd, MMMM Do YYYY');
    if (fitgoal.completed === true) {
        return `
            <div class="completed-goal">
                <p>Completed on: ${formatedDate}</p>
                <h3>Title: ${fitgoal.title}</h3>
                <p>Description: ${fitgoal.description}</p>
            </div>  
        `
    }
}


function displayCompletedFitGoals(allGoals) {
    let completedFitGoalOutput = allGoals.data.map(fitgoal => renderCompletedFitGoals(fitgoal)).join('');
    $('.goalhistory-list').html(completedFitGoalOutput);
}



//Post a new fit goal
function postNewFitGoal() {
    $('.post-fitgoal-form').on('click', '#add-fitgoal-button', event => {
        event.preventDefault();
        let body = {
            'title': $('#fitgoal-title').val(),
            'userID': localStorage.getItem('userID'),
            'createDate': Date.now(),
            'description': $('#fitgoal-description').val(),
            'completed': false,
            'token': localStorage.getItem('token')
        }
        $.ajax({
                type: "POST",
                contentType: 'application/json',
                url: '/goal/new',
                data: JSON.stringify(body)
            })
            .done(function(fitgoal) {
                console.log(fitgoal);
                closeModal();
                getCurrentFitGoals();
            })
            .fail(function(fitgoal) {
                console.log('Post new fit goal failed!');
            })
    })
}
postNewFitGoal();


function getCurrentFitGoals() {
    let url = '/goal/all/' + localStorage.getItem('token');
    $.get(url, (allGoals) => {
        console.log(allGoals);
        displayCurrentFitGoals(allGoals);
    });
}
getCurrentFitGoals();


function renderCurrentFitGoals(fitgoal) {
    let formatedDate = moment(fitgoal.createDate).format('dddd, MMMM Do YYYY');
    if (fitgoal.completed === false) {
        $('#fitgoal-title').val('');
        $('#fitgoal-description').val('');
        $('.current-fitgoal').removeClass('hidden');
        return `
        <p class="current-fitgoal-date">${formatedDate}</p>
        <h3 class="current-fitgoal-title">${fitgoal.title}</h3>
        <p class="current-fitgoal-description">${fitgoal.description}</p>
        <button class="completed-fitgoal-button" value="${fitgoal._id}">Completed!</button>
        <button class="edit-fitgoal-button" value="${fitgoal._id}"><img class="edit-icon" src="https://i.pinimg.com/originals/2b/5d/21/2b5d21752e9b782f5b97e07b2317314f.png" alt="edit icon"/></button></button>
        <button class="delete-fitgoal-button" value="${fitgoal._id}"><img class="delete-icon" src="https://png.icons8.com/metro/1600/delete.png" alt="delete icon"/></button>
        `
    }
}


function displayCurrentFitGoals(allGoals) {
    let currentFitGoalOutput = allGoals.data.map(fitgoal => renderCurrentFitGoals(fitgoal)).join('');
    $('.current-fitgoal').html(currentFitGoalOutput);
}


//Completed fit goal.
function completedFitGoal() {
    $('.current-fitgoal').on('click', '.completed-fitgoal-button', event => {
        event.preventDefault();
        let ID = $(event.currentTarget).attr('value');
        console.log(ID);
        let body = {
            '_id': `${ID}`,
            'completed': true,
            'createDate': Date.now(),
            'userID': localStorage.getItem('userID'),
            'token': localStorage.getItem('token')
        };
        $.ajax({
            type: 'PUT',
            url: `/goal/${ID}/` + localStorage.getItem('token'),
            contentType: 'application/json',
            data: JSON.stringify(body)
        }).done((fitgoal) => {
            getCurrentFitGoals();
            getAllCompletedGoals();
        }).fail((error) => {
            console.log('Completeing fit goal failed!');
        })
    });
}
completedFitGoal();


//Delete selected fit goal.
function deleteFitGoal() {
    $('.current-fitgoal').on('click', '.delete-fitgoal-button', event => {
        event.preventDefault();
        let ID = $(event.currentTarget).attr("value");
        console.log(ID);
        $.ajax({
            url: `goal/${ID}/` + localStorage.getItem('token'),
            type: 'DELETE'
        }).done((fitgoal) => {
            getCurrentFitGoals();
        }).fail((error) => {
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
            url: `goal/${ID}/` + localStorage.getItem('token'),
            type: 'GET'
        }).done(function(fitgoal) {
            console.log(fitgoal);
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
        }).fail(function(fitgoal) {
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
            '_id': `${ID}`,
            'title': $('#fitgoal-title-edit').val(),
            'createDate': Date.now(),
            'description': $('#fitgoal-description-edit').val(),
            'completed': false,
            'userID': localStorage.getItem('userID'),
            'token': localStorage.getItem('token')
        }
        $.ajax({
                type: "PUT",
                contentType: 'application/json',
                url: `/goal/${ID}/` + localStorage.getItem('token'),
                data: JSON.stringify(body)
            })
            .done(function(fitgoal) {
                console.log(fitgoal);
                $('.popup').fadeOut(350);
                displayEditedFitGoal(fitgoal);
            })
            .fail(function(fitgoal) {
                console.log('Updating new fit goal failed!');
            })
    })
}
putFitGoalEdits();


//Cancel fitgoal update.
function cancelFitGoalUpdate() {
    $('.edit-fitgoal-form').on('click', '#cancel-fitgoal-button', event => {
        $('.popup').fadeOut(350);
    });
}
cancelFitGoalUpdate();


function displayEditedFitGoal(fitgoal) {
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



/***   D A Y   P L A N   F O R M   G LO B A L   V A R I A B L E   ***/
let dayplanFormObject = {};



/***   C A T E G O R I E S   ***/

//Get all categories
function getAllCategories() {
    $.get('/category/all/' + localStorage.getItem('token'), (allCategories) => {
        console.log(allCategories);
        displayAllCategories(allCategories);
    });
}
getAllCategories();


function renderCategories(category) {
    return `
        <div class="col-3">
            <div class="category-container">
                <label for="${category.name}"><input type="radio" name="toggle" id="${category.name}" value="${category._id}" style="background-image: url(http://i54.tinypic.com/4zuxif.jpg)"><img class="category-img" src="${category.img}" alt="${category.name} image" width="100px" height="100px"/><p>${category.name}</p></label>
                <button class="delete-category-btn" value="${category._id}"><img class="delete-icon" src="https://png.icons8.com/metro/1600/delete.png" alt="delete icon"/></button>
            </div>
        </div>
    `
}
//ADD CATEGORY EDIT BUTTON???
//  <button class="edit-category-btn"><img class="edit-icon" src="https://i.pinimg.com/originals/2b/5d/21/2b5d21752e9b782f5b97e07b2317314f.png" alt="edit icon"/></button>


function displayAllCategories(allCategories) {
    let categoriesOutput = allCategories.data.map(category => renderCategories(category)).join('');
    $('.category-icons').html(categoriesOutput);
}



//Remove category delete button on category focus.
// $('.category-icons').on('checked', 'input', function(event) {
//     $(event.target).next('.delete-category-btn').addClass('hidden');
// });

// //Return category delete button on category focusout.
// $('.category-icons').on('focusout', '.category-toggle', function() {
//     $('.category-container').children('.delete-category-btn').removeClass('hidden');
// });




function revealNewCategoryForm() {
    $('.popdown-post-category').on('click', event => {
        event.preventDefault();
        $('.new-category-form').removeClass('hidden');
    })
}
revealNewCategoryForm();


//Post a new category
function postNewCategory() {
    $('.new-category-form').on('click', '.post-category-btn', event => {
        event.preventDefault();
        let body = {
            'name': $('#category-name').val(),
            'img': $('#category-img').val(),
            'userID': localStorage.getItem('userID'),
            'token': localStorage.getItem('token')
        }
        $.ajax({
                type: "POST",
                contentType: 'application/json',
                url: '/category/new/' + localStorage.getItem('token'),
                data: JSON.stringify(body),
            })
            .done(function(data) {
                console.log(data);
                getAllCategories(data);
                $('#category-name').val(''),
                    $('#category-img').val(''),
                    $('.new-category-form').addClass('hidden');
            })
            .fail(function(error) {
                console.log('Posting new category failed!')
            })
    })
}
postNewCategory();


function cancelNewCategory() {
    $('.new-category-form').on('click', '.cancel-category-btn', event => {
        event.preventDefault();
        $('.new-category-form').addClass('hidden');
    });
}
cancelNewCategory();


//Delete category.
function deleteCategory() {
    $('.category-icons').on('click', '.delete-category-btn', event => {
        event.preventDefault();
        let ID = $(event.currentTarget).attr("value");
        console.log(ID);
        $.ajax({
            url: `/category/${ID}/` + localStorage.getItem('token'),
            type: 'DELETE'
        }).done((category) => {
            console.log(category);
            getAllCategories();
        }).fail((error) => {
            console.log('Deleting category failed!');
        })
    });
}
deleteCategory();


//Get selected/checked category
function getSelectedCategory() {
    $('.dayplan-category-get').on('click', event => {
        event.preventDefault();
        let ID = $('input[name="toggle"]:checked').val();
        dayplanFormObject.categoryID = ID;
        console.log(dayplanFormObject);
    })
}
getSelectedCategory();



/***   A C T I V I T Y   ***/


// Post new activity.
function postNewActivity() {
    $('.post-dayplan-form').on('click', '#submit-dayplan-button', event => {
        event.preventDefault();
        let body = {
            'name': $('#activity-name').val(),
            'time': $('#activity-time').val(),
            'duration': $('#activity-duration').val(),
            'cardio': {
                'distance': $('#cardio-distance').val(),
                'duration': $('#cardio-duration').val()
            },
            'location': $('#activity-location').val(),
            'inspiration': $('#activity-inspiration').val(),
            'completed': false,
        }
        dayplanFormObject.activity = body;
        dayplanFormObject.userID = localStorage.getItem('userID');
        dayplanFormObject.token = localStorage.getItem('token');
        console.log(dayplanFormObject);
        createDayPlan(dayplanFormObject);
        hideAddDayPlanBtn();
        //HIDE DAYPLAN ADD BUTTON
        //SHOW CATEGORY IMG IN DAY CONTAINER
    })
}
postNewActivity();



//Hide add dayplan button when plan is set for day.
function hideAddDayPlanBtn() {

}


function showCategoryImgInDayCntnr() {

}








/***   E X E R C I S E S   ***/


function clearExerciseValue() {
    $('#exercise-name').val("");
    $('#exercise-sets').val("");
    $('#exercise-reps').val("");
    $('#exercise-weight').val("");
}


//Get all exercises.
function getAllExercises() {
    $.get('/exercise/all/' + localStorage.getItem('token'), (allExercises) => {
        console.log(allExercises);
        displayExercises(allExercises);
    });
}
getAllExercises();


function renderExercises(exercise) {
    return `
      <tr class="exercise-rows">
        <td><input type="checkbox" id="select-exercise" value="${exercise._id}"></td>
        <td class="td-exercise-name" width="25%">${exercise.name}</td>
        <td class="td-exercise-weight" width="25%">${exercise.weight}</td> 
        <td class="td-exercise-sets" width="25%">${exercise.sets}</td>
        <td class="td-exercise-reps" width="25%">${exercise.reps}</td>
        <td><button type="submit" class="edit-exercise-btn" value="${exercise._id}"><img class="edit-icon" src="https://i.pinimg.com/originals/2b/5d/21/2b5d21752e9b782f5b97e07b2317314f.png"/></button></td>
        <td><button type="submit" class="delete-exercise-btn" value="${exercise._id}"><img class="delete-icon" src="https://png.icons8.com/metro/1600/delete.png"/></button></td>
      </tr>
    `
}


function displayExercises(allExercises) {
    let exercisesOutput = allExercises.data.map(exercise => renderExercises(exercise)).join('');
    $('.exercise-list').html(exercisesOutput);
}


function showNewExerciseForm() {
    $('.popdown-post-exercise').on('click', event => {
        event.preventDefault();
        $('.new-exercise-form').removeClass('hidden');
    })
}
showNewExerciseForm();


//Post new exercise.
function postNewExercise() {
    $('.post-exercise-form').on('click', '.post-exercise-btn', event => {
        event.preventDefault();
        let body = {
            'name': $('#exercise-name').val(),
            'sets': $('#exercise-sets').val(),
            'reps': $('#exercise-reps').val(),
            'weight': $('#exercise-weight').val(),
            'token': localStorage.getItem('token'),
            'userID': localStorage.getItem('userID')
        }
        $.ajax({
                type: "POST",
                contentType: 'application/json',
                url: '/exercise/new/' + localStorage.getItem('token'),
                data: JSON.stringify(body)
            })
            .done(function(newExercise) {
                console.log(newExercise);
                clearExerciseValue();
                $('.new-exercise-form').addClass('hidden');
                getAllExercises();
            })
            .fail(function(error) {
                console.log('Post new weights routine failed!');
            })
    })
}
postNewExercise();

//Cancel adding new exercise.
function cancelNewExercise() {
    $('.new-exercise-form').on('click', '.cancel-exercise-btn', event => {
        event.preventDefault();
        clearExerciseValue();
        $('.new-exercise-form').addClass('hidden');
    });
}
cancelNewExercise();


//Delete exercise table.
function deleteExerciseTable() {
    $('.exercise-list').on('click', '.delete-exercise-btn', event => {
        event.preventDefault();
        let ID = $(event.currentTarget).attr("value");
        console.log(ID);
        $.ajax({
            url: `/exercise/${ID}/` + localStorage.getItem('token'),
            type: 'DELETE'
        }).done((exercise) => {
            console.log(exercise);
            getAllExercises();
        }).fail((error) => {
            console.log('Deleting exercise routine table failed!');
        })
    });
}
deleteExerciseTable();


//Get exercise details when edit button is clicked.
function showEditExerciseForm() {
    $('.exercise-list').on('click', '.edit-exercise-btn', event => {
        event.preventDefault();
        $('.popdown-edit-exercise').removeClass('hidden');
        let ID = $(event.currentTarget).attr("value");
        $.ajax({
            url: `/exercise/${ID}/` + localStorage.getItem('token'),
            type: 'GET'
        }).done(function(exercise) {
            console.log(exercise);
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
                    <button type="submit" class="put-exercise-btn" value="${exercise.data._id}">Update</button>
                    <button type="submit" class="cancel-exercise-btn">Cancel</button>
                </fieldset> 
            `);
        }).fail(function(error) {
            console.log('Updating exercise failed!');
        });
    });
}
showEditExerciseForm();



//Put exercise edits.
function putExerciseEdits() {
    $('.edit-exercise-form').on('click', '.put-exercise-btn', event => {
        event.preventDefault();
        let ID = $(event.currentTarget).attr("value");
        let body = {
            '_id': `${ID}`,
            'name': $('#exercise-name-edit').val(),
            'sets': $('#exercise-sets-edit').val(),
            'reps': $('#exercise-reps-edit').val(),
            'weight': $('#exercise-weight-edit').val(),
            'userID': localStorage.getItem('userID')
        }
        $.ajax({
                type: "PUT",
                contentType: 'application/json',
                url: `exercise/${ID}/` + localStorage.getItem('token'),
                data: JSON.stringify(body)
            })
            .done(function(exercise) {
                console.log(exercise);
                $('.popdown-edit-exercise').addClass('hidden');
                getAllExercises();
            })
            .fail(function(error) {
                console.log('Updating exercise failed!');
            })
    })
}
putExerciseEdits();



//Cancel exercise update.
function cancelExerciseEdit() {
    $('.edit-exercise-form').on('click', '.cancel-exercise-btn', event => {
        $('.popdown-edit-exercise').addClass('hidden');
    });
}
cancelExerciseEdit();



//Get selected/checked exercises.
function getSelectedExercises() {
    $('.dayplan-exercise-get').on('click', event => {
        event.preventDefault();
        let ID = $(":checkbox:checked").val();
        let checked = $(":checkbox:checked");
        console.log(checked);

        let exercisesIDs = [];
        for (let i = 0; i < checked.length; i++) {
            exercisesIDs.push(checked[i].value);
        }

        dayplanFormObject.exercisesIDs = exercisesIDs;
        console.log(dayplanFormObject);
    })
}
getSelectedExercises();






/***   D A Y    P L A N  ***/


//Post new day plan
function createDayPlan() {
    $.ajax({
            type: 'POST',
            contentType: 'application/json',
            url: 'dayplan/new/' + localStorage.getItem('token'),
            data: JSON.stringify(dayplanFormObject)
        })
        .done(function(dayplan) {
            console.log(dayplan);
            getUserWeek();
        })
        .fail(function(error) {
            console.log('Post new day plan failed!');
        })
}



function getUserWeek() {
    $.ajax({
            type: 'GET',
            contentType: 'application/json',
            url: 'dayplan/all/' + localStorage.getItem('token')
        })
        .done(function(week) {
            console.log(week);
            showDayPlan(week);
        })
        .fail(function(error) {
            console.log('Post new day plan failed!');
        })
}


const noPlanMsg = [
    "No fit plan set for Monday.",
    "No fit plan set for Tuesday.",
    "No fit plan set for Wednesday.",
    "No fit plan set for Thursday.",
    "No fit plan set for Friday.",
    "No fit plan set for Saturday.",
    "No fit plan set for Sunday."
];


//.find() specifically work to find elements in an html.
//week is not an html element -- it is an array of onjects.
function findDay(week, day) { //day from showDayPlan
    for (let i = 0; i < week.data.length; i++) {
        if (week.data[i].day == day) { //values saved on json array is a number // string number 
            return week.data[i]
        }
    }
}

//Display fit plan for particular/clicked day
function showDayPlan(week) {
    $('.day-container').on('click', '.view-icon', event => {
        event.preventDefault();
        let day = $(event.target).attr('value');

        const dayFound = findDay(week, day);

        if (dayFound === undefined) {
            $('.unique-dayplan-results').html(`<p>${noPlanMsg[day]}</p>`);
        } else {
            console.log(dayFound);
            displayDayPlan(dayFound);
            displayDayPlanExercisesResults(dayFound);
        }
    })
}

function displayDayPlan(dayFound) {
    $('.unique-dayplan-results').html('');
    $('.unique-dayplan-results').html(`
        <p>${dayFound.categoryID.name}</p>
        <p>${dayFound.activityID.name}</p>
        <p>${dayFound.activityID.time}</p>
        <p>${dayFound.activityID.duration}</p>
        <p>${dayFound.activityID.location}</p>
        <p>${dayFound.activityID.cardio.distance}</p>
        <p>${dayFound.activityID.cardio.duration}</p>
        <div class="exercise-results-list-container">
            <table class="exercise-results-table" border="1">
                <thread>
                    <tr>
                        <th class="th-exercise-results-name" width="15%">Exercise</th>
                        <th class="th-exercise-results-weight" width="15%">Weight</th>
                        <th class="th-exercise-results-sets" width="15%">Sets</th>
                        <th class="th-exercise-results-name" width="15%">Reps</th>
                    </tr>
                </thread>
                <tbody class="exercise-results-list">
                </tbody>
            </table>
        </div>                  
        <p>${dayFound.activityID.inspiration}</p>
        <button type="submit" class="edit-dayplan-btn" value="${dayFound._id}" data-popup-open="popup-edit-dayplan"><img class="edit-icon" src="https://i.pinimg.com/originals/2b/5d/21/2b5d21752e9b782f5b97e07b2317314f.png"/></button>
        <button type="submit" class="delete-dayplan-btn" value="${dayFound._id}"><img class="delete-icon" src="https://png.icons8.com/metro/1600/delete.png"/></button>
    `);
}

//JSON.stringify(object) -> will provide  string of entire object
//JSON.parse(string) 

function renderDayPlanExercisesResults(exercise) {
    return `
      <tr class="exercise-result-rows">
        <td class="td-exercise-results-name" width="25%">${exercise.name}</td>
        <td class="td-exercise-results-weight" width="25%">${exercise.weight}</td> 
        <td class="td-exercise-results-sets" width="25%">${exercise.sets}</td>
        <td class="td-exercise-results-reps" width="25%">${exercise.reps}</td>
      </tr>
    `
}

function displayDayPlanExercisesResults(allExercises) {
    let dayplanExercisesOutput = allExercises.exercisesIDs.map(exercise => renderDayPlanExercisesResults(exercise)).join('');
    $('.exercise-results-list').html(dayplanExercisesOutput);
}



function deleteDayPlan() {
    $('.unique-dayplan-results').on('click', '.delete-dayplan-btn', event => {
        event.preventDefault();
        let ID = $(event.currentTarget).attr('value');
        console.log(ID);
        $.ajax({
            url: `dayplan/${ID}/` + localStorage.getItem('token'),
            type: 'DELETE'
        }).done((dayplan) => {
            $('.unique-dayplan-results').html('');
            getUserWeek();
        }).fail((error) => {
            console.log('Deleting day plan failed!');
        })
    });
}
deleteDayPlan();




//Get day plan details when edit button is clicked.
function openEditDayPlanModal() {
    $('.unique-dayplan-results').on('click', '.edit-dayplan-btn', event => {
        event.preventDefault();


        $('[data-popup="popup-edit-dayplan"]').fadeIn(350);
        let ID = $(event.currentTarget).attr("value");
        $.ajax({
            url: `dayplan/${ID}/` + localStorage.getItem('token'),
            type: 'GET'
        }).done(function(dayplan) {
            console.log(dayplan);


            $('.edit-dayplan-form').html(`
                <fieldset>
                    <legend><span class="dayoftheweek"></span>Fit Plan</legend>
                    <div class="category-section">
                        <h2>STEP 1 Category<button type="submit" class="btn popdown-post-category"><img class="add-icon" src="https://d30y9cdsu7xlg0.cloudfront.net/png/764773-200.png" alt="add icon"/></button></h2>
                        <!--category section-->
                        <div class="row">
                            <div class="col-12">
                                <div class="new-category-form hidden">
                                    <form role="form" class="post-category-form" novalidate>
                                        <fieldset>
                                            <legend>Add New Category</legend>
                                            <label for="category-name">Name<span class="required">*</span></label>
                                            <input id="category-name" type="text" placeholder="e.g. Climbing" />
                                            </br>
                                            <label for="category-img">Image<span class="required">*</span></label>
                                            <input id="category-img" type="text" placeholder="URL" />
                                            </br>
                                            <button type="submit" class="post-category-btn">Add</button>
                                            <button type="submit" class="cancel-category-btn">Cancel</button>
                                        </fieldset>
                                    </form>
                                </div>
                            </div>
                        </div>
                        <div class="category-icons"></div>
                        <div class="row">
                            <div class="col-12">
                                <button type="submit" class="dayplan-category-get next">Next</button>
                            </div>
                        </div>
                    </div>
                    <!--end of category section-->
                    <!--activity section-->
                    <div class="row">
                        <div class="col-12">
                            <div class="activity-container">
                                <form role="form" class="post-activity-form" novalidate>
                                    <h2>STEP 2 Activity</h2>
                                    <fieldset>
                                        <legend>Edit Activity Info</legend>
                                        <label for="activity-name">Name<span class="required">*</span></label>
                                        <input id="activity-name" type="text" value="${dayplan.data.activityID.name}" />
                                        </br>
                                        <label for="activity-time">Time<span class="required">*</span></label>
                                        <input id="activity-time" type="text" value="${dayplan.data.activityID.time}" />
                                        </br>
                                        <label for="activity-duration">Duration<span class="required">*</span></label>
                                        <input id="activity-duration" type="text" value="${dayplan.data.activityID.duration}" />
                                        </br>
                                        <label for="activity-cardio">Cardio</label>
                                        </br>
                                        <label for="cardio-distance">Distance</label>
                                        <input id="cardio-distance" type="text" value="${dayplan.data.activityID.cardio.distance}" />
                                        </br>
                                        <label for="cardio-duration">Duration</label>
                                        <input id="cardio-duration" type="text" value="${dayplan.data.activityID.cardio.duration}" />
                                        </br>
                                        <label for="activity-location">Location</label>
                                        <input id="activity-location" type="text" value="${dayplan.data.activityID.location}"" />
                                        </br>
                                        <label for="activity-inspiration">Inspiration</label>
                                        <input id="activity-inspiration" type="text" value="${dayplan.data.activityID.inspiration}" />
                                        <div class="row">
                                            <div class="col-12">
                                                <button type="submit" class="dayplan-activity-get next">Next</button>
                                            </div>
                                        </div>
                                    </fieldset>
                                </form>
                            </div>
                        </div>
                    </div>
                    <!--end of activity section-->
                    <!--exercise section-->
                    <div class="row">
                        <div class="col-12">
                            <h2>STEP 3 Exercises<button type="submit" class="btn popdown-post-exercise"><img class="add-icon" src="https://d30y9cdsu7xlg0.cloudfront.net/png/764773-200.png" alt="add icon"/></button></h2>
                            <div class="new-exercise-form hidden">
                                <form role="form" class="post-exercise-form" action="#" method="#">
                                    <fieldset>
                                        <legend>Add New Exercise</legend>
                                        </br>
                                        <label for="exercise-name">Name:</label>
                                        <input id="exercise-name" type="text" placeholder="" />
                                        </br>
                                        <label for="exercise-weight">Weight:</label>
                                        <input id="exercise-weight" type="text" placeholder="" />
                                        </br>
                                        <label for="exercise-sets">Sets:</label>
                                        <input id="exercise-sets" type="text" placeholder="" />
                                        </br>
                                        <label for="exercise-reps">Reps:</label>
                                        <input id="exercise-reps" type="text" placeholder="" />
                                        </br>
                                        <button type="submit" class="post-exercise-btn">Add</button>
                                        <button type="submit" class="cancel-exercise-btn">Cancel</button>
                                    </fieldset>
                                </form>
                            </div>
                            <div class="popdown-edit-exercise hidden">
                                <form role="form" class="edit-exercise-form" action="#" method="#"></form>
                            </div>
                            <div class="exercise-list-container">
                                <table class="exercise-table" border="1">
                                    <thread>
                                        <tr>
                                            <th class="th-exercise-select" width="15%">Select</th>
                                            <th class="th-exercise-name" width="15%">Name</th>
                                            <th class="th-exercise-weight" width="15%">Weight</th>
                                            <th class="th-exercise-sets" width="15%">Sets</th>
                                            <th class="th-exercise-name" width="15%">Reps</th>
                                            <th class="th-exercise-edit" width="15%"></th>
                                            <th class="th-exercise-delete" width="15%"></th>
                                        </tr>
                                    </thread>
                                    <tbody class="exercise-list">
                                    </tbody>
                                </table>
                                <div class="row">
                                    <!-- <div class="col-12"> -->
                                    <button type="submit" class="dayplan-exercise-get next">Next</button>
                                    <!-- </div> -->
                                </div>
                            </div>
                        </div>
                    </div>
                    <!--end of activity section-->
                    <div class="fitplan-modal-btns">
                        <button type="submit" id="submit-edited-dayplan-button" data-popup-close="popup-post-dayplan" value="${dayplan.data._id}">Add</button>
                        <button type="submit" id="cancel-dayplan-button" data-popup-close="popup-post-dayplan">Cancel</button>
                    </div>
                </fieldset>
             `);

            getAllEditDayPlanCategories(dayplan);
            revealNewCategoryForm(dayplan);
            postNewCategory(dayplan); 
            cancelNewCategory(dayplan);
            deleteCategory(dayplan);
            getSelectedCategory(dayplan);

            getAllEditDayPlanExercises(dayplan);
            showNewExerciseForm(dayplan);
            showEditExerciseForm(dayplan);
            postNewExercise();
            cancelNewExercise();
            deleteExerciseTable();
            showEditExerciseForm();
            putExerciseEdits();
            cancelExerciseEdit();
            getSelectedExercises();
            postEditDayPlanActivity();
            
        }).fail(function(error) {
            console.log('Retrieving day plan details failed!');
        });
    });
}
openEditDayPlanModal();


//Get all edit dayplan form categories
function getAllEditDayPlanCategories(dayplan) {
    $.get('/category/all/' + localStorage.getItem('token'), (allCategories) => {
        console.log(allCategories);
        displayAllEditDayPlanCategories(dayplan.data.categoryID._id, allCategories);
    });
}

//render all edit dayplan form categories and display checked category
function renderEditDayPlanCategories(selectedCategoryId, category) {
    if (selectedCategoryId === category._id) {
        return `
        <div class="col-3">
            <div class="category-container">
                <label for="${category.name}"><input checked type="radio" name="toggle" id="${category.name}" value="${category._id}" style="background-image: url(http://i54.tinypic.com/4zuxif.jpg)"><img class="category-img" src="${category.img}" alt="${category.name} image" width="100px" height="100px"/><p>${category.name}</p></label>
                <button class="delete-category-btn" value="${category._id}"><img class="delete-icon" src="https://png.icons8.com/metro/1600/delete.png" alt="delete icon"/></button>
            </div>
        </div>
    `
    } else {
        return `
        <div class="col-3">
            <div class="category-container">
                <label for="${category.name}"><input type="radio" name="toggle" id="${category.name}" value="${category._id}" style="background-image: url(http://i54.tinypic.com/4zuxif.jpg)"><img class="category-img" src="${category.img}" alt="${category.name} image" width="100px" height="100px"/><p>${category.name}</p></label>
                <button class="delete-category-btn" value="${category._id}"><img class="delete-icon" src="https://png.icons8.com/metro/1600/delete.png" alt="delete icon"/></button>
            </div>
        </div>
    `
    }
}
//ADD CATEGORY EDIT BUTTON???
//  <button class="edit-category-btn"><img class="edit-icon" src="https://i.pinimg.com/originals/2b/5d/21/2b5d21752e9b782f5b97e07b2317314f.png" alt="edit icon"/></button>

//Display all edit dayplan form categories
function displayAllEditDayPlanCategories(selectedCategoryId, allCategories) {
    let categoriesOutput = allCategories.data.map(category => renderEditDayPlanCategories(selectedCategoryId, category)).join('');
    $('.category-icons').html(categoriesOutput);
}


//Get all edit dayplan form exercises.
function getAllEditDayPlanExercises(dayplan) {
    $.get('/exercise/all/' + localStorage.getItem('token'), (allExercises) => {
        console.log(allExercises);
        displayEditDayPlanExercises(dayplan.data.exercisesIDs, allExercises);
    });
}

//array find/filter/some(any)
function isExcerciseSelected(selectedExercises, exercise) {
    //return selectedExercises.some(x => x._id === exercises._id);  READ UP
    for (let i = 0; i < selectedExercises.length; i++) {
        if (selectedExercises[i]._id === exercise._id) {
            return true;
        }
    }
    return false;
}


//return statement overrides anything else inside a function
//return aborts the for-loop
//makes a jump in execution that is unexpected
function renderEditDayPlanExercises(selectedExercises, exercise) {
    console.log(selectedExercises, exercise);

    if (isExcerciseSelected(selectedExercises, exercise)) {
        return `
              <tr class="exercise-rows">
                <td><input type="checkbox" checked id="select-exercise" value="${exercise._id}"></td>
                <td class="td-exercise-name" width="25%">${exercise.name}</td>
                <td class="td-exercise-weight" width="25%">${exercise.weight}</td> 
                <td class="td-exercise-sets" width="25%">${exercise.sets}</td>
                <td class="td-exercise-reps" width="25%">${exercise.reps}</td>
                <td><button type="submit" class="edit-exercise-btn" value="${exercise._id}"><img class="edit-icon" src="https://i.pinimg.com/originals/2b/5d/21/2b5d21752e9b782f5b97e07b2317314f.png"/></button></td>
                <td><button type="submit" class="delete-exercise-btn" value="${exercise._id}"><img class="delete-icon" src="https://png.icons8.com/metro/1600/delete.png"/></button></td>
              </tr>
            `
    }
    return `
          <tr class="exercise-rows">
            <td><input type="checkbox" id="select-exercise" value="${exercise._id}"></td>
            <td class="td-exercise-name" width="25%">${exercise.name}</td>
            <td class="td-exercise-weight" width="25%">${exercise.weight}</td> 
            <td class="td-exercise-sets" width="25%">${exercise.sets}</td>
            <td class="td-exercise-reps" width="25%">${exercise.reps}</td>
            <td><button type="submit" class="edit-exercise-btn" value="${exercise._id}"><img class="edit-icon" src="https://i.pinimg.com/originals/2b/5d/21/2b5d21752e9b782f5b97e07b2317314f.png"/></button></td>
            <td><button type="submit" class="delete-exercise-btn" value="${exercise._id}"><img class="delete-icon" src="https://png.icons8.com/metro/1600/delete.png"/></button></td>
          </tr>
        `
}


function displayEditDayPlanExercises(selectedExercises, allExercises) {
    let exercisesOutput = allExercises.data.map(exercise => renderEditDayPlanExercises(selectedExercises, exercise)).join('');
    $('.exercise-list').html(exercisesOutput);
}



// Post activity in edit dayplan form.
function postEditDayPlanActivity() {
    $('.edit-dayplan-form').on('click', '#submit-dayplan-button', event => {
        event.preventDefault();
        let body = {
            'name': $('#activity-name').val(),
            'time': $('#activity-time').val(),
            'duration': $('#activity-duration').val(),
            'cardio': {
                'distance': $('#cardio-distance').val(),
                'duration': $('#cardio-duration').val()
            },
            'location': $('#activity-location').val(),
            'inspiration': $('#activity-inspiration').val(),
            'completed': false,
        }
        dayplanFormObject.activity = body;
        dayplanFormObject.userID = localStorage.getItem('userID');
        dayplanFormObject.token = localStorage.getItem('token');
        console.log(dayplanFormObject);
        createDayPlan(dayplanFormObject);
        hideAddDayPlanBtn();
        //HIDE DAYPLAN ADD BUTTON
        //SHOW CATEGORY IMG IN DAY CONTAINER
    })
}
















/***   M O D A L   F U N C T I O N A L I T Y   ***/

function openModal() {
    $('[data-popup-open]').on('click', function(event) {
        event.preventDefault();
        dayplanFormObject.day = $(event.target).attr('value');
        let targeted_popup_class = $(this).attr('data-popup-open');
        $('[data-popup="' + targeted_popup_class + '"]').fadeIn(350);
    });
}
openModal();



function closeModal() {
    $('[data-popup-close]').on('click', function(event) {
        event.preventDefault();
        let targeted_popup_class = $(this).attr('data-popup-close');
        $('[data-popup="' + targeted_popup_class + '"]').fadeOut(350);
    });
}
closeModal();



function closeModalOnClickOutsideModal() {
    //Close Modal on click outside of modal
    $(".popup").click(function() {
        $('.popup').fadeOut(350).removeClass("active");
    });
    $('.popup-inner').click(function(event) {
        event.stopPropagation();
    });
}
closeModalOnClickOutsideModal();





///////////////////////////////////////////////////////////////