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

type Pagination = PaginationState & PaginationMeta; // Intersection Type Literals
type PaginationArgs = Pick<PaginationState, 'totalItems' | 'pageSize' | 'currentPage'>;

export const usePaginationContext = create<{
  // state
  pagination: Pagination;
  setPagination: (pg: Pagination) => void;
  setNextPage: () => void;
  setFirstPage: () => void;
  //
}>((set, get) => ({
  pagination: {
    currentPage: 0,
    pageSize: 0,
    totalItems: 0,
    previousEnabled: false,
    nextEnabled: false,
    totalPages: 0,
  },
  setPagination: (args: PaginationArgs) => set({ pagination: args }),
  setNextPage: () => {
    if (get().pagination.currentPage < get().pagination.totalPages) {
      set((state) => ({
        pagination: { ...state.pagination, currentPage: state.pagination.currentPage + 1 },
      })),
  }},
  // const { pagination } = get();
  // const { currentPage, totalPages } = pagination;

  // if (currentPage < totalPages) {
  //   set({
  //     pagination: {
  //       ...pagination,
  //       currentPage: currentPage + 1,
  //       nextEnabled: true,
  //     },
  //   });
  // } else {
  //   set({
  //     pagination: {
  //       ...pagination,
  //       nextEnabled: false,
  //     },
  //   });
  // }
  setPrevPage: () => {},
  setFirstPage: () => {},
}));

export interface ListContextProps {
  perPage: number;
  currentPage: number;
  total: number;
}

type ListPaginationContextProps = ListContextProps;

const ListPaginationContextProvider: FCC<{ value: ListPaginationContextProps }> = ({ children, value }) => {
  const { pagination, setPagination } = usePaginationContext();

  React.useEffect(() => {
    setPagination({
      totalPages: Math.round(value.total / value.perPage),
      totalItems: value.total,
      currentPage: value.currentPage,
      pageSize: value.perPage,
      // nextEnabled: value.currentPage < pagination.totalPages ? true : false,
      nextEnabled: pagination.nextEnabled,
      previousEnabled: value.currentPage > 1 ? true : false,
    });
  }, [value]);

  return <>{children}</>;
};

export default ListPaginationContextProvider;
