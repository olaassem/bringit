$.get('/activity/all', (allActivities) => {
	console.log(allActivities);
	allActivities.data.forEach( (activity) =>{
		document.write(activity.name);
	})
})

