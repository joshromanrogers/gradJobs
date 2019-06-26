module.exports = function findCategories(job) {
	// array of different possible categories
	let categoriesArray = ['javascript', 'recruitment', 'property', 'teaching', 
		'analyst', 'finance', 'sales', 'human resources', 'accountant', 'admin', 
		'banking', 'education', 'marketing', 'health', 'medicine', 'media', 'retail',
		'java', 'c++', 'c', 'angular', 'python'];

	// title to lower case and then split words into an array
	let jobTitleWords = jobTitle.toLowerCase().split(" ");
    
	// only keep the words that are in the categories array
	let jobCategories = jobTitleWords.filter( item => {
		return categoriesArray.includes(item);
	});
};