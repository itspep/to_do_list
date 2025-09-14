import './styles.css';
import { Project } from '../modules/project.js';
import { Storage } from '../modules/storage.js';
import { UI } from '../modules/ui.js';

class TodoApp {
  constructor() {
    this.projects = [];
    this.currentProjectId = null;
    this.init();
  }

  init() {
    this.loadProjects();
    this.setupEventListeners();
    this.render();
  }

  loadProjects() {
    const savedProjects = Storage.loadProjects();
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
    document.getElementById('new-project-btn').addEventListener('click', () => {
      this.addProject();
    });

    document.getElementById('new-todo-btn').addEventListener('click', () => {
      this.showTodoForm();
    });

    document.addEventListener('projectSelected', (e) => {
      this.currentProjectId = e.detail;
      this.render();
    });
  }

  addProject() {
    const projectName = prompt('Enter project name:');
    if (projectName) {
      const newProject = new Project(projectName);
      this.projects.push(newProject);
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

  showTodoForm() {
    // Implement form to create new todo
    const title = prompt('Todo title:');
    const description = prompt('Description:');
    const dueDate = prompt('Due date (YYYY-MM-DD):');
    const priority = prompt('Priority (high/medium/low):');
    
    if (title && dueDate && priority) {
      const currentProject = this.getCurrentProject();
      currentProject.addTodo([title, description, dueDate, priority]);
      Storage.saveProjects(this.projects);
      this.render();
    }
  }
}

// Initialize the app
new TodoApp();