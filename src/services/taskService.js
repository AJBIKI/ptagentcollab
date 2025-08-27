export const getTasks = async () => {
  console.log("Fetching tasks from the database...");
  return [
    { id: 1, title: 'Learn Node.js', completed: true },
    { id: 2, title: 'Build an API', completed: false },
  ];
};