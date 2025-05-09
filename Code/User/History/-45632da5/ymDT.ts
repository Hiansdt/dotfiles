import { defineStore } from "pinia";
import { ISessionPaymentController } from "../interfaces/sessionPaymentController";
import { container } from "tsyringe";
import { SessionPaymentRepository } from "../repository/sessionPaymentRepository";
import { IListSessionPayment } from "../entities/sessionPayment";


export const useSessionPaymentController = defineStore<'sessionPayment', ISessionPaymentController>("sessionPayment", () => {

    const sessionPaymentRepository = container.resolve(SessionPaymentRepository)

    const paySessionPayment = async (sessionPaymentId: string, paymentMethodId: string): Promise<IListSessionPayment> => {
        const data = await sessionPaymentRepository.paySessionPayment(sessionPaymentId, paymentMethodId)
        return data
    }

    return {
        paySessionPayment
    }
})