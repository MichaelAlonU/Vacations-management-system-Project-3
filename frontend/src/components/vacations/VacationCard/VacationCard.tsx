import './VacationCard.css';
import { useAppDispatcher } from '../../../redux/hooks';
import { useService } from '../../../hooks/use-service';
import { follow, unfollow, deleteVacation, updateVacation } from '../../../redux/vacationSlice';
import { useNavigate } from 'react-router';
import VacationService from '../../../services/auth-aware/VacationService';
import { jwtDecode } from 'jwt-decode';

interface Props {
    vacation: any;
    isEditAllowed: boolean;
    isDeleteAllowed: boolean;
    isLikeAllowed: boolean;
}

interface JwtPayload { id: string }

export default function VacationCard({ vacation, isEditAllowed, isDeleteAllowed, isLikeAllowed }: Props) {
    const dispatcher = useAppDispatcher();
    const vacationService = useService(VacationService);
    const navigate = useNavigate();

    const token = localStorage.getItem('jwt');
    const currentUserId = token ? jwtDecode<JwtPayload>(token).id : null;
    async function handleDelete(id: string) {
        if (!confirm("Are you sure you want to delete this vacation?")) return;
        try {
            await vacationService.remove(id);
            dispatcher(deleteVacation(id));
            alert("Vacation deleted successfully");
        } catch (err) {
            alert(err);
        }
    }

    async function toggleLike() {
        if (!currentUserId) return;
        try {
            let updatedVacation;
            if (vacation.followers?.find((f: any) => f.id === currentUserId)) {
                updatedVacation = await vacationService.unfollow(vacation.id);
                dispatcher(unfollow({ id: vacation.id, userId: currentUserId }));
            } else {
                updatedVacation = await vacationService.follow(vacation.id);
                dispatcher(follow({ id: vacation.id, userId: currentUserId }));
            }
            dispatcher(updateVacation(updatedVacation));
        } catch (err) {
            alert(err);
        }
    }

    const isLikedByCurrentUser = vacation.followers?.some((f: any) => f.id === currentUserId);

    return (
        <div className="VacationCard">
            <img src={`${import.meta.env.VITE_S3_URL}${vacation.imageUrl}`} alt={vacation.destination} />
            <div className="card-content">
                <h4>{vacation.destination} </h4>
                <h6>                    <span className="date">{new Date(vacation.startTime).toLocaleDateString()} - {new Date(vacation.endTime).toLocaleDateString()}</span>
</h6>
                <div className="card-info">
                    <span className="price">${vacation.price}</span>
                </div>
                <p>{vacation.description.substring(0, 50)}...</p>
            </div>
            <div className="card-footer">
                {isLikeAllowed && <span className="followers-count">{vacation.followers?.length || 0} 👥</span>}
                <div className="btn-group">
                    {isLikeAllowed && (
                        <button className={`btn-like ${isLikedByCurrentUser ? 'liked' : ''}`} onClick={toggleLike}>
                            {isLikedByCurrentUser ? "❤️" : "🤍"}
                        </button>
                    )}
                    {isEditAllowed && (
                        <button className="btn-edit" onClick={() => navigate(`/vacations/edit/${vacation.id}`)}>✏️</button>
                    )}
                    {isDeleteAllowed && (
                        <button className="btn-delete" onClick={() => handleDelete(vacation.id)}>🗑️</button>
                    )}
                </div>
            </div>
        </div>
    );
}
