import Vacation from "../../models/Vacation";
import VacationDraft from "../../models/VacationDraft";
import AuthAware from "./AuthAware";

export default class VacationService extends AuthAware {

    async getAll(): Promise<Vacation[]> {
        const response = await this.axiosInstance.get<Vacation[]>(`/vacations`);
        return response.data;
    }

    async remove(id: string): Promise<boolean> {
        const response = await this.axiosInstance.delete(`/vacations/${id}`);
        return response.data;
    }

    async newVacation(draft: VacationDraft): Promise<Vacation> {
        const response = await this.axiosInstance.post<Vacation>(`/vacations`, draft, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    }

    async editVacation(id: string, draft: VacationDraft): Promise<Vacation> {
        const response = await this.axiosInstance.patch<Vacation>(`/vacations/${id}`, draft);
        return response.data;
    }
}