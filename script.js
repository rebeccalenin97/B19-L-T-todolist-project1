$(document).ready(function () {
  // Load tasks from localStorage
  let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

  // Filter out any existing "hello" tasks on load
  tasks = tasks.filter(task => task.text.toLowerCase() !== 'hello');
  saveTasks();

  // Render tasks on page load
  renderTasks('All');

  // Add task
  $('#taskForm').on('submit', function (e) {
    e.preventDefault();
    const taskText = $('#taskInput').val().trim();
    const taskCategory = $('#taskCategory').val();
    const taskDueDate = $('#taskDueDate').val();

    // Validate input
    if (taskText === '' || taskText.toLowerCase() === 'hello') {
      alert('Please enter a valid task (not "hello").');
      return;
    }

    const task = {
      id: Date.now(),
      text: taskText,
      category: taskCategory,
      dueDate: taskDueDate, // Store due date
      completed: false
    };

    tasks.push(task);
    saveTasks();
    renderTasks($('.nav-link.active').data('category'));
    $('#taskInput').val('');
    $('#taskDueDate').val('');
  });

  // Category tab click
  $('#categoryTabs .nav-link').on('click', function (e) {
    e.preventDefault();
    $('#categoryTabs .nav-link').removeClass('active');
    $(this).addClass('active');
    renderTasks($(this).data('category'));
  });

  // Toggle task completion
  $('#taskList').on('click', '.cute-icon', function () {
    const taskId = $(this).data('id');
    tasks = tasks.map(task => {
      if (task.id === taskId && !task.completed) {
        // Trigger confetti when marking as complete
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#f06292', '#4dd0e1', '#e1bee7'] // Pastel pink, cyan, purple
        });
        return { ...task, completed: !task.completed };
      }
      return task.id === taskId ? { ...task, completed: !task.completed } : task;
    });
    saveTasks();
    renderTasks($('.nav-link.active').data('category'));
  });

  // Delete task
  $('#taskList').on('click', '.delete-btn', function () {
    const taskId = $(this).data('id');
    tasks = tasks.filter(task => task.id !== taskId);
    saveTasks();
    renderTasks($('.nav-link.active').data('category'));
  });

  // Clear all tasks
  $('#clearTasksBtn').on('click', function () {
    if (confirm('Are you sure you want to clear all tasks?')) {
      tasks = [];
      saveTasks();
      renderTasks($('.nav-link.active').data('category'));
    }
  });

  // Save tasks to localStorage
  function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }

  // Render tasks based on category
  function renderTasks(category) {
    $('#taskList').empty();
    let filteredTasks = tasks;

    if (category !== 'All') {
      filteredTasks = tasks.filter(task => task.category === category);
    }

    if (filteredTasks.length === 0) {
      $('#noTasksMessage').removeClass('d-none');
    } else {
      $('#noTasksMessage').addClass('d-none');
      filteredTasks.forEach(task => {
        // Check if task is overdue
        const isOverdue = task.dueDate && !task.completed && new Date(task.dueDate) < new Date();
        const taskHtml = `
          <li class="list-group-item task-item ${isOverdue ? 'overdue' : ''}">
            <span class="cute-icon" data-id="${task.id}" role="button" aria-label="${task.completed ? 'Mark as incomplete' : 'Mark as complete'}">
              ${task.completed ? '💖' : '❤️'}
            </span>
            <span class="task-text">${task.completed ? 'Hurraaay!' : task.text}</span>
            <span class="task-category">(${task.category})</span>
            ${task.dueDate ? `<span class="task-due-date">Due: ${task.dueDate}</span>` : ''}
            <button class="btn btn-danger btn-sm delete-btn" data-id="${task.id}">Delete</button>
          </li>
        `;
        $('#taskList').append(taskHtml);
      });
    }
  }
});