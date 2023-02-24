import * as React from 'react';
import expect from 'expect';
import { screen, render, fireEvent } from '@testing-library/react';
import ListPaginationContextProvider, { usePaginationContext } from './list-pagination-context-provider';

describe('ListPaginationContextProvider', () => {
  const NaiveList = (props) => {
    const { pagination, setNextPage } = usePaginationContext();

    return (
      <div>
        <span>{`currentPage: ${pagination.currentPage}`}</span>
        <span>{`totalPages: ${pagination.totalPages}`}</span>
        <span>{`pageSize: ${pagination.pageSize}`}</span>
        {pagination.nextEnabled && <button onClick={setNextPage}>view more</button>}
      </div>
    );
  };

  it('should return currentPage, totalPages, pageSize and view more button', () => {
    const { getByText } = render(
      <ListPaginationContextProvider
        value={{
          total: 4,
          currentPage: 0,
          perPage: 2,
        }}
      >
        <NaiveList />
      </ListPaginationContextProvider>,
    );

    expect(getByText('currentPage: 0')).not.toBeNull();
    expect(getByText('totalPages: 2')).not.toBeNull();
    expect(getByText('pageSize: 2')).not.toBeNull();
    expect(getByText('view more')).not.toBeNull();
  });

  // it('should return currentPage, totalPages, pageSize and view more button', () => {
  //   const { getByText } = render(
  //     <ListPaginationContextProvider
  //       value={{
  //         total: 4,
  //         currentPage: 0,
  //         perPage: 2,
  //       }}
  //     >
  //       <NaiveList />
  //     </ListPaginationContextProvider>,
  //   );

  //   fireEvent.click(getByText('view more'));

  //   expect(getByText('currentPage: 1')).not.toBeNull();
  //   expect(getByText('totalPages: 2')).not.toBeNull();
  //   expect(getByText('pageSize: 2')).not.toBeNull();
  //   expect(screen.queryByText('view more')).toBeNull();
  // });
});
