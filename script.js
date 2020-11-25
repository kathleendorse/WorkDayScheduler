$(document).ready(function(){

//----------------------------------------------------------------    
    //variables to reference dom elements    
    var currentDay = $("#currentDay");
    var textArea = $("textarea");
    var saveBtn = $(".saveBtn");
    var hourText = $(".hourText");

//----------------------------------------------------------------
    //Setting & Updating the Current Day 
    currentDay.html(moment().format('MMMM Do YYYY, h:mm:ss a'));
    
    setInterval(()=>{
        currentDay.html(moment().format('MMMM Do YYYY, h:mm:ss a'));
    }, 1000);

//----------------------------------------------------------------
    //Conditional Color Formatting for Hour Text Input
    const conditionalFormatting =()=>{
        var timeNow = moment().format();
        var currentTime = moment(timeNow);

        hourText.each(function(){
            var hourTextValue = $(this).text();
            var hourTextTime = moment(hourTextValue, ["h a"]);
            var hourTextTimeExtra = moment(hourTextTime).add(1, "hour").format();

            if(currentTime.isBefore(hourTextTime)){
                var textCol = this.parentElement.nextElementSibling;
                textCol.classList.remove("past", "present", "future");
                textCol.classList.add("future");
            }
            else if(currentTime.isBetween(hourTextTime, hourTextTimeExtra)){
                var textCol = this.parentElement.nextElementSibling;
                textCol.classList.remove("past", "present", "future");
                textCol.classList.add("present");

            }
            else{
                var textCol = this.parentElement.nextElementSibling;
                textCol.classList.remove("past", "present", "future");
                textCol.classList.add("past");                 
            }
        });
    }

//----------------------------------------------------------------    
    //On Click Event Handler 
    function butonClick(){
        var noteId = "text"+this.id;
        console.log(noteId);
        handleStorage(noteId);
    }
    
//----------------------------------------------------------------
    //Add Notes to Local Storage
    const handleStorage=(noteId)=>{
        let schedule = [];

        if (localStorage.getItem("scheduleStorage")===null) {
            schedule;
        }
        else {
            schedule = JSON.parse(localStorage.getItem("scheduleStorage"));
        }
        let idCheck = schedule.find(schedule => schedule.hour === noteId);
        if (idCheck) {
            let update = schedule.map((schedule)=> { return schedule.hour; }).indexOf(noteId);
            let updateNote = {
                hour: noteId,
                details: document.getElementById(noteId).value.trim()
            };
            schedule.splice(update, 1, updateNote);
        }
        else {
            let newNote = {
                hour: noteId,
                details: document.getElementById(noteId).value.trim()
            };
            schedule.push(newNote);
        }
        localStorage.setItem("scheduleStorage", JSON.stringify(schedule));
    }

//----------------------------------------------------------------
    //Display notes saved in local storage
    const displayNotes=()=>{
        textArea.each(function(){
            let noteId = this.id;
            let schedule = [];
            if (localStorage.getItem("scheduleStorage") === null) {
                schedule;
            }
            else{
                schedule = JSON.parse(localStorage.getItem("scheduleStorage"));
            }
            let findId = schedule.find(schedule => schedule.hour === noteId);
            
            if(findId){
                let update = schedule.map((schedule)=>{return schedule.hour}).indexOf(noteId);
                let toDisplay = schedule[update].details;
                document.getElementById(noteId).value = toDisplay;
            }
            else{
                return;
            }
        });
    };

//----------------------------------------------------------------    
    //Invoking functions
    saveBtn.on("click", butonClick);
    conditionalFormatting();
    displayNotes();

});