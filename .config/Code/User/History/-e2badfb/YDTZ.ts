import { inject, injectable } from "tsyringe";

import { ISessionRepository } from "../interfaces/sessionRepository";
import { ISession, ISessionAmount, ISessionCreate, ISessionDetail, ISessionService } from "../entities/session";
import { Api } from "@/@core/services/api";

@injectable()
export class SessionRepository implements ISessionRepository {
  constructor(@inject("ApiService") private api: Api) { }

  async getSessions(): Promise<ISession[]> {
    const { data } = await this.api.get("/session/sessions/");
    return data
  }

  async createSession(session: Partial<ISessionCreate>): Promise<ISession> {
    const { data } = await this.api.post("/session/sessions/", session);
    return data
  }

  async editSession(session: Partial<ISessionCreate>): Promise<ISession> {
    const { data } = await this.api.patch(`/session/sessions/${session.id}/`, session);
    return data
  }

  async getSessionsByDate(startDate: string, endDate: string, search: string, filters: object): Promise<ISession[]> {
    const { data } = await this.api.post(`/session/sessions/sessions-by-date/?start_date=${startDate}&end_date=${endDate}&search=${search}`, {
      filters
    });
    console.log("data", data)
    return data
  }

  async getSessionById(id: string): Promise<ISessionDetail> {
    const { data } = await this.api.get(`/session/sessions/${id}/`);
    return data
  }

  async toggleCompletedActivity(requestData: any): Promise<any> {
      const { data } = await this.api.post("/session/session-services/toggle-completed-activity/", requestData);
      return data
  }

  async addSessionService(id: string, requestData: any): Promise<ISessionService> {
      const { data } = await this.api.post(`/session/sessions/${id}/add-session-service/`, requestData);
      return data
  }

  async removeSessionService(id: string, requestData: any): Promise<ISessionService> {
      const { data } = await this.api.post(`/session/sessions/${id}/remove-session-service/`, requestData);
      return data
  }

  async completeSession(id: string, requestData: FormData): Promise<ISession> {
      const { data } = await this.api.postFormData(`/session/sessions/${id}/complete-session/`, requestData);
      return data
  }

  async cancelSession(id: string, cashId: string): Promise<{ id: string }> {
      const { data } = await this.api.post(`/session/sessions/${id}/cancel-session/`, {
        cash: cashId
      });
      return data
  }

  async getCompletedSessions(): Promise<ISession[]> {
    const { data } = await this.api.get("/session/sessions/completed-sessions/");
    return data
  }

  async getSessionsWeek(): Promise<ISession[]> {
    const { data } = await this.api.get("/session/sessions/week/");
    return data
  }

  async getSessionsMonth(): Promise<ISession[]> {
    const { data } = await this.api.get("/session/sessions/month/");
    return data
  }

  async getCompletedAndPendingCount(): Promise<any> {
    const { data } = await this.api.get("/session/sessions/completed-and-pending-count/");
    return data
  }

  async getTotalSessionAmount(): Promise<ISessionAmount> {
      const { data } = await this.api.get<ISessionAmount>(`/session/sessions/total`);
      return data;
  }

  async getSessionMonthServiceStats(): Promise<any> {
    const { data } = await this.api.get<any>(`/session/sessions/month-service-stats`);
    return data;
  }
}
