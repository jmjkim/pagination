import * as React from 'react';
import expect from 'expect';
import { screen, render, fireEvent } from '@testing-library/react';
import ListPaginationContextProvider, { usePaginationContext } from './list-pagination-context-provider';

describe('ListPaginationContextProvider', () => {
  const NaiveList = (props) => {
    const { pagination, setNextPage, setPrevPage, setFirstPage } = usePaginationContext();

    const noItemError = pagination.totalItems === 0 || pagination.totalPages === Infinity;
    const negativeValueError = Math.sign(pagination.pageSize) === -1 || Math.sign(pagination.totalPages) === -1;

    if (noItemError) {
      return <div>No items to display</div>;
    } else if (negativeValueError) {
      return <div>invalid value error</div>;
    } else {
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
    }
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

  it('should move to the next page if view more button is clicked', () => {
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

  it('should move back to the previous page if view previous page button is clicked', () => {
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

  it('should move to the first page if view first page button is clicked', () => {
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

  describe('edge cases', () => {
    const maxNumber = Number.MAX_SAFE_INTEGER;

    it('should return maximum totalPages and view more button', () => {
      const { getByText } = render(
        <ListPaginationContextProvider
          value={{
            total: maxNumber,
            perPage: 1,
          }}
        >
          <NaiveList />
        </ListPaginationContextProvider>,
      );

      expect(getByText(`totalPages: ${maxNumber}`)).not.toBeNull();
      expect(getByText('view more')).not.toBeNull();
    });

    it('should return maximum item numbers on a page', () => {
      const { getByText } = render(
        <ListPaginationContextProvider
          value={{
            total: maxNumber,
            perPage: maxNumber,
          }}
        >
          <NaiveList />
        </ListPaginationContextProvider>,
      );

      expect(getByText('totalPages: 1')).not.toBeNull();
      expect(getByText(`pageSize: ${maxNumber}`)).not.toBeNull();
    });

    it('should display an error if totalPages is negative', () => {
      const { getByText } = render(
        <ListPaginationContextProvider
          value={{
            total: -4,
            perPage: 2,
          }}
        >
          <NaiveList />
        </ListPaginationContextProvider>,
      );

      expect(getByText('invalid value error')).not.toBeNull();
    });

    it('should display an error if perPage is negative', () => {
      const { getByText } = render(
        <ListPaginationContextProvider
          value={{
            total: 4,
            perPage: -2,
          }}
        >
          <NaiveList />
        </ListPaginationContextProvider>,
      );

      expect(getByText('invalid value error')).not.toBeNull();
    });

    it('should display an error if totalItem is 0', () => {
      const { getByText } = render(
        <ListPaginationContextProvider
          value={{
            total: 0,
            perPage: 2,
          }}
        >
          <NaiveList />
        </ListPaginationContextProvider>,
      );

      expect(getByText('No items to display')).not.toBeNull();
    });

    it('should display an error if perPage is 0', () => {
      const { getByText } = render(
        <ListPaginationContextProvider
          value={{
            total: 2,
            perPage: 0,
          }}
        >
          <NaiveList />
        </ListPaginationContextProvider>,
      );

      expect(getByText('No items to display')).not.toBeNull();
    });
  });
});
