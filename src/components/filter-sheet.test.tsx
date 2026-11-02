import { fireEvent, render } from '@testing-library/react-native';

import { FilterSheet } from './filter-sheet';

const categories = [{ value: 'c1', label: 'Food' }];
const subcategories = [{ value: 's1', label: 'Groceries' }];
const tags = [{ value: 't1', label: 'work' }];

function setup(filters = {}) {
  const onChange = jest.fn();
  const onClose = jest.fn();

  const view = render(
    <FilterSheet
      visible
      onClose={onClose}
      filters={filters}
      onChange={onChange}
      categories={categories}
      subcategories={subcategories}
      tags={tags}
    />,
  );

  return { view, onChange, onClose };
}

describe('FilterSheet', () => {
  it('fmov03_toggles_a_category', async () => {
    const { view, onChange } = setup();
    const rendered = await view;

    await fireEvent.press(rendered.getByText('Food'));

    expect(onChange).toHaveBeenCalledWith({ categoryIds: ['c1'] });
  });

  it('fmov03_toggles_a_subcategory', async () => {
    const { view, onChange } = setup();
    const rendered = await view;

    await fireEvent.press(rendered.getByText('Groceries'));

    expect(onChange).toHaveBeenCalledWith({ subcategoryIds: ['s1'] });
  });

  it('fmov03_sets_the_type', async () => {
    const { view, onChange } = setup();
    const rendered = await view;

    await fireEvent.press(rendered.getByText('In'));

    expect(onChange).toHaveBeenCalledWith({ type: 'INCOME' });
  });

  it('fmov03_sets_the_date_range', async () => {
    const { view, onChange } = setup();
    const rendered = await view;

    await fireEvent.changeText(rendered.getByLabelText('From'), '2026-07-01');

    expect(onChange).toHaveBeenCalledWith({ dateFrom: '2026-07-01' });
  });

  it('fmov04_clears_the_filters', async () => {
    const { view, onChange } = setup({ type: 'OUTCOME' });
    const rendered = await view;

    await fireEvent.press(rendered.getByLabelText('Clear filters'));

    expect(onChange).toHaveBeenCalledWith({});
  });

  it('fmov04_closes_with_done', async () => {
    const { view, onClose } = setup();
    const rendered = await view;

    await fireEvent.press(rendered.getByRole('button', { name: 'Done' }));

    expect(onClose).toHaveBeenCalled();
  });
});
