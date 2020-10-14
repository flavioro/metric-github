interface IGitIssueCountByDate {
  [key: string]: number;
}

export interface IGitOpenedIssuesStats {
  name: string;
  open_issues: number;
  average: number;
  deviation: number;
}

export interface IDataset {
  label: string;
  data: number[];
  backgroundColor: string;
}

export interface IGitIssuesChartStats {
  labels: string[];
  datasets: IDataset[];
}

export interface IGitIssuesChartStatsRequest {
  [key: string]: {
    opened: IGitIssueCountByDate;
    closed: IGitIssueCountByDate;
  };
}
