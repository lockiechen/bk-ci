export interface Flow {
  id: number;
  name: string;
  groupName: string;
  lastExecution: string;
  executionTime: string;
  status: string;
  creator: string;
  updateTime: string;
  flowAction: [];
}