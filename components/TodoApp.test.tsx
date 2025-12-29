import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TodoApp from './TodoApp';
import { Todo } from '@/types/todo';

vi.mock('@/hooks/useLocalStorage', () => ({
  useLocalStorage: vi.fn(),
}));

import { useLocalStorage } from '@/hooks/useLocalStorage';

describe('TodoApp', () => {
  let mockTodos: Todo[];
  let mockSetTodos: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockTodos = [];
    mockSetTodos = vi.fn((newTodos) => {
      if (typeof newTodos === 'function') {
        mockTodos = newTodos(mockTodos);
      } else {
        mockTodos = newTodos;
      }
    });

    vi.mocked(useLocalStorage).mockImplementation(() => [mockTodos, mockSetTodos]);
  });

  it('初期レンダリングできる', () => {
    render(<TodoApp />);

    expect(screen.getByText('TODO アプリ')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('新しいTODOを入力...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '追加' })).toBeInTheDocument();
  });

  it('空の状態で適切なメッセージを表示', () => {
    render(<TodoApp />);

    expect(screen.getByText('TODO を追加して始めましょう！')).toBeInTheDocument();
  });

  it('TODOを追加できる', async () => {
    const user = userEvent.setup();
    render(<TodoApp />);

    const input = screen.getByPlaceholderText('新しいTODOを入力...');
    const addButton = screen.getByRole('button', { name: '追加' });

    await user.type(input, 'テストTODO');
    await user.click(addButton);

    expect(mockSetTodos).toHaveBeenCalled();
    const callArg = mockSetTodos.mock.calls[0][0];
    expect(callArg).toHaveLength(1);
    expect(callArg[0]).toMatchObject({
      text: 'テストTODO',
      completed: false,
    });
  });

  it('TODOを削除できる', async () => {
    const user = userEvent.setup();
    mockTodos = [
      { id: '1', text: 'TODO 1', completed: false, createdAt: Date.now() },
    ];
    vi.mocked(useLocalStorage).mockImplementation(() => [mockTodos, mockSetTodos]);

    render(<TodoApp />);

    const deleteButton = screen.getByRole('button', { name: '削除' });
    await user.click(deleteButton);

    expect(mockSetTodos).toHaveBeenCalled();
  });

  it('TODOの完了状態を切り替えできる', async () => {
    const user = userEvent.setup();
    mockTodos = [
      { id: '1', text: 'TODO 1', completed: false, createdAt: Date.now() },
    ];
    vi.mocked(useLocalStorage).mockImplementation(() => [mockTodos, mockSetTodos]);

    render(<TodoApp />);

    const checkbox = screen.getByRole('checkbox');
    await user.click(checkbox);

    expect(mockSetTodos).toHaveBeenCalled();
  });

  it('TODOを編集できる', async () => {
    const user = userEvent.setup();
    mockTodos = [
      { id: '1', text: 'TODO 1', completed: false, createdAt: Date.now() },
    ];
    vi.mocked(useLocalStorage).mockImplementation(() => [mockTodos, mockSetTodos]);

    render(<TodoApp />);

    const editButton = screen.getByRole('button', { name: '編集' });
    await user.click(editButton);

    const input = screen.getByDisplayValue('TODO 1');
    await user.clear(input);
    await user.type(input, '更新されたTODO{Enter}');

    expect(mockSetTodos).toHaveBeenCalled();
  });

  it('フィルター: すべて', async () => {
    const user = userEvent.setup();
    mockTodos = [
      { id: '1', text: 'TODO 1', completed: false, createdAt: Date.now() },
      { id: '2', text: 'TODO 2', completed: true, createdAt: Date.now() },
    ];
    vi.mocked(useLocalStorage).mockImplementation(() => [mockTodos, mockSetTodos]);

    render(<TodoApp />);

    const allButton = screen.getByRole('button', { name: 'すべて' });
    await user.click(allButton);

    expect(screen.getByText('TODO 1')).toBeInTheDocument();
    expect(screen.getByText('TODO 2')).toBeInTheDocument();
  });

  it('フィルター: 進行中', async () => {
    const user = userEvent.setup();
    mockTodos = [
      { id: '1', text: 'TODO 1', completed: false, createdAt: Date.now() },
      { id: '2', text: 'TODO 2', completed: true, createdAt: Date.now() },
    ];
    vi.mocked(useLocalStorage).mockImplementation(() => [mockTodos, mockSetTodos]);

    render(<TodoApp />);

    const activeButton = screen.getByRole('button', { name: '進行中' });
    await user.click(activeButton);

    expect(screen.getByText('TODO 1')).toBeInTheDocument();
    expect(screen.queryByText('TODO 2')).not.toBeInTheDocument();
  });

  it('フィルター: 完了', async () => {
    const user = userEvent.setup();
    mockTodos = [
      { id: '1', text: 'TODO 1', completed: false, createdAt: Date.now() },
      { id: '2', text: 'TODO 2', completed: true, createdAt: Date.now() },
    ];
    vi.mocked(useLocalStorage).mockImplementation(() => [mockTodos, mockSetTodos]);

    render(<TodoApp />);

    const completedButton = screen.getByRole('button', { name: '完了' });
    await user.click(completedButton);

    expect(screen.queryByText('TODO 1')).not.toBeInTheDocument();
    expect(screen.getByText('TODO 2')).toBeInTheDocument();
  });

  it('完了TODOを一括削除できる', async () => {
    const user = userEvent.setup();
    mockTodos = [
      { id: '1', text: 'TODO 1', completed: false, createdAt: Date.now() },
      { id: '2', text: 'TODO 2', completed: true, createdAt: Date.now() },
    ];
    vi.mocked(useLocalStorage).mockImplementation(() => [mockTodos, mockSetTodos]);

    render(<TodoApp />);

    const clearButton = screen.getByText('完了を削除');
    await user.click(clearButton);

    expect(mockSetTodos).toHaveBeenCalled();
  });

  it('activeCountが正しく計算される', () => {
    mockTodos = [
      { id: '1', text: 'TODO 1', completed: false, createdAt: Date.now() },
      { id: '2', text: 'TODO 2', completed: true, createdAt: Date.now() },
      { id: '3', text: 'TODO 3', completed: false, createdAt: Date.now() },
    ];
    vi.mocked(useLocalStorage).mockImplementation(() => [mockTodos, mockSetTodos]);

    render(<TodoApp />);

    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('完了TODOがない場合は「完了を削除」ボタンが表示されない', () => {
    mockTodos = [
      { id: '1', text: 'TODO 1', completed: false, createdAt: Date.now() },
    ];
    vi.mocked(useLocalStorage).mockImplementation(() => [mockTodos, mockSetTodos]);

    render(<TodoApp />);

    expect(screen.queryByText('完了を削除')).not.toBeInTheDocument();
  });
});
