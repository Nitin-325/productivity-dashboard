let allElem = document.querySelectorAll('.elem');
let fullElem = document.querySelectorAll('.fullElem');
let fullElemBackButton = document.querySelectorAll('.fullElem .back');

function openPages(){
    allElem.forEach(function(elem){
        elem.addEventListener('click', () => {
            setTimeout(() => {
                fullElem[elem.id].style.display = 'block';
            },200);
        })
    })
    fullElemBackButton.forEach(function(back){
        back.addEventListener('click', () => {
            fullElem[back.id].style.display = 'none';
        })
    })
}
openPages();



let form = document.querySelector('.todo-list-fullpage .todo-container .addTask form')
let taskInput = document.querySelector('.todo-list-fullpage .todo-container .addTask form input')
let taskDetails = document.querySelector('.todo-list-fullpage .todo-container .addTask form textarea')
let allTask = document.querySelector('.todo-list-fullpage .todo-container .allTask')
let checkBox = document.querySelector('.todo-list-fullpage .todo-container .mark-imp #check')
let currentTask = JSON.parse(localStorage.getItem('currentTask')) || [];

function renderTasks(){

    let clutter = "";

    let sortedTasks = currentTask
        .map((task,index)=> ({...task, originalIndex:index}))
        .sort((a,b)=> b.important - a.important);

    sortedTasks.forEach((elem) => {

        clutter += `
        <div class="task" data-id="${elem.originalIndex}">
            <div class="info">
                <h5>
                    ${elem.task}
                    ${elem.important ? '<span class="imp-tag">IMP</span>' : ''}
                </h5>
                <span>${elem.details}</span>
            </div>
            <button class="mark-as-complete">Mark as Completed</button>
        </div>`;

    });

    allTask.innerHTML = clutter;
}


function addNewTask(){

    form.addEventListener('submit', (e)=>{

        e.preventDefault();

        if(taskInput.value === "" || taskDetails.value === ""){

            taskInput.style.backgroundColor = "red";
            taskDetails.style.backgroundColor = "red";

            setTimeout(()=>{
                taskInput.style.backgroundColor = "var(--primary)";
                taskDetails.style.backgroundColor = "var(--primary)";
            },2000)

            return;
        }

        currentTask.push({
            task: taskInput.value,
            details: taskDetails.value,
            important: checkBox.checked   // ⭐ important flag
        });

        localStorage.setItem("currentTask", JSON.stringify(currentTask));

        renderTasks();

        taskInput.value = "";
        taskDetails.value = "";
        checkBox.checked = false;

    })

}


function deleteTask(){

    allTask.addEventListener("click",(e)=>{

        if(e.target.classList.contains("mark-as-complete")){

            let taskDiv = e.target.closest(".task");
            let index = Number(taskDiv.dataset.id);

            let confirmDelete = confirm("Are you sure you completed this task?");

            if(confirmDelete){

                currentTask.splice(index,1);

                localStorage.setItem("currentTask", JSON.stringify(currentTask));

                renderTasks();

            }
        }

    })

}

renderTasks();
addNewTask();
deleteTask();


function dailyPlanner(){

    let clutter = "";
    const dayPlanner = document.querySelector(".daily-planner-fullpage .day-planner");

    // CREATE TIME BLOCKS
    for(let i = 6; i <= 23; i++){

        let startHour = i % 12 || 12;
        let endHour = (i + 1) % 12 || 12;

        let startAmPm = i < 12 ? "AM" : "PM";
        let endAmPm = (i + 1) < 12 ? "AM" : "PM";

        let timeRange = `${startHour}:00 ${startAmPm} - ${endHour}:00 ${endAmPm}`;

        clutter += `
            <div class="day-planner-time" data-time="${timeRange}">
                <p>${timeRange}</p>
                <input class="planMes" type="text" placeholder="...">
                <span><i class="ri-close-fill"></i></span>
            </div>
        `;
    }

    dayPlanner.innerHTML = clutter;


    // LOAD SAVED DATA
    let savedPlans = JSON.parse(localStorage.getItem("dailyPlanner")) || {};

    document.querySelectorAll(".planMes").forEach((input)=>{

        let container = input.closest(".day-planner-time");
        let time = container.dataset.time;

        if(savedPlans[time]){
            input.value = savedPlans[time];
        }

    });


    const plannerPanel = document.querySelector('.daily-planner-fullpage .day-planner');


    // SAVE DATA WHEN USER TYPES
    plannerPanel.addEventListener("input",(e)=>{

        if(e.target.classList.contains("planMes")){

            let container = e.target.closest(".day-planner-time");
            let time = container.dataset.time;

            let savedPlans = JSON.parse(localStorage.getItem("dailyPlanner")) || {};

            savedPlans[time] = e.target.value;

            localStorage.setItem("dailyPlanner", JSON.stringify(savedPlans));

        }

    });


    // CLEAR INPUT + REMOVE FROM STORAGE
    plannerPanel.addEventListener("click",(e)=>{

        if(e.target.closest("span")){

            let planContainer = e.target.closest(".day-planner-time");
            let inputBox = planContainer.querySelector("input");

            let time = planContainer.dataset.time;

            inputBox.value = "";

            let savedPlans = JSON.parse(localStorage.getItem("dailyPlanner")) || {};

            delete savedPlans[time];

            localStorage.setItem("dailyPlanner", JSON.stringify(savedPlans));

        }

    });

}

dailyPlanner();

