import { inject, injectable } from "tsyringe";
import { Api } from "@/@core/services/api";
import {
  IUserRepository,
  IUserResponse,
} from "../interfaces/user/userRepository";
import { IUser } from "../entities/user";
import { IGlobalResponse } from "@/@core/interfaces/api";

@injectable()
export class UserRepository implements IUserRepository {
  constructor(@inject("ApiService") private api: Api) {}

  async getUsers(page: number, page_size: number, search: string) {
    try {
      const { data } = await this.api.get<IUserResponse>(
        `user/users/?page=${page}&page_size=${page_size}&search=${search}`,
      );
      return data;
    } catch (error) {
      throw error;
    }
  }

  async getUserById(id: string): Promise<IUser> {
    try {
      const { data } = await this.api.get<IUser>(`user/users/${id}`);
      return data;
    } catch (error) {
      throw error;
    }
  }

  async createUser(user: IUser): Promise<IUser> {
    try {
      const { data } = await this.api.post<IUser>("user/users/", user);
      return data;
    } catch (error) {
      throw error;
    }
  }

  async editUser(user: IUser): Promise<IUser> {
    try {
      const { data } = await this.api.patch<IUser>(
        `user/users/${user.id}/`,
        user,
      );
      return data;
    } catch (error) {
      throw error;
    }
  }

  async deleteUser(id: string | undefined): Promise<IUser> {
    try {
      const { data } = await this.api.delete<IUser>(`user/users/${id}/`);
      return data;
    } catch (error) {
      throw error;
    }
  }

  async getUserByDocumentNumber(
    document_number: string,
  ): Promise<IGlobalResponse<IUser>> {
    try {
      const { data } = await this.api.get<IGlobalResponse<IUser>>(
        `user/users/?document_number=${document_number}`,
      );
      return data;
    } catch (error) {
      throw error;
    }
  }

  async updateUser(id: string, user: Partial<IUser>): Promise<IUser> {
    try {
      const { data } = await this.api.patch<IUser>(`user/users/${id}/`, user);
      return data;
    } catch (error) {
      throw error;
    }
  }

  async uploadAvatar(formData: FormData, id: any): Promise<IUser> {
    try {
      const { data } = await this.api.postFormData<IUser>(
        `user/users/${id}/upload-avatar/`,
        formData,
      );
      return data;
    } catch (error) {
      throw error;
    }
  }

  async changePassword(passwordData: {
    user_id: string;
    new_password: string;
  }): Promise<void> {
    const { data } = await this.api.post(`user/change_password/`, passwordData);
    return data;
  }
}
