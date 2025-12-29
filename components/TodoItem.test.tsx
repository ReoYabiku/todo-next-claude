import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TodoItem from './TodoItem';
import { Todo } from '@/types/todo';

describe('TodoItem', () => {
  const mockTodo: Todo = {
    id: '1',
    text: 'テストTODO',
    completed: false,
    createdAt: Date.now(),
  };

  const mockCompletedTodo: Todo = {
    ...mockTodo,
    completed: true,
  };

  it('通常のTODOアイテムがレンダリングされる', () => {
    const mockOnToggle = vi.fn();
    const mockOnDelete = vi.fn();
    const mockOnEdit = vi.fn();

    render(
      <TodoItem
        todo={mockTodo}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
      />
    );

    expect(screen.getByText('テストTODO')).toBeInTheDocument();
    expect(screen.getByRole('checkbox')).not.toBeChecked();
    expect(screen.getByRole('button', { name: '編集' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '削除' })).toBeInTheDocument();
  });

  it('完了済みTODOは打ち消し線で表示され編集ボタンが非表示', () => {
    const mockOnToggle = vi.fn();
    const mockOnDelete = vi.fn();
    const mockOnEdit = vi.fn();

    render(
      <TodoItem
        todo={mockCompletedTodo}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
      />
    );

    expect(screen.getByRole('checkbox')).toBeChecked();
    expect(screen.queryByRole('button', { name: '編集' })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: '削除' })).toBeInTheDocument();
  });

  it('チェックボックスクリックでonToggleが呼ばれる', async () => {
    const user = userEvent.setup();
    const mockOnToggle = vi.fn();
    const mockOnDelete = vi.fn();
    const mockOnEdit = vi.fn();

    render(
      <TodoItem
        todo={mockTodo}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
      />
    );

    await user.click(screen.getByRole('checkbox'));

    expect(mockOnToggle).toHaveBeenCalledWith('1');
    expect(mockOnToggle).toHaveBeenCalledTimes(1);
  });

  it('削除ボタンクリックでonDeleteが呼ばれる', async () => {
    const user = userEvent.setup();
    const mockOnToggle = vi.fn();
    const mockOnDelete = vi.fn();
    const mockOnEdit = vi.fn();

    render(
      <TodoItem
        todo={mockTodo}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
      />
    );

    await user.click(screen.getByRole('button', { name: '削除' }));

    expect(mockOnDelete).toHaveBeenCalledWith('1');
    expect(mockOnDelete).toHaveBeenCalledTimes(1);
  });

  it('編集ボタンクリックで編集モードに入る', async () => {
    const user = userEvent.setup();
    const mockOnToggle = vi.fn();
    const mockOnDelete = vi.fn();
    const mockOnEdit = vi.fn();

    render(
      <TodoItem
        todo={mockTodo}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
      />
    );

    await user.click(screen.getByRole('button', { name: '編集' }));

    const input = screen.getByDisplayValue('テストTODO');
    expect(input).toBeInTheDocument();
    expect(input).toHaveFocus();
  });

  it('ダブルクリックで編集モードに入る（未完了の場合）', async () => {
    const user = userEvent.setup();
    const mockOnToggle = vi.fn();
    const mockOnDelete = vi.fn();
    const mockOnEdit = vi.fn();

    render(
      <TodoItem
        todo={mockTodo}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
      />
    );

    await user.dblClick(screen.getByText('テストTODO'));

    expect(screen.getByDisplayValue('テストTODO')).toBeInTheDocument();
  });

  it('完了済みTODOはダブルクリックで編集モードに入らない', async () => {
    const user = userEvent.setup();
    const mockOnToggle = vi.fn();
    const mockOnDelete = vi.fn();
    const mockOnEdit = vi.fn();

    render(
      <TodoItem
        todo={mockCompletedTodo}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
      />
    );

    await user.dblClick(screen.getByText('テストTODO'));

    expect(screen.queryByDisplayValue('テストTODO')).not.toBeInTheDocument();
  });

  it('Enterキーで編集を確定', async () => {
    const user = userEvent.setup();
    const mockOnToggle = vi.fn();
    const mockOnDelete = vi.fn();
    const mockOnEdit = vi.fn();

    render(
      <TodoItem
        todo={mockTodo}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
      />
    );

    await user.click(screen.getByRole('button', { name: '編集' }));
    const input = screen.getByDisplayValue('テストTODO');

    await user.clear(input);
    await user.type(input, '更新されたTODO{Enter}');

    expect(mockOnEdit).toHaveBeenCalledWith('1', '更新されたTODO');
  });

  it('Escapeキーで編集をキャンセル', async () => {
    const user = userEvent.setup();
    const mockOnToggle = vi.fn();
    const mockOnDelete = vi.fn();
    const mockOnEdit = vi.fn();

    render(
      <TodoItem
        todo={mockTodo}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
      />
    );

    await user.click(screen.getByRole('button', { name: '編集' }));
    const input = screen.getByDisplayValue('テストTODO');

    await user.clear(input);
    await user.type(input, '変更{Escape}');

    expect(mockOnEdit).not.toHaveBeenCalled();
    expect(screen.getByText('テストTODO')).toBeInTheDocument();
  });

  it('blurで編集を確定', async () => {
    const user = userEvent.setup();
    const mockOnToggle = vi.fn();
    const mockOnDelete = vi.fn();
    const mockOnEdit = vi.fn();

    render(
      <TodoItem
        todo={mockTodo}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
      />
    );

    await user.click(screen.getByRole('button', { name: '編集' }));
    const input = screen.getByDisplayValue('テストTODO');

    await user.clear(input);
    await user.type(input, '更新されたTODO');
    await user.tab();

    expect(mockOnEdit).toHaveBeenCalledWith('1', '更新されたTODO');
  });
});
