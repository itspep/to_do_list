export class Storage {
    static saveProjects(projects) {
      localStorage.setItem('projects', JSON.stringify(projects));
    }
  
    static getProjects() {
      const projects = localStorage.getItem('projects');
      return projects ? JSON.parse(projects) : null;
    }
  
    static loadProjects() {
      const projectsData = Storage.getProjects();
      if (!projectsData) return null;
      
      // Reconstruct projects with methods
      // This would need custom reconstruction based on your classes
      return projectsData;
    }
  }