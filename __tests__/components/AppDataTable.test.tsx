import React from 'react';
import AppDataTable from '@components/AppDataTable';
import {ThemeContext, ThemeContextType} from '@global/Context';
import getThemeStyle from '@root/utils/styles';
import renderer from 'react-test-renderer';
import {
  TEST_HEADERS,
  TEST_SORTOPS,
  TEST_CELLS,
  TEST_ROWS,
} from '../__mocks__/DataTable';
const theme = 'normal';
const currentTheme = {
  setTheme: jest.fn(),
  theme,
  themeStyle: getThemeStyle(theme),
} as ThemeContextType;

describe('AppDataTable Component', () => {
  it('renders a table component with 3 texts in a row', () => {
    const tree = renderer.create(
      <ThemeContext.Provider value={currentTheme}>
        <AppDataTable
          headers={TEST_HEADERS}
          sortOp={TEST_SORTOPS}
          renderCell={TEST_CELLS}
          rows={TEST_ROWS}
        />
      </ThemeContext.Provider>,
    );
    expect(tree.toJSON()).toMatchSnapshot();
  });
});
