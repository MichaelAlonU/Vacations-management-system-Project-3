import AuthAware from "./AuthAware";

export default class FollowersService extends AuthAware {
    
    async unfollow(vacationId: string): Promise<boolean> {
        const { data } = await this.axiosInstance.delete<boolean>(`/follow/${vacationId}`);
        return data;
    }

    async follow(vacationId: string): Promise<boolean> {
        const { data } = await this.axiosInstance.post<boolean>(`/follow/${vacationId}`);
        return data;
    }
}
