import { format } from 'date-fns';

export class UI {
  static renderProjects(projects, currentProjectId) {
    const projectsList = document.getElementById('projects-list');
    projectsList.innerHTML = '';
    
    projects.forEach(project => {
      const li = document.createElement('li');
      const button = document.createElement('button');
      button.textContent = project.name;
      button.classList.toggle('active', project.id === currentProjectId);
      button.addEventListener('click', () => {
        // Dispatch custom event or call callback
        document.dispatchEvent(new CustomEvent('projectSelected', { detail: project.id }));
      });
      
      li.appendChild(button);
      projectsList.appendChild(li);
    });
  }

  static renderTodos(todos) {
    const container = document.getElementById('todos-container');
    container.innerHTML = '';
    
    todos.forEach(todo => {
      const todoElement = document.createElement('div');
      todoElement.className = `todo-item ${todo.priority}-priority`;
      todoElement.innerHTML = `
        <h3>${todo.title}</h3>
        <p>Due: ${format(new Date(todo.dueDate), 'MM/dd/yyyy')}</p>
        <button class="delete-todo" data-id="${todo.id}">Delete</button>
      `;
      
      container.appendChild(todoElement);
    });
  }
}