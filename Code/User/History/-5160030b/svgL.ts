import { ISession, ISessionAmount, ISessionCreate, ISessionDetail, ISessionService } from "../entities/session";

export interface ISessionRepository {
  getSessions(): Promise<ISession[]>;
  createSession(session: Partial<ISessionCreate>): Promise<ISession>;
  editSession(session: Partial<ISessionCreate>): Promise<ISession>;
  getSessionsByDate(startDate: string, endDate: string, search: string, filters: object): Promise<ISession[]>;
  getSessionById(id: string): Promise<ISessionDetail>;
  toggleCompletedActivity(requestData: any): Promise<any>;
  addSessionService(id: string, requestData: any): Promise<ISessionService>;
  removeSessionService(id: string, requestData: any): Promise<ISessionService>;
  completeSession(id: string, requestData: FormData): Promise<ISession>;
  cancelSession(id: string, cashId: string): Promise<{ id: string }>;
  getSessionsWeek(): Promise<ISession[]>;
  getSessionsMonth(): Promise<ISession[]>;
  getCompletedAndPendingCount(): Promise<any>;
  getTotalSessionAmount: () => Promise<ISessionAmount>;
  getSessionMonthServiceStats: () => Promise<any>;
}
