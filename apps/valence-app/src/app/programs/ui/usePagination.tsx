"use client";
import { useState, useCallback } from "react";
import { type PaginationArgs } from "@/app/programs/server";

export const usePagination = (initialPagination: PaginationArgs) => {
  const [pagination, setPagination] =
    useState<PaginationArgs>(initialPagination);

  const next = useCallback(() => {
    setPagination({
      lastId: pagination.lastId - pagination.limit,
      limit: pagination.limit,
    });
  }, [pagination]);

  const previous = useCallback(() => {
    setPagination({
      lastId: pagination.lastId + pagination.limit,
      limit: pagination.limit,
    });
  }, [pagination]);
  return { pagination, next, previous, setPagination };
};
