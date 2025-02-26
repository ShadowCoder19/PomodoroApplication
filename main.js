let countDownTimer = null; // Timer variable

document.getElementById('pomodoroTimerStart').addEventListener('click', startTimer);
document.getElementById('pomodoroTimerPause').addEventListener('click', pauseTimer);
document.getElementById('pomodoroTimerReset').addEventListener('click', resetTimer);
document.getElementById('addTaskButton').addEventListener('click', addTask);

let timeLeft = 0;
let isPaused = false;
let isWorkTimer = true;

function startTimer() {
    const workDurationInput = document.getElementById('pomodoroSettingsWorkDuration').value;
    const breakDurationInput = document.getElementById('pomodoroSettingsBreakDuration').value;

    const workDuration = parseInt(workDurationInput) * 60; // Convert to seconds
    const breakDuration = parseInt(breakDurationInput) * 60; // Convert to seconds

    if (isWorkTimer) {
        timeLeft = workDuration;
    } else {
        timeLeft = breakDuration;
    }

    if (countDownTimer === null) {
        countDownTimer = setInterval(updateTimer, 1000);
    }
    isPaused = false;
}

function pauseTimer() {
    isPaused = true;
}

function resetTimer() {
    clearInterval(countDownTimer);
    countDownTimer = null;
    const workDurationInput = document.getElementById('pomodoroSettingsWorkDuration').value;
    const workDuration = parseInt(workDurationInput) * 60; // Convert to seconds
    timeLeft = workDuration; // Reset to work duration
    isWorkTimer = true;
    updateDisplay();
}

function updateTimer() {
    if (!isPaused) {
        if (timeLeft > 0) {
            timeLeft--;
            updateDisplay();
        } else {
            clearInterval(countDownTimer);
            countDownTimer = null;
            if (isWorkTimer) {
                alert("Work time is over! Starting break time.");
                isWorkTimer = false;
                startTimer();
            } else {
                alert("Break time is over! Starting work time.");
                isWorkTimer = true;
                startTimer();
            }
        }
    }
}

function updateDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    document.getElementById('pomodoroClock').textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

// To-Do List Functions
function saveTasks(tasks) {
    console.log('Saving tasks:', tasks); // Debug log
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
    console.log('loadTasks function called'); // Debug log
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    console.log('Loading tasks:', tasks); // Debug log
    tasks.forEach(task => {
        addTaskToDOM(task.text, task.completed);
    });
}

function addTaskToDOM(text, completed = false) {
    const taskList = document.getElementById('taskList');
    const listItem = document.createElement('li');
    
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = completed;
    checkbox.addEventListener('change', () => {
        listItem.classList.toggle('completed');
        saveTasks(getTasksFromDOM());
    });

    listItem.appendChild(checkbox);
    listItem.appendChild(document.createTextNode(text));
    taskList.appendChild(listItem);
}

function getTasksFromDOM() {
    const tasks = [];
    document.querySelectorAll('#taskList li').forEach(taskItem => {
        const checkbox = taskItem.querySelector('input[type="checkbox"]');
        const label = taskItem.textContent;
        tasks.push({ text: label, completed: checkbox.checked });
    });
    return tasks;
}

function addTask() {
    const taskInput = document.getElementById('newTaskInput');
    const taskText = taskInput.value.trim();
    if (taskText !== "") {
        addTaskToDOM(taskText);
        saveTasks(getTasksFromDOM());
        taskInput.value = "";
    }
}

function clearTasks() {
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = "";
    localStorage.removeItem('tasks');
}

document.getElementById('clearTasksButton').addEventListener('click', clearTasks);

document.addEventListener('DOMContentLoaded', (event) => {
    console.log('DOM fully loaded and parsed'); // Debug log
    loadTasks();
});

// Initialize display
updateDisplay();