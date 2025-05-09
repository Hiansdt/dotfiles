import { IAddressResponse } from "@/auth/interfaces/user/userRepository";

export interface IEmployee {
    id: string;
    user: string;
    name: string;
    email: string;
    cpf: string;
    phone: string;
    address: IAddressResponse;
    pic: number;
  }

export interface IEmployeeEssential {
  id: string;
  name: string;
  avatar: string;
}

export interface IEmployeeDetail {
  id: string;
  user: string;
  name: string;
  email: string;
  cpf: string;
  phone: string;
  address: IAddressResponse;
  pic: number;
  updatedData?: any
}