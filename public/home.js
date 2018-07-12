/***   I N I T I A L I S E    A P P    ***/

function initApp() {
    let userName = localStorage.getItem('name');
    if (userName) {
        $('.greeting .firstname').html(userName);
        $('.welcome .firstname-welcome').html(userName + "!");
        getCurrentFitGoals();
        getUserWeek();
        showMotiFitQuote();
    }
    if (!localStorage.getItem('token')) {
        window.location.href = 'index.html';
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


function showMotiFitQuote() {
    let currentQuote = localStorage.getItem('randomQuote');
    if (`${currentQuote}` == "undefined") {
        $('.quote-container').addClass('hidden');
    } else {
        $('.motifit-instruction').addClass('hidden');
        $('.welcome').addClass('hidden');
        $('.quote-container').removeClass('hidden');
        $('.random-quote').html(`${currentQuote}`);
    }
    $('.random-quote').html(`${currentQuote}`);
}
showMotiFitQuote();


/***   F I T   G O A L S   ***/

function getAllCompletedGoals() {
    $('.fitgoal-history-button').on('click', event => {
        event.preventDefault();
        $('[data-popup="popup-fitgoal-history"]').fadeIn(350);
        let url = '/goal/all/' + localStorage.getItem('token');
        $.get(url, (allGoals) => {
            displayCompletedFitGoals(allGoals);
        })
    });
}
getAllCompletedGoals();


function closeAllCompletedGoalsModal() {
    $('[data-popup="popup-fitgoal-history"]').on('click', '.popup-close', event => {
        $('[data-popup="popup-fitgoal-history"]').fadeOut(350);
    })
}
closeAllCompletedGoalsModal();


function renderCompletedFitGoals(fitgoal) {
    let formatedDate = moment(fitgoal.createDate).format('dddd, MMMM Do, YYYY');
    if (fitgoal.completed === true) {
        return `
            <div class="completed-goal">
                <p class="completed-fitgoal-date">Completed on <span class="">${formatedDate}</span</p>
                <p class="completed-fitgoal-title">${fitgoal.title}<span class="completed-fitgoal-description">&nbsp;&nbsp;&nbsp;&nbsp;${fitgoal.description}</span></p>
            </div>
        `
    }
}


function displayCompletedFitGoals(allGoals) {
    let completedFitGoalOutput = allGoals.data.map(fitgoal => renderCompletedFitGoals(fitgoal)).join('');
    $('.goalhistory-list').html(completedFitGoalOutput);
}


function postNewFitGoal() {
    $('.post-fitgoal-form').on('click', '#add-fitgoal-button', event => {
        event.preventDefault();

        let empty = false;
        $('.post-fitgoal-form input').each(function() {
            if ($(this).val() == "") {
                empty = true;
            }
        });
        if (empty) {
            $(this).prop('disabled', 'disabled');
            $('.post-fitgoal-form-alert').removeClass('hidden');
        } else {
            $(this).removeProp('disabled');
            $('.post-fitgoal-form-alert').addClass('hidden');

            let body = {
                'title': $('#fitgoal-title').val(),
                'description': $('#fitgoal-description').val(),
                'userID': localStorage.getItem('userID'),
                'createDate': Date.now(),
                'completed': false,
                'token': localStorage.getItem('token')
            }
            $.ajax({
                    type: "POST",
                    contentType: 'application/json',
                    url: '/goal/new/',
                    data: JSON.stringify(body)
                })
                .done(function(fitgoal) {
                    $('[data-popup="popup-post-fitgoal"]').fadeOut(350);
                    getCurrentFitGoals();
                })
                .fail(function(fitgoal) {
                    console.log('Post new fit goal failed!');
                })
        }
    })
}
postNewFitGoal();


function closePostFitGoalFormModal() {
    $('[data-popup-close="popup-post-fitgoal"]').on('click', (event) => {
        event.preventDefault();
        $('.post-fitgoal-form input').each(function() {
            ($(this).val(""));
        });
        if (!$('.post-fitgoal-form-alert').hasClass('hidden')) {
            $('.post-fitgoal-form-alert').addClass('hidden');
        }
        $('[data-popup="popup-post-fitgoal"]').fadeOut(350);
    });
}
closePostFitGoalFormModal();


function getCurrentFitGoals() {
    let url = '/goal/all/' + localStorage.getItem('token');
    $.get(url, (allGoals) => {
        displayCurrentFitGoals(allGoals);
    });
}
getCurrentFitGoals();


function renderCurrentFitGoals(fitgoal) {
    let formatedDate = moment(fitgoal.createDate).format('dddd, MMMM Do, YYYY');
    if (fitgoal.completed === false) {
        $('#fitgoal-title').val('');
        $('#fitgoal-description').val('');
        $('.current-fitgoal').removeClass('hidden');
        return `
        <div class="unq-fitgoal-box">
            <p class="current-fitgoal-date">${formatedDate}</p>
            <p class="current-fitgoal-title">${fitgoal.title}<span class="current-fitgoal-description">&nbsp;&nbsp;&nbsp;&nbsp;${fitgoal.description}</span></p>
            <button class="completed-fitgoal-button" value="${fitgoal._id}"><img class="complete" src="https://i.imgur.com/cokaK0E.png" alt="check icon"/></button>
            <button class="edit-fitgoal-button" value="${fitgoal._id}"><img class="edit-icon" src="https://i.imgur.com/1V60b8V.png" alt="edit icon"/></button></button>
            <button class="delete-fitgoal-button" value="${fitgoal._id}"><img class="delete-icon" src="https://i.imgur.com/mUiBG7a.png" alt="delete icon"/></button>
        </div>
        `
    }
}


function displayCurrentFitGoals(allGoals) {
    let currentFitGoalOutput = allGoals.data.map(fitgoal => renderCurrentFitGoals(fitgoal)).join('');
    $('.current-fitgoal').html(currentFitGoalOutput);
}


function completedFitGoal() {
    $('.current-fitgoal').on('click', '.completed-fitgoal-button', event => {
        event.preventDefault();
        let ID = $(event.currentTarget).attr('value');
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
            console.log('Checking fit goal as complete failed!');
        })
    });
}
completedFitGoal();


function deleteFitGoal() {
    $('.current-fitgoal').on('click', '.delete-fitgoal-button', event => {
        event.preventDefault();
        let ID = $(event.currentTarget).attr("value");
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


function openEditFitGoalModal() {
    $('body').on('click', '.edit-fitgoal-button', event => {
        event.preventDefault();
        $('[data-popup="popup-edit-fitgoal"]').fadeIn(350);
        let ID = $(event.currentTarget).attr("value");
        $.ajax({
            url: `goal/${ID}/` + localStorage.getItem('token'),
            type: 'GET'
        }).done(function(fitgoal) {
            $('.edit-fitgoal-form').html(`
                <fieldset>
                    <legend>Update Current Fit Goal</legend>
                    <label for="fitgoal-title-edit">Fit Goal<span class="required">*</span></label>
                    </br>
                    <input id="fitgoal-title-edit" type="text" value="${fitgoal.data.title}" />
                    </br>
                    <label for="fitgoal-description-edit">Description<span class="required">*</span></label>
                    </br>
                    <input id="fitgoal-description-edit" type="text" value="${fitgoal.data.description}" />
                    <div><p class="alert edit-fitgoal-form-alert hidden"><i class="fas fa-exclamation-triangle"></i>&nbsp; Please add a fit goal title &amp; description.</p></div>
                    <div class="row">
                        <div class="col-6">
                            <button type="submit" id="update-fitgoal-button" data-popup-close="popup-edit-fitgoal" value="${fitgoal.data._id}">Update</button>
                        </div>
                        <div class="col-6">
                            <button type="submit" id="cancel-fitgoal-button" data-popup-close="popup-edit-fitgoal">Cancel</button>
                        </div>
                    </div>
                </fieldset>
            `);
        }).fail(function(fitgoal) {
            console.log('Updating fitgoal failed!');
        });
    });
}
openEditFitGoalModal();


function putFitGoalEdits() {
    $('.edit-fitgoal-form').on('click', '#update-fitgoal-button', event => {
        event.preventDefault();

        let empty = false;
        $('.edit-fitgoal-form input').each(function() {
            if ($(this).val() == "") {
                empty = true;
            }
        });
        if (empty) {
            $(this).prop('disabled', 'disabled');
            $('.edit-fitgoal-form-alert').removeClass('hidden');
        } else {
            $(this).removeProp('disabled');
            $('.edit-fitgoal-form-alert').addClass('hidden');

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
                    $('.popup').fadeOut(350);
                    displayEditedFitGoal(fitgoal);
                })
                .fail(function(fitgoal) {
                    console.log('Updating fitgoal failed!');
                })
        }
    })
}
putFitGoalEdits();


function closeFitGoalUpdate() {
    $('[data-popup-close="popup-edit-fitgoal"]').on('click', (event) => {
        $('[data-popup="popup-edit-fitgoal"]').fadeOut(350);
    });
}
closeFitGoalUpdate();


function cancelFitGoalUpdate() {
    $('.edit-fitgoal-form').on('click', '#cancel-fitgoal-button', (event) => {
        $('[data-popup="popup-edit-fitgoal"]').fadeOut(350);
    });
}
cancelFitGoalUpdate();


function displayEditedFitGoal(fitgoal) {
    let formatedDate = moment(fitgoal.data.createDate).format('dddd, MMMM Do, YYYY');
    $('#fitgoal-title').val('');
    $('#fitgoal-description').val('');
    $('.current-fitgoal').html(`
        <p class="current-fitgoal-date">${formatedDate}</p>
        <p class="current-fitgoal-title">${fitgoal.data.title}<span class="current-fitgoal-description">&nbsp;&nbsp;&nbsp;&nbsp;${fitgoal.data.description}</span></p>
        <button class="completed-fitgoal-button" value="${fitgoal.data._id}"><img class="complete" src="https://i.imgur.com/cokaK0E.png" alt="check icon"/></button>
        <button class="edit-fitgoal-button" value="${fitgoal.data._id}"><img class="edit-icon" src="https://i.imgur.com/1V60b8V.png" alt="edit icon"/></button>
        <button class="delete-fitgoal-button" value="${fitgoal.data._id}"><img class="delete-icon" src="https://i.imgur.com/mUiBG7a.png" alt="delete icon"/></button>
    `)
}


/***   D A Y   P L A N   F O R M   G LO B A L   V A R I A B L E   ***/
let dayplanFormObject = {};


/***   C A T E G O R I E S   ***/

function getAllCategories() {
    $.get('/category/all/' + localStorage.getItem('token'), (allCategories) => {
        displayAllCategories(allCategories);
    });
}
getAllCategories();


function renderCategories(category) {
    return `
        <div class="col-3">
            <div class="category-container">
                <label for="${category.name}"><input type="radio" name="toggle" id="${category.name}" value="${category._id}" style="background-image: url(http://i54.tinypic.com/4zuxif.jpg)"><img class="category-img" src="${category.img}" alt="${category.name} image" width="100px" height="100px"/><p>${category.name}</p></label>
                <button class="delete-category-btn" value="${category._id}"><img class="delete-icon" src="https://i.imgur.com/mUiBG7a.png" alt="delete icon"/></button>
            </div>
        </div>
    `
}


function displayAllCategories(allCategories) {
    let categoriesOutput = allCategories.data.map(category => renderCategories(category)).join('');
    $('.category-icons').html(categoriesOutput);
}


function revealNewCategoryForm() {
    $('.popdown-post-category').on('click', event => {
        event.preventDefault();
        $('.new-category-form').removeClass('hidden');
    });
}
revealNewCategoryForm();


function postNewCategory() {
    $('.new-category-form').on('click', '.post-category-btn', event => {
        event.preventDefault();
        let empty = false;
        $('.new-category-form input').each(function() {
            if ($(this).val() == "") {
                empty = true;
            }
        });
        if (empty) {
            $(this).prop('disabled', 'disabled');
            $('.new-category-form-alert').removeClass('hidden');
        } else {
            $(this).removeProp('disabled');
            $('.new-category-form-alert').addClass('hidden');

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
                    getAllCategories(data);
                    $('#category-name').val(''),
                        $('#category-img').val(''),
                        $('.new-category-form').addClass('hidden');
                })
                .fail(function(error) {
                    console.log('Posting new category failed!')
                })
        }
    })
}
postNewCategory();


function cancelNewCategory() {
    $('.new-category-form').on('click', '.cancel-category-btn', event => {
        event.preventDefault();
        $('.new-category-form').addClass('hidden');
        $('.new-category-form').find("input[type=text]").val("");
        if (!$('.new-category-form-alert').hasClass('hidden')) {
            $('.new-category-form-alert').addClass('hidden');
        }
    });
}
cancelNewCategory();


function deleteCategory() {
    $('.category-icons').on('click', '.delete-category-btn', event => {
        event.preventDefault();
        let ID = $(event.currentTarget).attr("value");
        $.ajax({
            url: `/category/${ID}/` + localStorage.getItem('token'),
            type: 'DELETE'
        }).done((category) => {
            getAllCategories();
        }).fail((error) => {
            console.log('Deleting category failed!');
        })
    });
}
deleteCategory();


function getSelectedCategory() {
    $('.dayplan-category-get').on('click', event => {
        event.preventDefault();

        let checked = $('input[name="toggle"]:checked');

        if (checked.length == 0) {
            $(this).prop('disabled', 'disabled');
            $('.post-dayplan-category-alert').removeClass('hidden');
        } else {
            $(this).removeProp('disabled');
            $('.post-dayplan-category-alert').addClass('hidden');

            let ID = $('input[name="toggle"]:checked').val();
            dayplanFormObject.categoryID = ID;
            $('.category-section').addClass('hidden');
            $('.activity-container').removeClass('hidden');
        }
    })
}
getSelectedCategory();


function cancelDayPlanOne() {
    $('.category-section').on('click', '#cancel-dayplan-progress-button', event => {
        event.preventDefault();
        $('[data-popup="popup-post-dayplan"]').fadeOut(350);
        $('.category-container input').each(function() {
            $(this).prop('checked', false);
        });
        if (!$('.post-dayplan-category-alert').hasClass('hidden')) {
            $('.post-dayplan-category-alert').addClass('hidden');
        }
    });
}
cancelDayPlanOne();


/***   A C T I V I T Y   ***/

function postNewActivity() {
    $('.fitplan-modal-btns').on('click', '#submit-dayplan-button', event => {
        event.preventDefault();
        let body = {
            'name': $('#activity-name').val(),
            'time': $('#activity-time').val(),
            'duration': $('#activity-duration').val(),
            'cardio': {
                'distance': $('#cardio-distance').val()
            },
            'location': $('#activity-location').val(),
            'inspiration': $('#activity-inspiration').val()
        }
        dayplanFormObject.activity = body;
        dayplanFormObject.userID = localStorage.getItem('userID');
        dayplanFormObject.token = localStorage.getItem('token');
        createDayPlan(dayplanFormObject);

        $('[data-popup="popup-post-dayplan"]').fadeOut(350);

        $('.category-container input').each(function() {
            $(this).prop('checked', false);
        });
        $('.post-activity-form').find('input:text').val('');
        $('.exercise-list-container input').each(function() {
            $(this).prop('checked', false);
        });
        $('.fitplan-modal-btns').addClass('hidden');
        $('.exercise-container').addClass('hidden');
        $('.activity-container').addClass('hidden');
        $('.category-section').removeClass('hidden');
    })
}
postNewActivity();



function hideDayPlanActivitySection() {
    $('.post-activity-form').on('click', '.dayplan-activity-get', event => {
        event.preventDefault();

        let empty = false;
        $('.post-activity-form .req').each(function() {
            if ($(this).val() == "") {
                empty = true;
            }
        });
        if (empty) {
            $(this).prop('disabled', 'disabled');
            $('.post-dayplan-activity-alert').removeClass('hidden');
        } else {
            $(this).removeProp('disabled');
            $('.post-dayplan-activity-alert').addClass('hidden');
            $('.activity-container').addClass('hidden');
            $('.exercise-container').removeClass('hidden');
        }
    });
}
hideDayPlanActivitySection();



function cancelDayPlanTwo() {
    $('.post-activity-form').on('click', '#cancel-dayplan-progress-button', event => {
        event.preventDefault();
        $('[data-popup="popup-post-dayplan"]').fadeOut(350);

        if (!$('.post-dayplan-activity-alert').hasClass('hidden')) {
            $('.post-dayplan-activity-alert').addClass('hidden');
        }

        $('.category-container input').each(function() {
            $(this).prop('checked', false);
        });
        $('.post-activity-form').find('input:text').val('');

        $('.activity-container').addClass('hidden');
        $('.category-section').removeClass('hidden');

    });
}
cancelDayPlanTwo();



/***   E X E R C I S E S   ***/

function clearExerciseValue() {
    $('#exercise-name').val("");
    $('#exercise-sets').val("");
    $('#exercise-reps').val("");
    $('#exercise-weight').val("");
}


function getAllExercises() {
    $.get('/exercise/all/' + localStorage.getItem('token'), (allExercises) => {
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
        <td><button type="submit" class="edit-exercise-btn rmv-btn-brdr" value="${exercise._id}"><img class="edit-icon" src="https://i.imgur.com/1V60b8V.png"/></button></td>
        <td><button type="submit" class="delete-exercise-btn rmv-btn-brdr" value="${exercise._id}"><img class="delete-icon" src="https://i.imgur.com/mUiBG7a.png"/></button></td>
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


function postNewExercise() {
    $('.post-exercise-form').on('click', '.post-exercise-btn', event => {
        event.preventDefault();

        let empty = false;
        $('.post-exercise-form .req').each(function() {
            if ($(this).val() == "") {
                empty = true;
            }
        });
        if (empty) {
            $(this).prop('disabled', 'disabled');
            $('.post-new-exercise-alert').removeClass('hidden');
        } else {
            $(this).removeProp('disabled');
            if (!$('.post-new-exercise-alert').hasClass('hidden')) {
                $('.post-new-exercise-alert').addClass('hidden');
            }
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
                    clearExerciseValue();
                    $('.new-exercise-form').addClass('hidden');
                    getAllExercises();
                })
                .fail(function(error) {
                    console.log('Post new weights routine failed!');
                })
        }
    })
}
postNewExercise();


function cancelNewExercise() {
    $('.new-exercise-form').on('click', '.cancel-exercise-btn', event => {
        event.preventDefault();
        clearExerciseValue();
        $('.new-exercise-form').addClass('hidden');
        $('.post-new-exercise-alert').removeClass('hidden');

        if (!$('.post-new-exercise-alert').hasClass('hidden')) {
            $('.post-new-exercise-alert').addClass('hidden');
        }
    });
}
cancelNewExercise();


function deleteExerciseTable() {
    $('.exercise-list').on('click', '.delete-exercise-btn', event => {
        event.preventDefault();
        let ID = $(event.currentTarget).attr("value");
        $.ajax({
            url: `/exercise/${ID}/` + localStorage.getItem('token'),
            type: 'DELETE'
        }).done((exercise) => {
            getAllExercises();
        }).fail((error) => {
            console.log('Deleting exercise routine table failed!');
        })
    });
}
deleteExerciseTable();


function showEditExerciseForm() {
    $('.exercise-list').on('click', '.edit-exercise-btn', event => {
        event.preventDefault();
        $('.popdown-edit-exercise').removeClass('hidden');
        let ID = $(event.currentTarget).attr("value");
        $.ajax({
            url: `/exercise/${ID}/` + localStorage.getItem('token'),
            type: 'GET'
        }).done(function(exercise) {
            $('.edit-exercise-form').html(`
                <fieldset>
                    <legend>Update Exercise Routine</legend>
                    <label for="exercise-name-edit">Name<span class="required">*</span></label>
                    <input id="exercise-name-edit" class="req" type="text" value="${exercise.data.name}"/>
                    </br>
                    <label for="exercise-weight-edit">Weight</label>
                    <input id="exercise-weight-edit" type="text" value="${exercise.data.weight}"/>
                    </br>
                    <label for="exercise-sets-edit">Sets<span class="required">*</span></label>
                    <input id="exercise-sets-edit" class="req" type="text" value="${exercise.data.sets}"/>
                    </br>
                    <label for="exercise-reps-edit">Reps<span class="required">*</span></label>
                    <input id="exercise-reps-edit" class="req" type="text" value="${exercise.data.reps}"/>
                    </br>
                    <div>
                        <p class="alert put-edit-exercise-alert hidden"><i class="fas fa-exclamation-triangle"></i>&nbsp; Please enter an exercise name, sets, &amp; reps.</p>
                    </div>
                     <div class="row">
                        <div class="col-6">
                            <button type="submit" class="put-exercise-btn" value="${exercise.data._id}">Update</button>
                        </div>
                        <div class="col-6">
                            <button type="submit" class="cancel-exercise-btn">Cancel</button>
                        </div>
                    </div>
                </fieldset>
            `);
        }).fail(function(error) {
            console.log('Updating exercise failed!');
        });
    });
}
showEditExerciseForm();


function putExerciseEdits() {
    $('.edit-exercise-form').on('click', '.put-exercise-btn', event => {
        event.preventDefault();

        let empty = false;
        $('.edit-exercise-form .req').each(function() {
            if ($(this).val() == "") {
                empty = true;
            }
        });
        if (empty) {
            $(this).prop('disabled', 'disabled');
            $('.put-edit-exercise-alert').removeClass('hidden');
        } else {
            $(this).removeProp('disabled');
            if (!$('.put-edit-exercise-alert').hasClass('hidden')) {
                $('.put-edit-exercise-alert').addClass('hidden');
            }
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
                    $('.popdown-edit-exercise').addClass('hidden');
                    getAllExercises();
                })
                .fail(function(error) {
                    console.log('Updating exercise failed!');
                })
        }
    })
}
putExerciseEdits();


function cancelExerciseEdit() {
    $('.edit-exercise-form').on('click', '.cancel-exercise-btn', event => {
        $('.popdown-edit-exercise').addClass('hidden');
        if (!$('.put-edit-exercise-alert').hasClass('hidden')) {
            $('.put-edit-exercise-alert').addClass('hidden');
        }
    });
}
cancelExerciseEdit();


function getSelectedExercises() {
    $('.dayplan-exercise-get').on('click', event => {
        event.preventDefault();
        let ID = $(":checkbox:checked").val();
        let checked = $(":checkbox:checked");

        let exercisesIDs = [];
        for (let i = 0; i < checked.length; i++) {
            exercisesIDs.push(checked[i].value);
        }
        dayplanFormObject.exercisesIDs = exercisesIDs;
        $('.exercise-container').addClass('hidden');
        $('.fitplan-modal-btns').removeClass('hidden');
    })
}
getSelectedExercises();


function cancelDayPlanThree() {
    $('.exercise-list-container').on('click', '#cancel-dayplan-progress-button', event => {
        event.preventDefault();

        $('[data-popup="popup-post-dayplan"]').fadeOut(350);

        $('.category-container input').each(function() {
            $(this).prop('checked', false);
        });
        $('.post-activity-form').find('input:text').val('');
        $('.exercise-list-container input').each(function() {
            $(this).prop('checked', false);
        });
        $('.exercise-container').addClass('hidden');
        $('.activity-container').addClass('hidden');
        $('.category-section').removeClass('hidden');

    });
}
cancelDayPlanThree();


function cancelDayPlanFinal() {
    $('.fitplan-modal-btns').on('click', '#cancel-dayplan-button', event => {
        event.preventDefault();

        $('[data-popup="popup-post-dayplan"]').fadeOut(350);

        $('.category-container input').each(function() {
            $(this).prop('checked', false);
        });
        $('.post-activity-form').find('input:text').val('');
        $('.exercise-list-container input').each(function() {
            $(this).prop('checked', false);
        });
        $('.fitplan-modal-btns').addClass('hidden');
        $('.exercise-container').addClass('hidden');
        $('.activity-container').addClass('hidden');
        $('.category-section').removeClass('hidden');
    });
}
cancelDayPlanFinal();


/***   D A Y    P L A N  ***/

function createDayPlan() {
    $.ajax({
            type: 'POST',
            contentType: 'application/json',
            url: 'dayplan/new/' + localStorage.getItem('token'),
            data: JSON.stringify(dayplanFormObject)
        })
        .done(function(dayplan) {
            getUserWeek(dayplan);
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
            showDayPlan(week);
            showCategoryImgInDayCntnr(week);
            hideAddIconInDayCntnr(week);
        })
        .fail(function(error) {
            console.log('Post new day plan failed!');
        })
}


function showCategoryImgInDayCntnr(week) {
    let days = $('.day-container');

    let fitweek = week.data;

    for (let i = 0; i < fitweek.length; i++) {
        let daycontainer = $(days[fitweek[i].day]);

        let containerImg = daycontainer.children('.day-category-img');
        containerImg.html(`
        <img class="day-container-img" src=${fitweek[i].categoryID.img} alt="category icon"/>
        <p class="day-container-cat-name">${fitweek[i].categoryID.name}</p>
    `)

        let addFitPlan = daycontainer.children('.add-day-plan-btn');
        addFitPlan.addClass('hidden');

    }
}


function hideAddIconInDayCntnr(week) {
    let days = $('.day-container');
    let fitweek = week.data;

    for (let i = 0; i < fitweek.length; i++) {
        let daycontainer = $(days[fitweek[i].day]);
        let addFitPlan = daycontainer.children('.add-day-plan-btn');
        addFitPlan.hide();

        if (daycontainer.length == 0) {
            let addFitPlan = daycontainer.children('.add-day-plan-btn');
            addFitPlan.show();
        }
    }
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


function findDay(week, day) {
    for (let i = 0; i < week.data.length; i++) {
        if (week.data[i].day == day) {
            return week.data[i]
        }
    }
}


function showDayPlan(week) {
    $('.day-container').on('click', '.view-icon', event => {
        event.preventDefault();
        let day = $(event.target).attr('value');

        const dayFound = findDay(week, day);

        if (dayFound === undefined) {
            $('.unique-dayplan-results').html(`<p>${noPlanMsg[day]}</p>`);
        } else {
            displayDayPlan(dayFound);
            displayDayPlanExercisesResults(dayFound);
        }
    })
}

function displayDayPlan(dayFound) {
    $('.unique-dayplan-results').html('');
    $('.unique-dayplan-results').html(`
        <button type="submit" class="delete-dayplan-btn" value="${dayFound._id}"><img class="delete-icon" src="https://i.imgur.com/mUiBG7a.png"/></button>
        <p class="dp-rslts"><i class="fas fa-bullseye icon"></i> &nbsp;&nbsp;<span class="rslt">${dayFound.activityID.name}</span></p>
        <p class="dp-rslts"><i class="fas fa-clock icon"></i> &nbsp;&nbsp;<span class="rslt">${dayFound.activityID.time}</span></p>
        <p class="dp-rslts"><i class="fas fa-stopwatch icon"></i> &nbsp;&nbsp;<span class="rslt">${dayFound.activityID.duration}</span></p>
        <p class="dp-rslts"><i class="fas fa-map-marker-alt icon"></i> &nbsp;&nbsp;<span class="rslt">${dayFound.activityID.location}</span></p>
        <p class="dp-rslts"><i class="fas fa-road icon"></i> &nbsp;&nbsp;<span class="rslt">${dayFound.activityID.cardio.distance}</span></p>
        <p class="dp-rslts"><i class="fas fa-lightbulb icon"></i> &nbsp;&nbsp;<span class="rslt">${dayFound.activityID.inspiration}</span></p>
        <div class="exercise-results-list-container">
            <table class="exercise-results-table" cellspacing="0" cellpadding="0">
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
       `);
}


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
        $.ajax({
            url: `dayplan/${ID}/` + localStorage.getItem('token'),
            type: 'DELETE'
        }).done((dayplan) => {
            window.location.reload();
        }).fail((error) => {
            console.log('Deleting day plan failed!');
        })
    });
}
deleteDayPlan();


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
