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
        document.dispatchEvent(new CustomEvent('projectSelected', { detail: project.id }));
      });
      
      li.appendChild(button);
      projectsList.appendChild(li);
    });
  }

  static renderTodos(todos) {
    const container = document.getElementById('todos-container');
    container.innerHTML = '';
    
    if (todos.length === 0) {
      container.innerHTML = '<p>No todos yet. Add one to get started!</p>';
      return;
    }
    
    todos.forEach(todo => {
      const todoElement = document.createElement('div');
      todoElement.className = `todo-item ${todo.priority}-priority`;
      
      const todoHeader = document.createElement('div');
      todoHeader.className = 'todo-header';
      
      const todoTitle = document.createElement('h3');
      todoTitle.textContent = todo.title;
      
      const todoActions = document.createElement('div');
      todoActions.className = 'todo-actions';
      
      const viewButton = document.createElement('button');
      viewButton.textContent = 'View';
      viewButton.addEventListener('click', (e) => {
        e.stopPropagation();
        document.dispatchEvent(new CustomEvent('viewTodo', { detail: todo }));
      });
      
      const deleteButton = document.createElement('button');
      deleteButton.textContent = 'Delete';
      deleteButton.className = 'delete-btn';
      deleteButton.addEventListener('click', (e) => {
        e.stopPropagation();
        document.dispatchEvent(new CustomEvent('deleteTodo', { detail: todo.id }));
      });
      
      todoActions.appendChild(viewButton);
      todoActions.appendChild(deleteButton);
      
      todoHeader.appendChild(todoTitle);
      todoHeader.appendChild(todoActions);
      
      const todoDueDate = document.createElement('p');
      todoDueDate.textContent = `Due: ${format(new Date(todo.dueDate), 'MM/dd/yyyy')}`;
      
      todoElement.appendChild(todoHeader);
      todoElement.appendChild(todoDueDate);
      
      // Add click event to show details
      todoElement.addEventListener('click', () => {
        document.dispatchEvent(new CustomEvent('viewTodo', { detail: todo }));
      });
      
      container.appendChild(todoElement);
    });
  }

  static showModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.style.display = 'block';
  }

  static hideModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.style.display = 'none';
  }

  static showProjectForm() {
    document.getElementById('project-form').reset();
    UI.showModal('project-modal');
  }

  static showTodoForm() {
    document.getElementById('todo-form').reset();
    document.getElementById('checklist-items').innerHTML = '';
    UI.showModal('todo-modal');
  }

  static showTodoDetails(todo) {
    const detailsContainer = document.getElementById('todo-details');
    detailsContainer.innerHTML = `
      <div class="detail-row">
        <span class="detail-label">Title:</span>
        <span>${todo.title}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Description:</span>
        <span>${todo.description || 'No description'}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Due Date:</span>
        <span>${format(new Date(todo.dueDate), 'MM/dd/yyyy')}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Priority:</span>
        <span>${todo.priority}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Notes:</span>
        <span>${todo.notes || 'No notes'}</span>
      </div>
      ${todo.checklist && todo.checklist.length > 0 ? `
        <div class="detail-row">
          <span class="detail-label">Checklist:</span>
          <ul>
            ${todo.checklist.map(item => `
              <li>
                <input type="checkbox" ${item.completed ? 'checked' : ''} disabled>
                ${item.text}
              </li>
            `).join('')}
          </ul>
        </div>
      ` : ''}
    `;
    
    document.getElementById('details-title').textContent = todo.title;
    UI.showModal('todo-details-modal');
  }

  static addChecklistItem() {
    const checklistItems = document.getElementById('checklist-items');
    const itemCount = checklistItems.children.length;
    
    const itemDiv = document.createElement('div');
    itemDiv.className = 'checklist-item';
    itemDiv.innerHTML = `
      <input type="checkbox" id="checklist-${itemCount}">
      <input type="text" placeholder="Checklist item" name="checklist[]">
      <button type="button" class="delete-checklist-item">×</button>
    `;
    
    itemDiv.querySelector('.delete-checklist-item').addEventListener('click', () => {
      itemDiv.remove();
    });
    
    checklistItems.appendChild(itemDiv);
  }
}