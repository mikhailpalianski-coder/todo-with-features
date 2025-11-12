import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

// Mock fetch
global.fetch = vi.fn();

describe('App', () => {
  const mockTodos = [
    {
      _id: '1',
      content: 'Test Todo 1',
      completed: false,
    },
    {
      _id: '2',
      content: 'Test Todo 2',
      completed: true,
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the todo list heading', () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    });

    render(<App />);
    expect(screen.getByText('Todo List')).toBeInTheDocument();
  });

  it('should fetch and display todos', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockTodos,
    });

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Test Todo 1')).toBeInTheDocument();
      expect(screen.getByText('Test Todo 2')).toBeInTheDocument();
    });
  });

  it('should display empty state when no todos', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    });

    render(<App />);

    await waitFor(() => {
      expect(
        screen.getByText('No todos yet. Add one above!'),
      ).toBeInTheDocument();
    });
  });

  it('should create a new todo', async () => {
    const user = userEvent.setup();

    (global.fetch as any)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          _id: '3',
          content: 'New Todo',
          completed: false,
        }),
      });

    render(<App />);

    const input = screen.getByPlaceholderText('Add a new todo...');
    const addButton = screen.getByText('Add Todo');

    await user.type(input, 'New Todo');
    await user.click(addButton);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/todos'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ content: 'New Todo' }),
        }),
      );
    });
  });

  it('should toggle todo completion', async () => {
    const user = userEvent.setup();

    (global.fetch as any)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockTodos,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          ...mockTodos[0],
          completed: true,
        }),
      });

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Test Todo 1')).toBeInTheDocument();
    });

    const toggleButtons = screen.getAllByRole('button', {
      name: /mark as/i,
    });
    await user.click(toggleButtons[0]);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/todos/1'),
        expect.objectContaining({
          method: 'PATCH',
        }),
      );
    });
  });

  it('should delete a todo', async () => {
    const user = userEvent.setup();

    (global.fetch as any)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockTodos,
      })
      .mockResolvedValueOnce({
        ok: true,
      });

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Test Todo 1')).toBeInTheDocument();
    });

    const deleteButtons = screen.getAllByRole('button', { name: 'Delete todo' });
    await user.click(deleteButtons[0]);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/todos/1'),
        expect.objectContaining({
          method: 'DELETE',
        }),
      );
    });
  });

  it('should display error message on fetch failure', async () => {
    (global.fetch as any).mockRejectedValueOnce(new Error('Network error'));

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument();
    });
  });
});

