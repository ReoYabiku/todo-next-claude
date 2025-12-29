import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import TodoList from './TodoList';
import { Todo } from '@/types/todo';

describe('TodoList', () => {
  const mockTodos: Todo[] = [
    { id: '1', text: 'TODO 1', completed: false, createdAt: Date.now() },
    { id: '2', text: 'TODO 2', completed: true, createdAt: Date.now() },
    { id: '3', text: 'TODO 3', completed: false, createdAt: Date.now() },
  ];

  it('空配列時にレンダリングできる', () => {
    const mockOnToggle = vi.fn();
    const mockOnDelete = vi.fn();
    const mockOnEdit = vi.fn();

    const { container } = render(
      <TodoList
        todos={[]}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
      />
    );

    expect(container.querySelector('.space-y-2')).toBeInTheDocument();
    expect(container.querySelector('.space-y-2')?.children.length).toBe(0);
  });

  it('複数のTODOをレンダリングできる', () => {
    const mockOnToggle = vi.fn();
    const mockOnDelete = vi.fn();
    const mockOnEdit = vi.fn();

    render(
      <TodoList
        todos={mockTodos}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
      />
    );

    expect(screen.getByText('TODO 1')).toBeInTheDocument();
    expect(screen.getByText('TODO 2')).toBeInTheDocument();
    expect(screen.getByText('TODO 3')).toBeInTheDocument();
  });

  it('正しい数のチェックボックスがレンダリングされる', () => {
    const mockOnToggle = vi.fn();
    const mockOnDelete = vi.fn();
    const mockOnEdit = vi.fn();

    render(
      <TodoList
        todos={mockTodos}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
      />
    );

    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes).toHaveLength(3);
  });

  it('propsを各TodoItemに正しく伝達する', () => {
    const mockOnToggle = vi.fn();
    const mockOnDelete = vi.fn();
    const mockOnEdit = vi.fn();

    render(
      <TodoList
        todos={mockTodos}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
      />
    );

    const deleteButtons = screen.getAllByRole('button', { name: '削除' });
    expect(deleteButtons).toHaveLength(3);
  });
});
