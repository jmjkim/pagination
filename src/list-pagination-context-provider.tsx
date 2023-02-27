import React from 'react';
import { Pagination } from 'react-admin';
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

const INITIAL_PAGE_NUMBER = 1;

export const usePaginationContext = create<{
  pagination: Pagination;
  setPagination: (pg: Pagination) => void;
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
  setPagination: (args: Pagination) => set({ pagination: args }),
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
        },
      });
    } else {
      set({
        pagination: {
          ...pagination,
          nextEnabled: false,
        },
      });
    }
  },
  setPrevPage: () => {
    const { pagination } = get();
    const { currentPage, totalPages } = pagination;

    if (currentPage > 1 || currentPage <= totalPages) {
      const prevPageNumber = currentPage - 1;

      set({
        pagination: {
          ...pagination,
          currentPage: prevPageNumber,
          previousEnabled: prevPageNumber > 1,
        },
      });
    } else {
      set({
        pagination: {
          ...pagination,
          previousEnabled: false,
        },
      });
    }
  },
  setFirstPage: () => {
    const { pagination } = get();
    const { currentPage, totalPages } = pagination;

    set({
      pagination: {
        ...pagination,
        currentPage: INITIAL_PAGE_NUMBER,
        nextEnabled: currentPage < totalPages,
        previousEnabled: false,
      },
    });
  },
}));

export interface ListContextProps {
  perPage: number;
  total: number;
  currentPage?: number;
}

type ListPaginationContextProps = ListContextProps;

const ListPaginationContextProvider: FCC<{ value: ListPaginationContextProps }> = ({ children, value }) => {
  const { setPagination } = usePaginationContext();

  React.useEffect(() => {
    const totalPages = Math.ceil(value.total / value.perPage);
    const currentPage = value.currentPage === undefined || value.currentPage === 0 ? INITIAL_PAGE_NUMBER : value.currentPage;
    const nextEnabled = currentPage < totalPages;
    const previousEnabled = currentPage > INITIAL_PAGE_NUMBER || currentPage <= totalPages;

    setPagination({
      totalPages,
      currentPage,
      nextEnabled,
      previousEnabled,
      pageSize: value.perPage,
      totalItems: value.total,
    });
  }, [value]);

  return <>{children}</>;
};

export default ListPaginationContextProvider;
