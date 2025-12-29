import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TodoInput from './TodoInput';

describe('TodoInput', () => {
  it('レンダリングできる', () => {
    const mockOnAdd = vi.fn();
    render(<TodoInput onAdd={mockOnAdd} />);

    expect(screen.getByPlaceholderText('新しいTODOを入力...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '追加' })).toBeInTheDocument();
  });

  it('テキストを入力できる', async () => {
    const user = userEvent.setup();
    const mockOnAdd = vi.fn();
    render(<TodoInput onAdd={mockOnAdd} />);

    const input = screen.getByPlaceholderText('新しいTODOを入力...');
    await user.type(input, 'テストTODO');

    expect(input).toHaveValue('テストTODO');
  });

  it('有効なテキスト入力時にonAddが呼ばれる', async () => {
    const user = userEvent.setup();
    const mockOnAdd = vi.fn();
    render(<TodoInput onAdd={mockOnAdd} />);

    const input = screen.getByPlaceholderText('新しいTODOを入力...');
    const button = screen.getByRole('button', { name: '追加' });

    await user.type(input, 'テストTODO');
    await user.click(button);

    expect(mockOnAdd).toHaveBeenCalledWith('テストTODO');
    expect(mockOnAdd).toHaveBeenCalledTimes(1);
  });

  it('送信後に入力欄がクリアされる', async () => {
    const user = userEvent.setup();
    const mockOnAdd = vi.fn();
    render(<TodoInput onAdd={mockOnAdd} />);

    const input = screen.getByPlaceholderText('新しいTODOを入力...');
    const button = screen.getByRole('button', { name: '追加' });

    await user.type(input, 'テストTODO');
    await user.click(button);

    expect(input).toHaveValue('');
  });

  it('空文字列の入力時はonAddが呼ばれない', async () => {
    const user = userEvent.setup();
    const mockOnAdd = vi.fn();
    render(<TodoInput onAdd={mockOnAdd} />);

    const button = screen.getByRole('button', { name: '追加' });
    await user.click(button);

    expect(mockOnAdd).not.toHaveBeenCalled();
  });

  it('空白のみの入力時はonAddが呼ばれない', async () => {
    const user = userEvent.setup();
    const mockOnAdd = vi.fn();
    render(<TodoInput onAdd={mockOnAdd} />);

    const input = screen.getByPlaceholderText('新しいTODOを入力...');
    const button = screen.getByRole('button', { name: '追加' });

    await user.type(input, '   ');
    await user.click(button);

    expect(mockOnAdd).not.toHaveBeenCalled();
  });

  it('Enterキーでフォーム送信できる', async () => {
    const user = userEvent.setup();
    const mockOnAdd = vi.fn();
    render(<TodoInput onAdd={mockOnAdd} />);

    const input = screen.getByPlaceholderText('新しいTODOを入力...');

    await user.type(input, 'テストTODO{Enter}');

    expect(mockOnAdd).toHaveBeenCalledWith('テストTODO');
  });
});
