import * as React from 'react';
import expect from 'expect';
import { screen, render, fireEvent, queryByText } from '@testing-library/react';
import ListPaginationContextProvider, { usePaginationContext } from './list-pagination-context-provider';

describe('ListPaginationContextProvider', () => {
  const NaiveList = (props) => {
    const { pagination, setNextPage, setPrevPage, setFirstPage } = usePaginationContext();

    return (
      <div>
        <span>{`currentPage: ${pagination.currentPage}`}</span>
        <span>{`totalPages: ${pagination.totalPages}`}</span>
        <span>{`pageSize: ${pagination.pageSize}`}</span>
        {pagination.nextEnabled && <button onClick={setNextPage}>view more</button>}
        {pagination.previousEnabled && (
          <>
            <button onClick={setPrevPage}>view previous page</button>
            <button onClick={setFirstPage}>view first page</button>
          </>
        )}
      </div>
    );
  };

  it('should return currentPage, totalPages, pageSize and view more button', () => {
    const { getByText } = render(
      <ListPaginationContextProvider
        value={{
          total: 4,
          perPage: 2,
        }}
      >
        <NaiveList />
      </ListPaginationContextProvider>,
    );

    expect(getByText('currentPage: 1')).not.toBeNull();
    expect(getByText('totalPages: 2')).not.toBeNull();
    expect(getByText('pageSize: 2')).not.toBeNull();
    expect(getByText('view more')).not.toBeNull();
  });

  //setNextPage
  it('should return currentPage, totalPages, pageSize and view more button', () => {
    const { getByText } = render(
      <ListPaginationContextProvider
        value={{
          total: 4,
          perPage: 2,
        }}
      >
        <NaiveList />
      </ListPaginationContextProvider>,
    );

    fireEvent.click(getByText('view more'));

    expect(getByText('currentPage: 2')).not.toBeNull();
    expect(getByText('totalPages: 2')).not.toBeNull();
    expect(getByText('pageSize: 2')).not.toBeNull();
    expect(screen.queryByText('view more')).toBeNull();
  });

  //setPreviousPage
  test('setPreviousPage', () => {
    const { getByText } = render(
      <ListPaginationContextProvider
        value={{
          total: 4,
          perPage: 2,
        }}
      >
        <NaiveList />
      </ListPaginationContextProvider>,
    );

    fireEvent.click(getByText('view more'));
    fireEvent.click(getByText('view previous page'));

    expect(getByText('currentPage: 1')).not.toBeNull();
    expect(getByText('totalPages: 2')).not.toBeNull();
    expect(getByText('pageSize: 2')).not.toBeNull();
    expect(screen.queryByText('view previous page')).toBeNull();
  });

  //setFirstPage
  it('should return currentPage, totalPages, pageSize and view more button', () => {
    const { getByText } = render(
      <ListPaginationContextProvider
        value={{
          total: 10,
          perPage: 2,
        }}
      >
        <NaiveList />
      </ListPaginationContextProvider>,
    );

    fireEvent.click(getByText('view more'));
    fireEvent.click(getByText('view first page'));

    expect(getByText('currentPage: 1')).not.toBeNull();
    expect(getByText('totalPages: 5')).not.toBeNull();
    expect(getByText('pageSize: 2')).not.toBeNull();

    expect(screen.queryByText('view more')).not.toBeNull();
    expect(screen.queryByText('view first page')).toBeNull();
  });
});
