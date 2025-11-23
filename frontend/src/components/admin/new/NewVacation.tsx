import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import './NewVacation.css';
// import TeamsService from '../../../services/teams';
// import MeetingsService from '../../../services/meetings';
// import { Team } from '../../../models/Teams';
// import { MeetDraft } from '../../../models/MeetDraft';
export default function NewVacation() {
    const [teams, setTeams] = useState<Team[]>([]);
    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<MeetDraft>();

    useEffect(() => {
        TeamsService.getAll().then(t => setTeams(t)).catch(console.error);
    }, []);

    async function onSubmit(data: MeetDraft) {
        try {
            await MeetingsService.create(data);
            alert('Meeting created');
            reset();
        } catch (err) {
            console.error(err);
            alert('Failed to create meeting');
        }
    }

    return (
        <div className='NewVacation'>
            <h3>New Vacation</h3>
            <form onSubmit={handleSubmit(onSubmit)} className='new-vacation-form'>
                <label>Team</label>
                {/* <select {...register('teamId', { required: 'Please choose a team' })}>
                    <option value=''>-- choose team --</option>
                    {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
                <div className='formError'>{errors.teamId?.message}</div> */}

                <label>Start time</label>
                <input type='datetime-local' {...register('startTime', { required: 'Start time is required' })} />
                <div className='formError'>{errors.startTime?.message}</div>

                <label>End time</label>
                <input type='datetime-local' {...register('endTime', { required: 'End time is required' })} />
                <div className='formError'>{errors.endTime?.message}</div>

                <label>Room</label>
                <input {...register('meetRoom', { required: 'Room is required', minLength: { value: 2, message: 'Room must be at least 2 characters' } })} />
                <div className='formError'>{errors.meetRoom?.message}</div>

                <label>Description</label>
                <textarea {...register('description', { required: 'Description is required', minLength: { value: 5, message: 'Description must be at least 5 characters' } })} />
                <div className='formError'>{errors.description?.message}</div>

                <button type='submit' disabled={isSubmitting}>{isSubmitting ? 'Saving...' : 'Create Meeting'}</button>
            </form>
        </div>
    );
}