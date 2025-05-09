import { ComputedRef } from "vue";
import {
  ISession,
  ISessionCreate,
  ISessionDetail,
  ISessionService,
} from "../entities/session";

export interface ISessionController {
  state: ISessionState;
  sessions: ComputedRef<ISession[]>;
  currentSession: ComputedRef<ISessionDetail | null>;
  getSessions: () => Promise<void>;
  createSession: (session: Partial<ISessionCreate>) => Promise<void>;
  editSession: (session: Partial<ISessionCreate>) => Promise<ISession>;
  getSessionsByDate: (startDate: string, endDate: string, search: string, filters: object) => Promise<void>;
  getSessionById: (id: string) => Promise<void>;
  toggleCompletedActivity: (requestData: any) => Promise<any>;
  addSessionService: (id: string, requestData: any) => Promise<ISessionService>;
  removeSessionService: (id: string, requestData: any) => Promise<ISessionService>;
  completeSession: (id: string, requestData: FormData) => Promise<ISession>;
  cancelSession: (id: string, cashId: string) => Promise<{ id: string }>;
  getSessionsWeek: () => Promise<ISession[]>;
  getSessionsMonth: () => Promise<ISession[]>;
  getCompletedAndPendingCount: () => Promise<any>;
  getTotalSessionAmount: () => Promise<any>;
  getSessionMonthServiceStats: () => Promise<any>;
}

export interface ISessionState {
  sessions: ISession[];
  currentSession: ISessionDetail | null;
}
