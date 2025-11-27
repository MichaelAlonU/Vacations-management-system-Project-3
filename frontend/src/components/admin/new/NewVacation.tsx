import './NewVacation.css';
import { useForm } from 'react-hook-form';
import { joiResolver } from '@hookform/resolvers/joi';
import { createNewVacationValidator } from './../../../../../backend/src/controllers/vacations/validator';
import VacationDraft from '../../../models/VacationDraft';
import VacationService from '../../../services/auth-aware/VacationService';
import { useService } from '../../../hooks/use-service';
import { useNavigate } from 'react-router-dom';
import SpinnerButton from '../../common/spinner-button/SpinnerButton';
import { useState } from 'react';

export default function NewVacation() {
    const vacationService = useService(VacationService);
    const navigate = useNavigate();

    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<VacationDraft>({
        resolver: joiResolver(createNewVacationValidator),
        defaultValues: {
            destination: '',
            description: '',
            startTime: '',
            endTime: '',
            price: 0,
            image: undefined
        }
    });

    const [preview, setPreview] = useState<string | null>(null);

    function previewImage(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (file) {
            setPreview(URL.createObjectURL(file));
        } else {
            setPreview(null);
        }
    }

    async function onSubmit(data: VacationDraft) {

        if (data.image) {
            data.image = (data.image as unknown as FileList)[0];
        }
        try {
            await vacationService.newVacation(data);
            alert('Vacation created');
            reset();
            navigate('/Admin');
        } catch (err) {
            console.error(err);
            alert('Failed to create vacation');
        }
    }

    return (

        <div className='NewVacation'>
            <h3> Add Vacation</h3>
            <form onSubmit={handleSubmit(onSubmit)} className='new-vacation-form'>

                <label>Destination</label>
                <textarea {...register('destination')} />
                <div className='formError'>{errors.destination?.message}</div>

                <label>Description</label>
                <textarea {...register('description')} />
                <div className='formError'>  {errors.description?.message} </div>

                <label>Start time</label>
                <input type='datetime-local' {...register('startTime')} />
                <div className='formError'>{errors.startTime?.message}</div>

                <label>End time</label>
                <input type='datetime-local' {...register('endTime')} />
                <div className='formError'>{errors.endTime?.message}</div>

                <label>Price</label>
                <input type='number' {...register('price', { valueAsNumber: true })} />
                <div className='formError'>{errors.price?.message}</div>

                <label> Image </label>
                <input type="file" accept="image/*" {...register('image')} onChange={previewImage} />
                {preview && <img src={preview} style={{ width: 200, marginTop: 10 }} />}
                <div className='formError'>{errors.image?.message}</div>

                <SpinnerButton
                    buttonText='Add Vacation'
                    loadingText='adding vacation...'
                    isSubmitting={isSubmitting}
                />

                <button type='button' onClick={() => reset()}> Reset </button>

            </form>
        </div>
    );
}