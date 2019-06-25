let mainRows = document.querySelectorAll(".main-row");
let descriptionRows = document.querySelectorAll(".description-row");
let applyButtons = document.querySelectorAll(".apply");

mainRows.forEach(row => {
	// If user clicks on row, display the description.
	// If the description is already being displayed when clicked, hide the description.
	row.onclick = () => {
		if(row.nextElementSibling.style.display !== "table-row"){
			row.nextElementSibling.style.display = "table-row";
		}
		else {
			row.nextElementSibling.style.display = "none";
		}  
	};
});

applyButtons.forEach(button => {
	// stop description opening when user clicks apply button
	button.onclick = () => {
		event.stopPropagation();
	};
});