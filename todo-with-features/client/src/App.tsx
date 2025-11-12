import { useEffect, useState } from 'react'
import './App.css'

interface Todo {
  _id: string;
  content: string;
  completed: boolean;
  createdAt?: string;
  updatedAt?: string;
}


const API_URL = import.meta.env.VITE_API_URL 
  ? `${import.meta.env.VITE_API_URL}/todos`
  : import.meta.env.PROD 
    ? '/api/todos' 
    : 'http://localhost:3000/todos';

function App() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [newTodo, setNewTodo] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch all todos
  const fetchTodos = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch(API_URL)
      if (!response.ok) {
        throw new Error('Failed to fetch todos')
      }
      const data = await response.json()
      setTodos(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      console.error('Error fetching todos:', err)
    } finally {
      setLoading(false)
    }
  }

  // Create a new todo
  const handleAddTodo = async () => {
    if (!newTodo.trim()) return

    try {
      setError(null)
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: newTodo.trim() }),
      })

      if (!response.ok) {
        throw new Error('Failed to create todo')
      }

      const todo = await response.json()
      setTodos([...todos, todo])
      setNewTodo('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create todo')
      console.error('Error creating todo:', err)
    }
  }

  // Toggle todo completion status
  const handleToggleTodo = async (id: string, completed: boolean) => {
    try {
      setError(null)
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ completed: !completed }),
      })

      if (!response.ok) {
        throw new Error('Failed to update todo')
      }

      const updatedTodo = await response.json()
      setTodos(todos.map(todo => todo._id === id ? updatedTodo : todo))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update todo')
      console.error('Error updating todo:', err)
    }
  }

  // Delete a todo
  const handleDeleteTodo = async (id: string) => {
    try {
      setError(null)
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete todo')
      }

      setTodos(todos.filter(todo => todo._id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete todo')
      console.error('Error deleting todo:', err)
    }
  }

  // Handle Enter key press
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleAddTodo()
    }
  }

  useEffect(() => {
    fetchTodos()
  }, [])

  return (
    <div className="app">
      <div className="container">
        <h1>Todo List</h1>
        
        {error && <div className="error-message">{error}</div>}

        <div className="todo-input-container">
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Add a new todo..."
            className="todo-input"
          />
          <button 
            onClick={handleAddTodo} 
            className="add-button"
            disabled={loading || !newTodo.trim()}
          >
            Add Todo
          </button>
        </div>

        {loading && todos.length === 0 ? (
          <div className="loading">Loading todos...</div>
        ) : todos.length === 0 ? (
          <div className="empty-state">No todos yet. Add one above!</div>
        ) : (
          <ul className="todo-list">
            {todos.map((todo) => (
              <li 
                key={todo._id} 
                className={`todo-item ${todo.completed ? 'completed' : ''}`}
              >
                <div className="todo-content">
                  <button
                    className={`toggle-button ${todo.completed ? 'checked' : ''}`}
                    onClick={() => handleToggleTodo(todo._id, todo.completed)}
                    aria-label={todo.completed ? 'Mark as incomplete' : 'Mark as complete'}
                  >
                    {todo.completed ? '✓' : ''}
                  </button>
                  <span className="todo-text">{todo.content}</span>
                </div>
                <button
                  className="delete-button"
                  onClick={() => handleDeleteTodo(todo._id)}
                  aria-label="Delete todo"
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default App
