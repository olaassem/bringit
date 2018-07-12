//<button type="submit" class="edit-dayplan-btn" value="${dayFound._id}" data-popup-open="popup-edit-dayplan"><img class="edit-icon" src="https://i.imgur.com/1V60b8V.png"/></button>


// function openEditDayPlanModal() {
//     $('.unique-dayplan-results').on('click', '.edit-dayplan-btn', event => {
//         event.preventDefault();
//
//         $('[data-popup="popup-edit-dayplan"]').fadeIn(350);
//         let ID = $(event.currentTarget).attr("value");
//         $.ajax({
//             url: `dayplan/${ID}/` + localStorage.getItem('token'),
//             type: 'GET'
//         }).done(function(dayplan) {
//             $('.edit-dayplan-form').html(`
//                 <fieldset>
//                     <legend><span class="dayoftheweek"></span>Fit Plan</legend>
//                     <div class="edit-dayplan-category-section">
//                         <p class="step"> Step 1/3 </p>
//                         <h2>Category<button type="submit" class="btn popdown-post-category"><img class="add-icon" src="https://i.imgur.com/oH9oPor.png" alt="add icon"/></button></h2>                        <!--category section-->
//                         <div class="row">
//                             <div class="col-12">
//                                 <div class="edit-dayplan-new-category-form hidden">
//                                     <form role="form" class="post-category-form" novalidate>
//                                         <fieldset>
//                                             <legend>Add New Category</legend>
//                                             <label for="category-name">Name<span class="required">*</span></label>
//                                             <input id="category-name" type="text" placeholder="e.g. Climbing" />
//                                             </br>
//                                             <label for="category-img">Image<span class="required">*</span></label>
//                                             <input id="category-img" type="text" placeholder="URL" />
//                                             </br>
//                                             <div>
//                                                 <p class="alert edit-dayplan-new-category-form-alert hidden"><i class="fas fa-exclamation-triangle"></i>&nbsp; Please add a category name &amp; image url</p>
//                                             </div>
//                                             <div class="row">
//                                                 <div class="col-6">
//                                                     <button type="submit" class="edit-dayplan-post-category-btn">Add</button>
//                                                 </div>
//                                                 <div class="col-6">
//                                                     <button type="submit" class="edit-dayplan-cancel-post-category-btn">Cancel</button>
//                                                 </div>
//                                             </div>
//                                         </fieldset>
//                                     </form>
//                                 </div>
//                             </div>
//                         </div>
//                         <div class="edit-dayplan-category-icons"></div>
//                         <div class="row">
//                             <div class="col-12">
//                                 <div class="row">
//                                     <div class="col-6">
//                                         <button type="submit" class="edit-dayplan-category-get next">Next</button>
//                                     </div>
//                                     <div class="col-6">
//                                         <button type="submit" id="cancel-edit-dayplan-progress-button" data-popup-close="popup-post-dayplan">Cancel</button>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                     <!--end of category section-->
//                     <!--activity section-->
//                     <div class="row">
//                         <div class="col-12">
//                             <div class="edit-dayplan-activity-container hidden">
//                                 <form role="form" class="edit-dayplan-post-activity-form" novalidate>
//                                     <p class="step"> Step 2/3 </p>
//                                     <h2>Activity</h2>
//                                     <fieldset>
//                                         <legend>Edit Activity Info</legend>
//                                         <label for="activity-name">Name<span class="required">*</span></label>
//                                         <input id="activity-name" class="req-edit" type="text" value="${dayplan.data.activityID.name}" />
//                                         </br>
//                                         <label for="activity-time">Time<span class="required">*</span></label>
//                                         <input id="activity-time" class="req-edit" type="text" value="${dayplan.data.activityID.time}" />
//                                         </br>
//                                         <label for="activity-duration">Duration<span class="required">*</span></label>
//                                         <input id="activity-duration" class="req-edit" type="text" value="${dayplan.data.activityID.duration}" />
//                                         </br>
//                                         <label for="cardio-distance">Cardio Distance</label>
//                                         <input id="cardio-distance" type="text" value="${dayplan.data.activityID.cardio.distance}" />
//                                         </br>
//                                         <label for="activity-location">Location</label>
//                                         <input id="activity-location" type="text" value="${dayplan.data.activityID.location}"" />
//                                         </br>
//                                         <label for="activity-inspiration">Inspiration</label>
//                                         <input id="activity-inspiration" type="text" value="${dayplan.data.activityID.inspiration}" />
//                                         <div>
//                                             <p class="alert post-edit-dayplan-activity-alert hidden"><i class="fas fa-exclamation-triangle"></i>&nbsp; Please add an activity title, time, &amp; duration.</p>
//                                         </div>
//                                         <div class="row">
//                                             <div class="col-12">
//                                                 <div class="row">
//                                                     <div class="col-6">
//                                                         <button type="submit" class="edit-dayplan-dayplan-activity-get next">Next</button>
//                                                     </div>
//                                                     <div class="col-6">
//                                                         <button type="submit" id="cancel-edit-dayplan-progress-button" data-popup-close="popup-post-dayplan">Cancel</button>
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     </fieldset>
//                                 </form>
//                             </div>
//                         </div>
//                     </div>
//                     <!--end of activity section-->
//                     <!--exercise section-->
//                     <div class="edit-dayplan-exercise-container hidden">
//                         <div class="row">
//                             <div class="col-12">
//                                 <p class="step"> Step 3/3 </p>
//                                 <h2>Exercises<button type="submit" class="btn popdown-post-exercise"><img class="add-icon" src="https://i.imgur.com/oH9oPor.png" alt="add icon"/></button></h2>
//                                 <div class="new-exercise-form hidden">
//                                     <form role="form" class="post-exercise-form" action="#" method="#">
//                                         <fieldset>
//                                             <legend>Add a New Exercise</legend>
//                                             </br>
//                                             <label for="exercise-name">Name<span class="required">*</span></label>
//                                             <input id="exercise-name" type="text" placeholder="e.g. Burpees" />
//                                             </br>
//                                             <label for="exercise-weight">Weight<span class="required"></span></label>
//                                             <input id="exercise-weight" type="text" placeholder="e.g. Body Weight" />
//                                             </br>
//                                             <label for="exercise-sets">Sets<span class="required">*</span></label>
//                                             <input id="exercise-sets" type="text" placeholder="e.g. 5" />
//                                             </br>
//                                             <label for="exercise-reps">Reps<span class="required">*</span></label>
//                                             <input id="exercise-reps" type="text" placeholder="e.g. 12" />
//                                             </br>
//                                             <div class="row">
//                                                 <div class="col-6">
//                                                     <button type="submit" class="post-exercise-btn">Add</button>
//                                                 </div>
//                                                 <div class="col-6">
//                                                     <button type="submit" class="cancel-exercise-btn">Cancel</button>
//                                                 </div>
//                                             </div>
//                                         </fieldset>
//                                     </form>
//                                 </div>
//                                 <div class="popdown-edit-exercise hidden">
//                                     <form role="form" class="edit-exercise-form" action="#" method="#"></form>
//                                 </div>
//                                 <div class="edit-dayplan-exercise-list-container">
//                                     <table class="edit-exercise-table" cellspacing="0" cellpadding="0">
//                                         <thread>
//                                             <tr>
//                                                 <th class="th-exercise-select" width="15%">Select</th>
//                                                 <th class="th-exercise-name" width="15%">Name</th>
//                                                 <th class="th-exercise-weight" width="15%">Weight</th>
//                                                 <th class="th-exercise-sets" width="15%">Sets</th>
//                                                 <th class="th-exercise-name" width="15%">Reps</th>
//                                                 <th class="th-exercise-edit" width="15%"></th>
//                                                 <th class="th-exercise-delete" width="15%"></th>
//                                             </tr>
//                                         </thread>
//                                         <tbody class="exercise-list">
//                                         </tbody>
//                                     </table>
//                                     <div class="row">
//                                         <div class="col-12">
//                                             <div class="row">
//                                                 <div class="col-6">
//                                                     <button type="submit" class="edited-dayplan-exercise-get next">Next</button>
//                                                 </div>
//                                                 <div class="col-6">
//                                                     <button type="submit" id="cancel-edit-dayplan-progress-button" data-popup-close="popup-post-dayplan">Cancel</button>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                     <!--end of exercise section-->
//                     <div class="edit-fitplan-modal-btns hidden">
//                         <div class="row">
//                           <div class="col-6">
//                                 <button type="submit" id="submit-edited-dayplan-button" data-popup-close="popup-post-dayplan" value="${dayplan.data._id}"><i class="fas fa-calendar-check"></i>&nbsp; Save Edits</button>
//                             </div>
//                             <div class="col-6">
//                                 <button type="submit" id="cancel-edit-dayplan-button" data-popup-close="popup-post-dayplan"><i class="fas fa-ban"></i>&nbsp; Cancel Edits</button>
//                             </div>
//                         </div>
//                     </div>
//                 </fieldset>
//              `);
//
//             getAllEditDayPlanCategories(dayplan);
//             revealNewCategoryFormEditDayPlan(dayplan);
//             postNewCategoryEditDayPlan(dayplan);
//             cancelNewCategoryEditDayPlan(dayplan);
//             deleteCategoryEditDayPlan(dayplan);
//             getSelectedCategoryEditDayPlan(dayplan);
//             cancelEditDayPlanOne(dayplan);
//
//             hideEditDayPlanActivitySection(dayplan);
//             cancelEditDayPlanTwo(dayplan);
//
//             getAllEditDayPlanExercises(dayplan);
//             showNewExerciseForm(dayplan);
//             showEditExerciseForm(dayplan);
//             postNewExercise(dayplan);
//             cancelNewExercise(dayplan);
//             deleteExerciseTable(dayplan);
//             showEditExerciseForm(dayplan);
//             putExerciseEdits(dayplan);
//             cancelExerciseEdit(dayplan);
//             getSelectedEditedExercises(dayplan);
//             cancelEditDayPlanThree(dayplan);
//             cancelEditDayPlanFinal(dayplan);
//         }).fail(function(error) {
//             console.log('Retrieving day plan details failed!');
//         });
//     });
// }
// openEditDayPlanModal();
//
//
// function getAllEditDayPlanCategories(dayplan) {
//     $.get('/category/all/' + localStorage.getItem('token'), (allCategories) => {
//         displayAllEditDayPlanCategories(dayplan.data.categoryID._id, allCategories);
//     });
// }
// getAllEditDayPlanCategories();
//
//
// function renderEditDayPlanCategories(selectedCategoryId, category) {
//     if (selectedCategoryId === category._id) {
//         return `
//         <div class="col-3">
//             <div class="edit-dayplan-category-container">
//                 <label for="${category.name}"><input checked type="radio" name="toggle-edit" id="${category.name}" value="${category._id}" style="background-image: url(http://i54.tinypic.com/4zuxif.jpg)"><img class="edit-dayplan-category-img" src="${category.img}" alt="${category.name} image" width="100px" height="100px"/><p>${category.name}</p></label>
//                 <button class="edit-delete-category-btn" value="${category._id}"><img class="delete-icon" src="https://i.imgur.com/mUiBG7a.png" alt="delete icon"/></button>
//             </div>
//         </div>
//     `
//     } else {
//         return `
//         <div class="col-3">
//             <div class="edit-dayplan-category-container">
//                 <label for="${category.name}"><input type="radio" name="toggle-edit" id="${category.name}" value="${category._id}" style="background-image: url(http://i54.tinypic.com/4zuxif.jpg)"><img class="edit-dayplan-category-img" src="${category.img}" alt="${category.name} image" width="100px" height="100px"/><p>${category.name}</p></label>
//                 <button class="edit-delete-category-btn" value="${category._id}"><img class="delete-icon" src="https://i.imgur.com/mUiBG7a.png" alt="delete icon"/></button>
//             </div>
//         </div>
//     `
//     }
// }
//
// function displayAllEditDayPlanCategories(selectedCategoryId, allCategories) {
//     let categoriesOutput = allCategories.data.map(category => renderEditDayPlanCategories(selectedCategoryId, category)).join('');
//     $('.edit-dayplan-category-icons').html(categoriesOutput);
// }
//
//
// function getSelectedCategoryEditDayPlan() {
//     $('.edit-dayplan-category-get').on('click', event => {
//         event.preventDefault();
//         let checked = $('input[name="toggle-edit"]:checked');
//         if (checked.length == 0) {
//             $(this).prop('disabled', 'disabled');
//         } else {
//             $(this).removeProp('disabled');
//             let ID = $('input[name="toggle-edit"]:checked').val();
//             dayplanFormObject.categoryID = ID;
//             $('.edit-dayplan-category-section').addClass('hidden');
//             $('.edit-dayplan-activity-container').removeClass('hidden');
//         }
//     })
// }
//
//
// function revealNewCategoryFormEditDayPlan() {
//     $('.popdown-post-category').on('click', event => {
//         event.preventDefault();
//         $('.edit-dayplan-new-category-form').removeClass('hidden');
//     });
// }
//
//
// function postNewCategoryEditDayPlan() {
//     $('.edit-dayplan-new-category-form').on('click', '.edit-dayplan-post-category-btn', event => {
//         event.preventDefault();
//         let empty = false;
//         $('.edit-dayplan-new-category-form input').each(function() {
//             if ($(this).val() == "") {
//                 empty = true;
//             }
//         });
//         if (empty) {
//             $(this).prop('disabled', 'disabled');
//             $('.edit-dayplan-new-category-form-alert').removeClass('hidden');
//         } else {
//             $(this).removeProp('disabled');
//             $('.edit-dayplan-new-category-form-alert').addClass('hidden');
//
//             let body = {
//                 'name': $('#category-name').val(),
//                 'img': $('#category-img').val(),
//                 'userID': localStorage.getItem('userID'),
//                 'token': localStorage.getItem('token')
//             }
//             $.ajax({
//                     type: "POST",
//                     contentType: 'application/json',
//                     url: '/category/new/' + localStorage.getItem('token'),
//                     data: JSON.stringify(body),
//                 })
//                 .done(function(data) {
//                     getAllEditDayPlanCategories(data);
//                     $('#category-name').val(''),
//                         $('#category-img').val(''),
//                         $('.edit-dayplan-new-category-form').addClass('hidden');
//                 })
//                 .fail(function(error) {
//                     console.log('Posting new category failed!')
//                 })
//         }
//     })
// }
//
//
// function cancelNewCategoryEditDayPlan() {
//     $('.edit-dayplan-new-category-form').on('click', '.edit-dayplan-cancel-post-category-btn', event => {
//         event.preventDefault();
//         $('.edit-dayplan-new-category-form').addClass('hidden');
//         $('.edit-dayplan-new-category-form').find("input[type=text]").val("");
//         if (!$('.edit-dayplan-new-category-form-alert').hasClass('hidden')) {
//             $('.edit-dayplan-new-category-form-alert').addClass('hidden');
//         }
//     });
// }
//
//
// function deleteCategoryEditDayPlan() {
//     $('.edit-dayplan-category-icons').on('click', '.edit-delete-category-btn', event => {
//         event.preventDefault();
//         let ID = $(event.currentTarget).attr("value");
//         $.ajax({
//             url: `/category/${ID}/` + localStorage.getItem('token'),
//             type: 'DELETE'
//         }).done((category) => {
//             console.log('category deleted');
//             getAllEditDayPlanCategories();
//         }).fail((error) => {
//             console.log('Deleting category failed!');
//         })
//     });
// }
//
//
// function cancelEditDayPlanOne() {
//     $('.edit-dayplan-category-section').on('click', '#cancel-edit-dayplan-progress-button', event => {
//         event.preventDefault();
//         $('[data-popup="popup-edit-dayplan"]').fadeOut(350);
//     });
// }
//
//
// function hideEditDayPlanActivitySection() {
//     $('.edit-dayplan-post-activity-form').on('click', '.edit-dayplan-dayplan-activity-get', event => {
//         event.preventDefault();
//
//         let empty = false;
//         $('.edit-dayplan-post-activity-form .req-edit').each(function() {
//             if ($(this).val() == "") {
//                 empty = true;
//             }
//         });
//         if (empty) {
//             $(this).prop('disabled', 'disabled');
//             $('.post-edit-dayplan-activity-alert').removeClass('hidden');
//         } else {
//             $(this).removeProp('disabled');
//             $('.post-dayplan-activity-alert').addClass('hidden');
//             $('.edit-dayplan-activity-container').addClass('hidden');
//             $('.edit-dayplan-exercise-container').removeClass('hidden');
//         }
//     });
// }
//
//
// function cancelEditDayPlanTwo() {
//     $('.edit-dayplan-post-activity-form').on('click', '#cancel-edit-dayplan-progress-button', event => {
//         event.preventDefault();
//         $('[data-popup="popup-edit-dayplan"]').fadeOut(350);
//
//         $('.edit-dayplan-category-container input').each(function() {
//             $(this).prop('checked', false);
//         });
//         $('.edit-dayplan-post-activity-form').find('input:text').val('');
//
//         $('.edit-dayplan-activity-container').addClass('hidden');
//         $('.edit-dayplan-category-section').removeClass('hidden');
//     });
// }
//
//
// function cancelEditDayPlanThree() {
//     $('.edit-dayplan-exercise-list-container').on('click', '#cancel-edit-dayplan-progress-button', event => {
//         event.preventDefault();
//
//         $('[data-popup="popup-edit-dayplan"]').fadeOut(350);
//
//         $('.edit-dayplan-category-container input').each(function() {
//             $(this).prop('checked', false);
//         });
//         $('.edit-dayplan-post-activity-form').find('input:text').val('');
//         $('.edit-dayplan-exercise-list-container input').each(function() {
//             $(this).prop('checked', false);
//         });
//         $('.edit-dayplan-exercise-container').addClass('hidden');
//         $('.edit-dayplan-activity-container').addClass('hidden');
//         $('.edit-dayplan-category-section').removeClass('hidden');
//
//     });
// }
//
//
// function cancelEditDayPlanFinal() {
//     $('.fitplan-modal-btns').on('click', '#cancel-edit-dayplan-button', event => {
//         event.preventDefault();
//
//         $('[data-popup="popup-edit-dayplan"]').fadeOut(350);
//
//         $('.edit-dayplan-category-container input').each(function() {
//             $(this).prop('checked', false);
//         });
//         $('.edit-dayplan-post-activity-form').find('input:text').val('');
//         $('.edit-dayplan-exercise-list-container input').each(function() {
//             $(this).prop('checked', false);
//         });
//         $('.fitplan-modal-btns').addClass('hidden');
//         $('.edit-dayplan-exercise-container').addClass('hidden');
//         $('.edit-dayplan-activity-container').addClass('hidden');
//         $('.edit-dayplan-category-section').removeClass('hidden');
//     });
// }
//
//
// function getSelectedEditedExercises() {
//     $('.edit-dayplan-form').on('click', '.edited-dayplan-exercise-get', event => {
//         event.preventDefault();
//         let ID = $(":checkbox:checked").val();
//         let checked = $(".edit-exercise-table input:checked");
//         let exercisesIDs = [];
//         for (let i = 0; i < checked.length; i++) {
//             exercisesIDs.push(checked[i].value);
//         }
//         dayplanFormObject.exercisesIDs = exercisesIDs;
//         $('.edit-dayplan-exercise-container').addClass('hidden');
//         $('.edit-fitplan-modal-btns').removeClass('hidden');
//     })
// }
//
//
// function getAllEditDayPlanExercises(dayplan) {
//     $.get('/exercise/all/' + localStorage.getItem('token'), (allExercises) => {
//         displayEditDayPlanExercises(dayplan.data.exercisesIDs, allExercises);
//     });
// }
//
// function isExcerciseSelected(selectedExercises, exercise) {
//     for (let i = 0; i < selectedExercises.length; i++) {
//         if (selectedExercises[i]._id === exercise._id) {
//             return true;
//         }
//     }
//     return false;
// }
//
//
// function renderEditDayPlanExercises(selectedExercises, exercise) {
//     if (isExcerciseSelected(selectedExercises, exercise)) {
//         return `
//               <tr class="exercise-rows">
//                 <td><input type="checkbox" checked id="select-exercise" value="${exercise._id}"></td>
//                 <td class="td-exercise-name" width="25%">${exercise.name}</td>
//                 <td class="td-exercise-weight" width="25%">${exercise.weight}</td>
//                 <td class="td-exercise-sets" width="25%">${exercise.sets}</td>
//                 <td class="td-exercise-reps" width="25%">${exercise.reps}</td>
//                 <td><button type="submit" class="edit-exercise-btn" value="${exercise._id}"><img class="edit-icon" src="https://i.imgur.com/1V60b8V.png"/></button></td>
//                 <td><button type="submit" class="delete-exercise-btn" value="${exercise._id}"><img class="delete-icon" src="https://i.imgur.com/mUiBG7a.png"/></button></td>
//               </tr>
//             `
//     }
//     return `
//           <tr class="exercise-rows">
//             <td><input type="checkbox" id="select-exercise" value="${exercise._id}"></td>
//             <td class="td-exercise-name" width="25%">${exercise.name}</td>
//             <td class="td-exercise-weight" width="25%">${exercise.weight}</td>
//             <td class="td-exercise-sets" width="25%">${exercise.sets}</td>
//             <td class="td-exercise-reps" width="25%">${exercise.reps}</td>
//             <td><button type="submit" class="edit-exercise-btn" value="${exercise._id}"><img class="edit-icon" src="https://i.imgur.com/1V60b8V.png"/></button></td>
//             <td><button type="submit" class="delete-exercise-btn" value="${exercise._id}"><img class="delete-icon" src="https://i.imgur.com/mUiBG7a.png"/></button></td>
//           </tr>
//         `
// }
//
//
// function displayEditDayPlanExercises(selectedExercises, allExercises) {
//     let exercisesOutput = allExercises.data.map(exercise => renderEditDayPlanExercises(selectedExercises, exercise)).join('');
//     $('.exercise-list').html(exercisesOutput);
// }
//
//
// function putEditedDayPlanActivity() {
//     $('.edit-dayplan-form').on('click', '#submit-edited-dayplan-button', event => {
//         event.preventDefault();
//         let ID = $(event.currentTarget).attr("value");
//
//         let body = {
//             'name': $('#activity-name').val(),
//             'time': $('#activity-time').val(),
//             'duration': $('#activity-duration').val(),
//             'cardio': {
//                 'distance': $('#cardio-distance').val()
//             },
//             'location': $('#activity-location').val(),
//             'inspiration': $('#activity-inspiration').val(),
//             '_id': `${ID}`
//         }
//         dayplanFormObject.activity = body;
//         dayplanFormObject.userID = localStorage.getItem('userID');
//         dayplanFormObject.token = localStorage.getItem('token');
//         putEditedDayPlan(ID);
//
//         $('.edit-dayplan-category-container input').each(function() {
//             $(this).prop('checked', false);
//         });
//         $('.edit-dayplan-post-activity-form').find('input:text').val('');
//         $('.edit-dayplan-exercise-list-container input').each(function() {
//             $(this).prop('checked', false);
//         });
//         $('.edit-fitplan-modal-btns').addClass('hidden');
//         $('.edit-dayplan-exercise-container').addClass('hidden');
//         $('.edit-dayplan-activity-container').addClass('hidden');
//         $('.edit-dayplan-category-section').removeClass('hidden');
//     });
// }
// putEditedDayPlanActivity();
//
//
// function putEditedDayPlan(ID) {
//     $.ajax({
//             type: 'PUT',
//             contentType: 'application/json',
//             url: `dayplan/${ID}/` + localStorage.getItem('token'), //_id
//             data: JSON.stringify(dayplanFormObject) //body
//         })
//         .done(function(dayplan) {
//             window.location.reload();
//         })
//         .fail(function(error) {
//             console.log('Updating day plan failed!');
//         })
// }
