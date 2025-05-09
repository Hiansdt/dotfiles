import { defineStore } from "pinia";
import { ISessionPaymentController } from "../interfaces/sessionPaymentController";
import { container } from "tsyringe";
import { SessionPaymentRepository } from "../repository/sessionPaymentRepository";
import { IListSessionPayment } from "../entities/sessionPayment";
import { reactive } from "vue";
import { ISessionState } from "../interfaces/sessionController";

export const useSessionPaymentController = defineStore<
  "sessionPayment",
  ISessionPaymentController
>("sessionPayment", () => {
  const state = reactive<ISessionState>({
    sessions: [],
    currentSession: null,
  });

  const sessionPaymentRepository = container.resolve(SessionPaymentRepository);

  const paySessionPayment = async (
    sessionPaymentId: string,
    paymentMethodId: string,
    currentCashId: string,
  ): Promise<IListSessionPayment> => {
    const data = await sessionPaymentRepository.paySessionPayment(
      sessionPaymentId,
      paymentMethodId,
      currentCashId,
    );
    return data;
  };

  const getSessionPayments = async();

  return {
    paySessionPayment,
  };
});
