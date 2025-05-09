import { IPlanCreate, IPlanList } from "../entities/plan";
import { ComputedRef } from "vue";

export interface IPlanController {
    plans: ComputedRef<IPlanList[]>;
    planSelected: ComputedRef<IPlanList>;
    getPlans: () => Promise<void>;
    createPlan: (plan: IPlanCreate) => Promise<void>;
    deletePlan: (id: string) => Promise<void>;
    getPlanById: (id: string) => Promise<IPlanList>;
}

export interface IPlanState {
    plans: IPlanList[];
    planSelected: IPlanList;
}