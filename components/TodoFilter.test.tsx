import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TodoFilter from './TodoFilter';

describe('TodoFilter', () => {
  it('3つのフィルターボタンがレンダリングされる', () => {
    const mockSetFilter = vi.fn();
    const mockOnClearCompleted = vi.fn();

    render(
      <TodoFilter
        filter="all"
        setFilter={mockSetFilter}
        activeCount={5}
        hasCompleted={false}
        onClearCompleted={mockOnClearCompleted}
      />
    );

    expect(screen.getByRole('button', { name: 'すべて' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '進行中' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '完了' })).toBeInTheDocument();
  });

  it('アクティブなフィルターのスタイルが適用される', () => {
    const mockSetFilter = vi.fn();
    const mockOnClearCompleted = vi.fn();

    render(
      <TodoFilter
        filter="active"
        setFilter={mockSetFilter}
        activeCount={5}
        hasCompleted={false}
        onClearCompleted={mockOnClearCompleted}
      />
    );

    const activeButton = screen.getByRole('button', { name: '進行中' });
    expect(activeButton).toHaveClass('bg-blue-500');
  });

  it('フィルターボタンクリックでsetFilterが呼ばれる', async () => {
    const user = userEvent.setup();
    const mockSetFilter = vi.fn();
    const mockOnClearCompleted = vi.fn();

    render(
      <TodoFilter
        filter="all"
        setFilter={mockSetFilter}
        activeCount={5}
        hasCompleted={false}
        onClearCompleted={mockOnClearCompleted}
      />
    );

    await user.click(screen.getByRole('button', { name: '進行中' }));

    expect(mockSetFilter).toHaveBeenCalledWith('active');
    expect(mockSetFilter).toHaveBeenCalledTimes(1);
  });

  it('activeCountが正しく表示される', () => {
    const mockSetFilter = vi.fn();
    const mockOnClearCompleted = vi.fn();

    render(
      <TodoFilter
        filter="all"
        setFilter={mockSetFilter}
        activeCount={7}
        hasCompleted={false}
        onClearCompleted={mockOnClearCompleted}
      />
    );

    expect(screen.getByText('7')).toBeInTheDocument();
    expect(screen.getByText(/残り:/)).toBeInTheDocument();
  });

  it('完了TODOがある場合のみ「完了を削除」ボタンが表示される', () => {
    const mockSetFilter = vi.fn();
    const mockOnClearCompleted = vi.fn();

    const { rerender } = render(
      <TodoFilter
        filter="all"
        setFilter={mockSetFilter}
        activeCount={5}
        hasCompleted={false}
        onClearCompleted={mockOnClearCompleted}
      />
    );

    expect(screen.queryByText('完了を削除')).not.toBeInTheDocument();

    rerender(
      <TodoFilter
        filter="all"
        setFilter={mockSetFilter}
        activeCount={5}
        hasCompleted={true}
        onClearCompleted={mockOnClearCompleted}
      />
    );

    expect(screen.getByText('完了を削除')).toBeInTheDocument();
  });

  it('「完了を削除」ボタンクリックでonClearCompletedが呼ばれる', async () => {
    const user = userEvent.setup();
    const mockSetFilter = vi.fn();
    const mockOnClearCompleted = vi.fn();

    render(
      <TodoFilter
        filter="all"
        setFilter={mockSetFilter}
        activeCount={5}
        hasCompleted={true}
        onClearCompleted={mockOnClearCompleted}
      />
    );

    await user.click(screen.getByText('完了を削除'));

    expect(mockOnClearCompleted).toHaveBeenCalledTimes(1);
  });

  it('各フィルターボタンに正しいフィルター値が渡される', async () => {
    const user = userEvent.setup();
    const mockSetFilter = vi.fn();
    const mockOnClearCompleted = vi.fn();

    render(
      <TodoFilter
        filter="all"
        setFilter={mockSetFilter}
        activeCount={5}
        hasCompleted={false}
        onClearCompleted={mockOnClearCompleted}
      />
    );

    await user.click(screen.getByRole('button', { name: 'すべて' }));
    expect(mockSetFilter).toHaveBeenLastCalledWith('all');

    await user.click(screen.getByRole('button', { name: '進行中' }));
    expect(mockSetFilter).toHaveBeenLastCalledWith('active');

    await user.click(screen.getByRole('button', { name: '完了' }));
    expect(mockSetFilter).toHaveBeenLastCalledWith('completed');
  });
});
