import React from 'react';
import { create } from 'zustand';

type PaginationState = {
  currentPage: number;
  pageSize: number;
  totalItems: number;
};

type PaginationMeta = {
  previousEnabled: boolean;
  nextEnabled: boolean;
  totalPages: number;
};

// Intersection Type Literals
type Pagination = PaginationState & PaginationMeta;
type PaginationArgs = Pick<PaginationState, 'totalItems' | 'pageSize'>;

const INITIAL_PAGE_NUMBER = 1;

export const usePaginationContext = create<{
  pagination: Pagination;
  setPagination: (pg: PaginationArgs) => void;
  setNextPage: () => void;
  setPrevPage: () => void;
  setFirstPage: () => void;
}>((set, get) => ({
  pagination: {
    currentPage: INITIAL_PAGE_NUMBER,
    pageSize: 0,
    totalItems: 0,
    previousEnabled: false,
    nextEnabled: false,
    totalPages: 0,
  },
  setPagination: (args: PaginationArgs) => {
    const totalPages = Math.ceil(args.totalItems / args.pageSize);
    const currentPage = INITIAL_PAGE_NUMBER;
    const nextEnabled = currentPage < totalPages;
    const previousEnabled = currentPage > INITIAL_PAGE_NUMBER;

    set({
      pagination: {
        totalItems: args.totalItems,
        pageSize: args.pageSize,
        totalPages,
        currentPage,
        previousEnabled,
        nextEnabled,
      },
    });
  },
  setNextPage: () => {
    const { pagination } = get();
    const { currentPage, totalPages } = pagination;

    if (currentPage < totalPages) {
      const nextPageNumber = currentPage + 1;

      set({
        pagination: {
          ...pagination,
          currentPage: nextPageNumber,
          nextEnabled: nextPageNumber < totalPages,
          previousEnabled: true,
        },
      });
    } else {
      set({
        pagination: {
          ...pagination,
          nextEnabled: false,
          previousEnabled: true,
        },
      });
    }
  },
  setPrevPage: () => {
    const { pagination } = get();
    const { currentPage, totalPages } = pagination;

    if (currentPage > INITIAL_PAGE_NUMBER) {
      const prevPageNumber = currentPage - 1;

      set({
        pagination: {
          ...pagination,
          currentPage: prevPageNumber,
          nextEnabled: true,
          previousEnabled: prevPageNumber > 1,
        },
      });
    } else {
      set({
        pagination: {
          ...pagination,
          nextEnabled: currentPage < totalPages,
          previousEnabled: false,
        },
      });
    }
  },
  setFirstPage: () => {
    const { pagination } = get();
    const { totalPages } = pagination;

    set({
      pagination: {
        ...pagination,
        currentPage: INITIAL_PAGE_NUMBER,
        nextEnabled: INITIAL_PAGE_NUMBER < totalPages,
        previousEnabled: false,
      },
    });
  },
}));

export interface ListContextProps {
  perPage: number;
  total: number;
}

type ListPaginationContextProps = ListContextProps;

const ListPaginationContextProvider: FCC<{ value: ListPaginationContextProps }> = ({ children, value }) => {
  const { setPagination } = usePaginationContext();

  React.useEffect(() => {
    setPagination({
      pageSize: value.perPage,
      totalItems: value.total,
    });
  }, [value]);

  return <>{children}</>;
};

export default ListPaginationContextProvider;
