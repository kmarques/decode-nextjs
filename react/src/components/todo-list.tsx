import { useCallback, useEffect, useMemo, useState } from "react";

type TodoListProps = {
  backgroundColor: string;
};

type Todo = {
  id: number;
  title: string;
  completed: boolean;
};

export default function TodoList({ backgroundColor }: TodoListProps) {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const addTodo = useCallback(() => {
    const newTodo: Todo = {
      id: Date.now(),
      title: `New Todo ${Date.now()}`,
      completed: false,
    };
    setTodos((prev) => [...prev, newTodo]);
  }, []);

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/todos?_limit=" + itemsPerPage)
      .then((response) => response.json())
      .then((json) => setTodos(json));

    return () => {
      console.log("Cleanup on itemsPerPage change before " + itemsPerPage);
    };
  }, [itemsPerPage]);

  return (
    <div style={{ backgroundColor }}>
      <h2>Todo List {todos.length}</h2>
      <p>Items per page: {itemsPerPage}</p>
      <button onClick={addTodo}>Add Todo</button>
      <button onClick={() => setItemsPerPage(5)}>5</button>
      <button onClick={() => setItemsPerPage(10)}>10</button>
      <button onClick={() => setItemsPerPage(15)}>15</button>

      <ul>
        {todos.map((todo) => (
          <li
            key={todo.id}
            style={{ textDecoration: todo.completed ? "line-through" : "none" }}
          >
            {todo.title}
          </li>
        ))}
        {todos.length === 0 && <li>No todos available</li>}
      </ul>
      {/* Render your todo items here */}
    </div>
  );
}
