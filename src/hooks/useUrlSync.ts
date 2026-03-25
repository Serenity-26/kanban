
import { useEffect, useRef } from 'react';
import { useStore } from '../store/useStore';
import { filtersToSearchParams, searchParamsToFilters } from '../utils/urlState';

export function useUrlSync() {
  const { filters, setFilters } = useStore();
  const isInitialMount = useRef(true);
  const isPopState = useRef(false);


  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const filtersFromUrl = searchParamsToFilters(params);

    if (Object.keys(filtersFromUrl).length > 0) {
      setFilters(filtersFromUrl);
    }
  }, []);


  useEffect(() => {

    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }


    if (isPopState.current) {
      isPopState.current = false;
      return;
    }

    const params = filtersToSearchParams(filters);
    const newUrl = params.toString()
      ? `${window.location.pathname}?${params.toString()}`
      : window.location.pathname;

    
    window.history.pushState({ filters }, '', newUrl);
  }, [filters]);


  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      isPopState.current = true;
      const params = new URLSearchParams(window.location.search);
      const filtersFromUrl = searchParamsToFilters(params);

      if (Object.keys(filtersFromUrl).length === 0) {
        useStore.getState().clearFilters();
      } else {
        setFilters(filtersFromUrl);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [setFilters]);
}