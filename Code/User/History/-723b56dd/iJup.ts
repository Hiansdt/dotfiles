interface IPaymentMethod {
    method: string;
    value: number;
  }
  
  export interface ICash {
    id: string;
    company: string;
    number: string;
    opened_at: Date;
    closed_at: Date;
    value: number;
    status: string;
    obs: String;
    checked_value: number;
    payment_methods: IPaymentMethod[];
    services: any[]
  }
  