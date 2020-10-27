export interface Exit {
  id: string;
  exitDay: string;
  updatedAt: string;
  state: number;
  description: string;
  destination: string;
  exitHour: number;
  returnHour: number;
  motif?: string;
  user: {
    firstName: string;
    lastName: string;
    function?: string;
  };
  duration: number;
}
