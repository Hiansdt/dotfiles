import { defineStore } from "pinia";
import { ISessionPaymentController, ISessionPaymentState } from "../interfaces/sessionPaymentController";
import { container } from "tsyringe";
import { SessionPaymentRepository } from "../repository/sessionPaymentRepository";
import { IListSessionPayment } from "../entities/sessionPayment";
import { reactive } from "vue";

export const useSessionPaymentController = defineStore<
  "sessionPayment",
  ISessionPaymentController
>("sessionPayment", () => {
  const state = reactive<ISessionPaymentState>({
    sessionPayments: [],
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

  const getSessionPaymentsByCash = async(cashId: string) => {
    const data = await sessionPaymentRepository.getSessionPaymentsByCash(cashId);
    state.sessionPayments = data.results;
  };

  return {
    paySessionPayment,
    getSessionPaymentsByCash
  };
});
