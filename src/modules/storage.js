// Remove any imports at the top of the file
// We'll use a different approach to avoid circular dependencies

export class Storage {
  static saveProjects(projects) {
    localStorage.setItem('projects', JSON.stringify(projects));
  }

  static getProjects() {
    const projects = localStorage.getItem('projects');
    return projects ? JSON.parse(projects) : null;
  }

  static loadProjects(ProjectClass, TodoClass) {
    const projectsData = Storage.getProjects();
    if (!projectsData) return null;
    
    // Convert plain objects back to Project instances
    const projects = projectsData.map(projectData => {
      const project = new ProjectClass(projectData.name);
      project.id = projectData.id;
      project.todos = projectData.todos.map(todoData => {
        const todo = new TodoClass(
          todoData.title,
          todoData.description,
          todoData.dueDate,
          todoData.priority,
          todoData.notes,
          todoData.checklist
        );
        todo.id = todoData.id;
        todo.completed = todoData.completed;
        return todo;
      });
      return project;
    });
    
    return projects;
  }
}