import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

interface Todo {
  id: string;
  content: string;
  completed: boolean
}


function App() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [newTodo, setNewTodo] = useState('')

  const handleAddTodo = () => {
    setTodos([...todos, { id: Date.now().toString(), content: newTodo, completed: false }])
    setNewTodo('')
  }

  useEffect(() => {
    // fetch functionality here
  }, []);
  
  

  return (
    <>
      <h1>Todo List</h1>
      <input type="text" value={newTodo} onChange={(e) => setNewTodo(e.target.value)} />
      <button onClick={handleAddTodo}>Add Todo</button>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>{todo.content} - {todo.completed ? 'Completed' : 'Not Completed'}</li>
        ))}
      </ul>
    </>
  )
}

export default App
