"use client";

import { useState, useMemo } from "react";
import { searchTools } from "@/lib/tools";
import { useDebounce } from "./use-debounce";
import { Tool } from "@/types";

export function useSearch() {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 250);

  const results: Tool[] = useMemo(() => {
    return searchTools(debouncedQuery);
  }, [debouncedQuery]);

  return { query, setQuery, results, isSearching: query.length > 0 };
}
