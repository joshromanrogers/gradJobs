let mainRows = document.querySelectorAll(".main-row");
let descriptionRows = document.querySelectorAll(".description-row");

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
