import './styles.css';
import { Project } from './modules/project.js';
import { Storage } from './modules/storage.js';
import { UI } from './modules/ui.js';
import { Todo } from './modules/todo.js'; // Import Todo class

class TodoApp {
  constructor() {
    this.projects = [];
    this.currentProjectId = null;
    this.init();
  }

  init() {
    this.loadProjects();
    this.setupEventListeners();
    this.setupModalListeners();
    this.render();
  }

  loadProjects() {
    // Pass the classes as parameters to avoid circular imports
    const savedProjects = Storage.loadProjects(Project, Todo);
    if (savedProjects && savedProjects.length > 0) {
      this.projects = savedProjects;
      this.currentProjectId = this.projects[0].id;
    } else {
      // Create default project
      const defaultProject = new Project('Default Project');
      this.projects.push(defaultProject);
      this.currentProjectId = defaultProject.id;
      Storage.saveProjects(this.projects);
    }
  }

  setupEventListeners() {
    // Button event listeners
    document.getElementById('new-project-btn').addEventListener('click', () => {
      UI.showProjectForm();
    });

    document.getElementById('new-todo-btn').addEventListener('click', () => {
      UI.showTodoForm();
    });

    document.getElementById('add-checklist-item').addEventListener('click', () => {
      UI.addChecklistItem();
    });

    // Form submissions
    document.getElementById('project-form').addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleProjectFormSubmit();
    });

    document.getElementById('todo-form').addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleTodoFormSubmit();
    });

    // Custom events
    document.addEventListener('projectSelected', (e) => {
      this.currentProjectId = e.detail;
      this.render();
    });

    document.addEventListener('viewTodo', (e) => {
      UI.showTodoDetails(e.detail);
    });

    document.addEventListener('deleteTodo', (e) => {
      this.deleteTodo(e.detail);
    });
  }

  setupModalListeners() {
    // Close modals when clicking on X
    document.querySelectorAll('.close').forEach(closeBtn => {
      closeBtn.addEventListener('click', () => {
        const modal = closeBtn.closest('.modal');
        modal.style.display = 'none';
      });
    });

    // Close modals when clicking outside
    window.addEventListener('click', (e) => {
      if (e.target.classList.contains('modal')) {
        e.target.style.display = 'none';
      }
    });
  }

  handleProjectFormSubmit() {
    const nameInput = document.getElementById('project-name');
    const name = nameInput.value.trim();
    
    if (name) {
      this.addProject(name);
      UI.hideModal('project-modal');
    }
  }

  handleTodoFormSubmit() {
    const title = document.getElementById('todo-title').value.trim();
    const description = document.getElementById('todo-description').value.trim();
    const dueDate = document.getElementById('todo-dueDate').value;
    const priority = document.getElementById('todo-priority').value;
    const notes = document.getElementById('todo-notes').value.trim();
    
    // Get checklist items
    const checklist = [];
    const checklistInputs = document.querySelectorAll('input[name="checklist[]"]');
    checklistInputs.forEach(input => {
      if (input.value.trim()) {
        checklist.push({
          text: input.value.trim(),
          completed: false
        });
      }
    });
    
    if (title && dueDate) {
      const currentProject = this.getCurrentProject();
      currentProject.addTodo([title, description, dueDate, priority, notes, checklist]);
      Storage.saveProjects(this.projects);
      this.render();
      UI.hideModal('todo-modal');
    }
  }

  addProject(name) {
    const newProject = new Project(name);
    this.projects.push(newProject);
    Storage.saveProjects(this.projects);
    this.render();
  }

  deleteTodo(todoId) {
    if (confirm('Are you sure you want to delete this todo?')) {
      const currentProject = this.getCurrentProject();
      currentProject.deleteTodo(todoId);
      Storage.saveProjects(this.projects);
      this.render();
    }
  }

  getCurrentProject() {
    return this.projects.find(project => project.id === this.currentProjectId);
  }

  render() {
    const currentProject = this.getCurrentProject();
    document.getElementById('current-project-title').textContent = currentProject.name;
    UI.renderProjects(this.projects, this.currentProjectId);
    UI.renderTodos(currentProject.todos);
  }
}

// Initialize the app
new TodoApp();