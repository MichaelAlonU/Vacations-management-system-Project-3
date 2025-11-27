import './VacationCard.css';
import { useAppDispatcher } from '../../../redux/hooks';
import { useService } from '../../../hooks/use-service';
import FollowersService from '../../../services/auth-aware/FollowersService';
import { follow, unfollow } from '../../../redux/vacationSlice';

interface Props {
    vacation: any;
    isEditAllowed: boolean;
    isDeleteAllowed: boolean;
    isLikeAllowed: boolean;
}

export default function VacationCard({ vacation, isEditAllowed, isDeleteAllowed, isLikeAllowed }: Props) {

    const dispatcher = useAppDispatcher();
    const followersService = useService(FollowersService)

    async function toggleLike() {
        try {
            if (vacation.isFollowed) {
                await followersService.unfollow(vacation.id);
                dispatcher(unfollow(vacation.id));
            } else {
                await followersService.follow(vacation.id);
                dispatcher(follow(vacation.id));
            }
        } catch (e) {
            alert(e);
        }
    }

    return (
        <div className="VacationCard">
            <h3>{vacation.destination}</h3>
            <img src={`${import.meta.env.VITE_S3_URL}${vacation.imageUrl}`} alt={vacation.destination} />

            <p>{vacation.description}</p>
            <p>{vacation.price}$</p>

            {isLikeAllowed && (
                <button
                    className={vacation.isFollowed ? "liked" : ""}
                    onClick={toggleLike}
                >
                    {vacation.isFollowed ? "❤️" : "🤍"}
                </button>
            )}

            {isEditAllowed && (
                <button className="edit-btn">
                    Edit
                </button>
            )}

            {isDeleteAllowed && (
                <button className="delete-btn">
                    Delete
                </button>
            )}
        </div>
    );
}