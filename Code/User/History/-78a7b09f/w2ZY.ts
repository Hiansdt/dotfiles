import { computed, reactive } from "vue";
import { defineStore } from "pinia";

import { ISessionController, ISessionState } from "../interfaces/sessionController";
import { container } from "tsyringe";
import { SessionRepository } from "../repository/sessionRepository";
import { ISessionCreate } from "../entities/session";

export const useSessionController = defineStore<"sessions", ISessionController>(
  "sessions",
  () => {
    const state = reactive<ISessionState>({
      sessions: [],
      currentSession: null,
    })

    const sessionRepository = container.resolve(SessionRepository)

    const sessions = computed(() => state.sessions);
    const currentSession = computed(() => state.currentSession);

    const getSessions = async () => {
      const data = await sessionRepository.getSessions();
      state.sessions = data;
    }

    const createSession = async (session: Partial<ISessionCreate>) => {
      await sessionRepository.createSession(session);
      await getSessions();
    }

    const editSession = async (session: Partial<ISessionCreate>) => {
      const data = await sessionRepository.editSession(session);
      return data
    }

    const getSessionsByDate = async (startDate: string, endDate: string, search: string, filters: object) => {
      const data = await sessionRepository.getSessionsByDate(startDate, endDate, search, filters);
      state.sessions = data;
      console.log("data do controller", data)
    }

    const getSessionById = async (id: string) => {
      const data = await sessionRepository.getSessionById(id);
      state.currentSession = data;
    }

    const toggleCompletedActivity = async (requestData: any) => {
      const data = await sessionRepository.toggleCompletedActivity(requestData);
      return data
    }

    const addSessionService = async (id: string, requestData: any) => {
      const data = await sessionRepository.addSessionService(id, requestData);
      return data
    }

    const removeSessionService = async (id: string, requestData: any) => {
      const data = await sessionRepository.removeSessionService(id, requestData);
      return data
    }

    const completeSession = async (id: string, requestData: FormData) => {
      const data = await sessionRepository.completeSession(id, requestData);
      return data
    }

    const cancelSession = async (id: string, cashId: string) => {
      const data = await sessionRepository.cancelSession(id, cashId);
      return data
    }

    const getCompletedSessions = async () => {
      const data = await sessionRepository.getCompletedSessions();
      state.sessions = data;
    }

    const getSessionsWeek = async () => {
      const data = await sessionRepository.getSessionsWeek();
      return data;
    }

    const getSessionsMonth = async () => {
      const data = await sessionRepository.getSessionsWeek();
      return data;
    }

    const getCompletedAndPendingCount = async () => {
      const data = await sessionRepository.getCompletedAndPendingCount();
      return data
    }

    const getTotalSessionAmount = async () => {
      const data = await sessionRepository.getTotalSessionAmount();
      return data;
    }

    const getSessionMonthServiceStats = async () => {
      const data = await sessionRepository.getSessionMonthServiceStats();
      return data;
    }

    return {
      state,
      sessions,
      currentSession,
      getSessions,
      createSession,
      editSession,
      getSessionsByDate,
      getSessionById,
      toggleCompletedActivity,
      addSessionService,
      removeSessionService,
      completeSession,
      cancelSession,
      getCompletedSessions,
      getSessionsWeek,
      getCompletedAndPendingCount,
      getTotalSessionAmount,
      getSessionsMonth,
      getSessionMonthServiceStats
    }
  }
);
