export interface IPaymentMethod {
    id: string;
    description: string;
    is_contract: string;
    tax_type: string | null;
    tax_value: number | null;
  }
  