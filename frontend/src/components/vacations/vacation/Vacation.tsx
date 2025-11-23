import { useEffect } from 'react';
import './Vacation.css';
import Spinner from '../../common/spinner/Spinner';
import useTitle from '../../../hooks/use-title';
import { useAppDispatcher, useAppSelector } from '../../../redux/hooks';
import { init } from '../../../redux/vacationSlice';
import VacationService from '../../../services/auth-aware/VacationService';
import { RootState } from '../../../redux/store';
import VacationCard from '../VacationCard/VacationCard';

export default function Vacations() {

    useTitle('Vacations R Us');

    const vacationService = useService(VacationService);
    const vacations = useAppSelector((state: RootState) => state.vacations.vacations);
    const isAdmin = useAppSelector((state: RootState) => state.auth.user.isAdmin);
    const dispatch = useAppDispatcher();

    useEffect(() => {
        (async () => {
            try {
                if (vacations.length === 0) {
                    const vacationFromServer = await vacationService.getAll();
                    dispatch(init(vacationFromServer));
                }
            } catch (e) {
                alert(e);
            }
        })();
    }, [dispatch, vacations.length]);

    // useEffect(() => {
    //     if (newVacation) {
    //         setTimeout(() => {
    //             dispatch(postAged());
    //         }, 2000);
    //     }
    // }, [dispatch, newVacation]);

    return (
        <div className='Vacations'>
            {vacations.length > 0 ? (
                <>
                    {vacations.map(vac => (
                        <VacationCard
                            key={vac.id}
                            vacation={vac}
                            isEditAllowed={isAdmin}
                            isDeleteAllowed={isAdmin}
                            isLikeAllowed={!isAdmin}
                        />
                    ))}
                </>) : (
                <>
                    <p>Loading vacations...</p>
                    <Spinner />
                </>
            )}
        </div>
    );
}