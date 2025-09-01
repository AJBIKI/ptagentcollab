import { delay } from '../utils/helpers.js';
let tasks = [
  { id: 1, title: "Build ESM Project", deadline: new Date(Date.now() + 60000), done: false }
];
export async function getTasks() {
  await delay(100);
  return tasks;
}
export async function addTask(title, deadline) {
  const newTask = { id: tasks.length + 1, title, deadline: new Date(deadline), done: false };
  tasks.push(newTask);
  return newTask;
}
