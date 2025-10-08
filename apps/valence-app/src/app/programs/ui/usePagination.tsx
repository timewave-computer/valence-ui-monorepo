"use client";
import { useState, useCallback } from "react";

export const usePagination = (initialPagination: {
  lastId: number;
  limit: number;
}) => {
  const [pagination, setPagination] = useState<{
    lastId: number;
    limit: number;
  }>(initialPagination);

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
