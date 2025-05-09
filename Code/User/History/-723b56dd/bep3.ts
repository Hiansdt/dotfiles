interface IPaymentMethod {
    method: string;
    value: number;
  }
  
  export interface IExtractService {
    description: string,
    value: number,
    payment_method: string,
    plate: string,
    driver: string,
    carrier: string,
    operation_terminal: string
  }
  
  export interface ICash {
    id: string;
    company: string;
    employee: string;
    employee_name: string;
    employee_id: string;
    number: string;
    opened_at: Date;
    closed_at: Date;
    value: number;
    status: string;
    validated_by: string;
    validated_at: Date;
    obs: String;
    checked_value: number;
    payment_methods: IPaymentMethod[];
    services: any[]
  }
  