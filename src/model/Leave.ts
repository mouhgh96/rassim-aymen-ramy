export interface Leave {
  id: string;
  leaveDay: string;
  updatedAt: string;
  state: number;
  firstName: string;
  lastName: string;
  description: string;
  destination: string;
  motif?: string;
  user: {
    firstName: string;
    lastName: string;
    function?: string;
  };
  duration: number;
}
