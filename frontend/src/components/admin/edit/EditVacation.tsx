import { useNavigate, useParams } from "react-router-dom";
import { useService } from "../../../hooks/use-service";
import VacationService from "../../../services/auth-aware/VacationService";
import { useAppDispatcher, useAppSelector } from "../../../redux/hooks";
import VacationDraft from "../../../models/VacationDraft";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Spinner from "../../common/spinner/Spinner";
import { updateVacationValidator } from "../../../../../backend/src/controllers/vacations/validator";
import { joiResolver } from "@hookform/resolvers/joi";
import SpinnerButton from "../../common/spinner-button/SpinnerButton";
import { init } from "../../../redux/vacationSlice";

export default function EditVacation() {

    const { id } = useParams<'id'>();
    const vacation = useAppSelector(state => state.vacations.vacations.find(v => v.id === id));
    const dispatch = useAppDispatcher();
    const navigate = useNavigate();
    const vacationService = useService(VacationService);
    const [isReady, setIsReady] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);

    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } =
        useForm<VacationDraft>({
            resolver: joiResolver(updateVacationValidator)
        });

        useEffect(() => {
        (async () => {

            let vac = vacation;

            if (!vac) {
                const vacationsFromServer = await vacationService.getAll();
                dispatch(init(vacationsFromServer));
                vac = vacationsFromServer.find(v => v.id === id);

                if (!vac) {
                    alert("Vacation not found");
                    navigate("/vacations");
                    return;
                }
            }
            const { destination, description, startTime, endTime, price} = vac
            const draft = { destination, description, startTime, endTime, price, image: null }
            reset(draft)

            setIsReady(true);

        })();
    }, [id, vacation, dispatch, reset]);

    function previewImage(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (file) {
            setPreview(URL.createObjectURL(file));
        } else {
            setPreview(null);
        }
    }

    async function submit(draft: VacationDraft) {
        try {
            if (draft.image) {
                draft.image = (draft.image as unknown as FileList)[0];
            }
            await vacationService.editVacation(id!, draft);
            alert('Vacation updated successfully');
            navigate('/vacations');
        } catch (e) {
            alert(e);
        }
    }

    return (
        <div className='EditVacation'>
            {!isReady && <Spinner />}

            {isReady && (
                <>
                    <h3>Edit Vacation</h3>

                    <form onSubmit={handleSubmit(submit)}>

                        <label>Destination</label>
                        <textarea {...register('destination')} />
                        <div className='formError'>{errors.destination?.message}</div>

                        <label>Description</label>
                        <textarea {...register('description')} />
                        <div className='formError'>{errors.description?.message}</div>

                        <label>Start time</label>
                        <input type='datetime-local' {...register('startTime')} />
                        <div className='formError'>{errors.startTime?.message}</div>

                        <label>End time</label>
                        <input type='datetime-local' {...register('endTime')} />
                        <div className='formError'>{errors.endTime?.message}</div>

                        <label>Price</label>
                        <input type='number' {...register('price', { valueAsNumber: true })} />
                        <div className='formError'>{errors.price?.message}</div>

                        <label>Image</label>
                        <input type="file" accept="image/*" {...register('image')} onChange={previewImage} />
                        {preview ? (
                            <img src={preview} style={{ width: 200, marginTop: 10 }} />
                        ) : (
                            vacation?.imageUrl && <img src={`${import.meta.env.VITE_S3_URL}${vacation?.imageUrl}`} style={{ width: 200, marginTop: 10 }} />
                        )}
                        <div className='formError'>{errors.image?.message}</div>
                        <button type="button" onClick={() => { setPreview(null) }}> Remove Image </button>

                        <SpinnerButton
                            buttonText='Update Vacation'
                            loadingText='Updating vacation…'
                            isSubmitting={isSubmitting}
                        />

                        <button type='button' onClick={() => reset()}>Reset</button>

                    </form>
                </>
            )}
        </div>
    );
}
