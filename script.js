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


let quoteContainer = document.querySelector('.motivation-fullpage .motivational-container .motivation-wrapper .motivation-2 h2');
let authorContainer = document.querySelector('.motivation-fullpage .motivational-container .motivation-wrapper .motivation-3 h2');
async function motivationQuotes(){
    let response = await fetch('https://dummyjson.com/quotes/random');
    let data = await response.json();
    quoteContainer.innerHTML = data.quote
    authorContainer.innerHTML = data.author
}
motivationQuotes();




let timeContainer = document.querySelector('.pomodomo-timer-fullpage .pomodomo-container h1');
let startBtn = document.querySelector('.pomodomo-timer-fullpage .pomodomo-container .start-timer');
let pauseBtn = document.querySelector('.pomodomo-timer-fullpage .pomodomo-container .pause-timer');
let resetBtn = document.querySelector('.pomodomo-timer-fullpage .pomodomo-container .reset-timer');
let session = document.querySelector('.pomodomo-timer-fullpage .pomodomo-container h2');
let myTimeInterval;
let isStudy = true;
let totalSecond = 25 * 60;

function pomodomo(){
    function updateTimer(){
        let minutes = String(Math.floor(totalSecond / 60));
        let seconds = String(totalSecond % 60);
        timeContainer.innerHTML = `${minutes.padStart(2,"0")}:${seconds.padStart(2,"0")}`;
    }
    updateTimer();

    function startTimer(){
        clearInterval(myTimeInterval);
        myTimeInterval = setInterval(() => {
            if(totalSecond > 0){
                totalSecond--;
                updateTimer();
            }
            else{
                clearInterval(myTimeInterval);
                
                if(isStudy){
                    isStudy = false;
                    totalSecond = 5 * 60;
                    startBtn.innerHTML = "Start";
                    session.innerHTML = 'Take a Break';
                    session.style.backgroundColor = 'rgb(46, 139, 87)';
                }
                else{
                    isStudy = true;
                    totalSecond = 25 * 60;
                    startBtn.innerHTML = "Start";
                    session.innerHTML = 'Work Session';
                    session.style.backgroundColor = 'rgb(175, 175, 23)';
                }
                setTimeout( () =>{
                    updateTimer();
                },500);
            }
        }, 1000);
        startBtn.innerHTML = "Running";
    }

    function pauseTimer(){
        clearInterval(myTimeInterval);
        startBtn.innerHTML = "Resume";
    }

    function resetTimer(){
        clearInterval(myTimeInterval);
        isStudy = true;
        totalSecond = 25 * 60;
        startBtn.innerHTML = "Start";
        updateTimer();
    }

    startBtn.addEventListener('click', startTimer);
    pauseBtn.addEventListener('click', pauseTimer);
    resetBtn.addEventListener('click', resetTimer);
}
pomodomo();




const goalsList = document.getElementById('goals-list');
const progressElem = document.getElementById('progress');
const progressPercent = document.getElementById('progress-percent');
const addGoalBtn = document.getElementById('addGoalBtn');

function dailyGoal(){
    let goals = JSON.parse(localStorage.getItem('dailyGoals')) || [
      { text: 'Learn JavaScript', status: 'completed' },
      { text: 'Workout', status: 'pending' },
      { text: 'Read Book', status: 'failed' },
    ];

    function saveGoals() {
    localStorage.setItem('dailyGoals', JSON.stringify(goals));
    }

    function updateProgress() {
        const totalGoals = goals.length;
        const completedGoals = goals.filter(goal => goal.status === 'completed').length;
        const progress = totalGoals === 0 ? 0 : Math.round((completedGoals / totalGoals) * 100);
        progressElem.style.width = progress + '%';
        progressPercent.textContent = progress + '%';
        }
        function renderGoals() {
            goalsList.innerHTML = '';
            goals.forEach((goal, index) => {
                const goalDiv = document.createElement('div');
                goalDiv.className = `goal ${goal.status}`;
                goalDiv.innerHTML = `
                    <span>${goal.status === 'completed' ? '✅<sup>Complete</sup>' : goal.status === 'pending' ? '⏳<sup>Pending</sup>' : '❌<sup>Delete</sup>'} ${goal.text}</span>
                    <button class="status-btn" data-index="${index}" data-status="completed">✅</button>
                    <button class="status-btn" data-index="${index}" data-status="pending">⏳</button>
                    <button class="status-btn" data-index="${index}" data-status="failed">❌</button>
                    <button class="delete-btn" data-index="${index}">🗑️</button>
                `;
                goalsList.appendChild(goalDiv);
            });
            updateProgress();
        }
        function addGoal(text) {
            goals.push({ text: text, status: 'pending' });
            saveGoals();
            renderGoals();
        }
        document.getElementById('addGoalBtn').addEventListener('click', () => {
            const goalText = prompt('Enter your goal:');
            if (goalText) {
                addGoal(goalText);
        }
    });
    goalsList.addEventListener('click', (e) => {
        if (e.target.classList.contains('status-btn')) {
            const index = e.target.dataset.index;
            const status = e.target.dataset.status;
            goals[index].status = status;
            saveGoals();
            renderGoals();
        } else if (e.target.classList.contains('delete-btn')) {
            const index = e.target.dataset.index;
            goals.splice(index, 1);
            saveGoals();
            renderGoals();
        }
    });
    renderGoals();
}
dailyGoal();

