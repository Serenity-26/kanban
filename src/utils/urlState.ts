import { Filters, Status, Priority } from '../types';

export function filtersToSearchParams(filters: Filters): URLSearchParams {
  const params = new URLSearchParams();

  if (filters.status.length > 0) {
    params.set('status', filters.status.join(','));
  }
  if (filters.priority.length > 0) {
    params.set('priority', filters.priority.join(','));
  }
  if (filters.assignee.length > 0) {
    params.set('assignee', filters.assignee.join(','));
  }
  if (filters.dueDateFrom) {
    params.set('dueDateFrom', filters.dueDateFrom);
  }
  if (filters.dueDateTo) {
    params.set('dueDateTo', filters.dueDateTo);
  }

  return params;
}

export function searchParamsToFilters(searchParams: URLSearchParams): Partial<Filters> {
  const filters: Partial<Filters> = {};

  const statusParam = searchParams.get('status');
  if (statusParam) {
    filters.status = statusParam.split(',') as Status[];
  }

  const priorityParam = searchParams.get('priority');
  if (priorityParam) {
    filters.priority = priorityParam.split(',') as Priority[];
  }

  const assigneeParam = searchParams.get('assignee');
  if (assigneeParam) {
    filters.assignee = assigneeParam.split(',');
  }

  const dueDateFrom = searchParams.get('dueDateFrom');
  if (dueDateFrom) {
    filters.dueDateFrom = dueDateFrom;
  }

  const dueDateTo = searchParams.get('dueDateTo');
  if (dueDateTo) {
    filters.dueDateTo = dueDateTo;
  }

  return filters;
}
