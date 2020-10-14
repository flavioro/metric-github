export interface IRepositoryRequest {
  id: number;
  name: string;
  full_name: string;
  open_issues_count: number;
}

export interface IRepositoryResponse {
  id: number;
  name: string;
  full_name: string;
}
