import { fireEvent, render } from '@testing-library/react-native';

import { TagForm } from './tag-form';

describe('TagForm', () => {
  it('ftag04_rejects_blank_name', async () => {
    const onSubmit = jest.fn();
    const view = await render(<TagForm submitLabel="Create" onSubmit={onSubmit} />);

    await fireEvent.press(view.getByRole('button', { name: 'Create' }));

    expect(view.getByText('Name is required')).toBeTruthy();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('ftag04_disables_submit_while_pending', async () => {
    const onSubmit = jest.fn();
    const view = await render(
      <TagForm submitLabel="Create" submitting onSubmit={onSubmit} />,
    );

    const button = view.getByRole('button', { name: 'Create' });

    expect(button.props.accessibilityState.disabled).toBe(true);
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('ftag04_submits_trimmed_values', async () => {
    const onSubmit = jest.fn();
    const view = await render(<TagForm submitLabel="Create" onSubmit={onSubmit} />);

    await fireEvent.changeText(view.getByLabelText('Name'), '  vacation  ');
    await fireEvent.changeText(view.getByLabelText('Description'), '  Trip  ');
    await fireEvent.press(view.getByRole('button', { name: 'Create' }));

    expect(onSubmit).toHaveBeenCalledWith({
      name: 'vacation',
      description: 'Trip',
    });
  });
});
