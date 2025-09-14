import { Todo } from './todo.js';

export class Project {
  constructor(name) {
    this.name = name;
    this.todos = [];
    this.id = Date.now().toString();
  }

  addTodo(todoData) {
    const todo = new Todo(...todoData);
    this.todos.push(todo);
    return todo;
  }

  deleteTodo(todoId) {
    this.todos = this.todos.filter(todo => todo.id !== todoId);
  }

  getTodoById(todoId) {
    return this.todos.find(todo => todo.id === todoId);
  }
}