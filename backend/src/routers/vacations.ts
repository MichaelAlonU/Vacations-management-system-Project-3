import { Router } from "express";
import { authorize } from "../middlewares/authorize";
import validation from "../middlewares/validation";
import { createNewVacationValidator, newVacationImageValidator, updateVacationImageValidator, updateVacationValidator } from "../controllers/vacations/validator";
import { createNewVacation, deleteVacation, getAll, updateVacation } from "../controllers/vacations/controller";
import fileUploader from "../middlewares/file-uploader";
import fileValidation from "../middlewares/file-validation";
// import { createMeet, /*filterByMaxPrice,*/ filterByTeam } from "../controllers/meeting/controller";
// import { createMeetValidator, meetingsByTeamIdValidator } from "../controllers/meeting/validator";
// import paramValidation from "../middlewares/param-validation";

const router = Router()

// router.get('/by-team/:teamId', paramValidation(meetingsByTeamIdValidator) , filterByTeam)
router.get('/', getAll)
router.post('/', authorize(`ADMIN`), fileValidation(newVacationImageValidator), fileUploader, validation(createNewVacationValidator), createNewVacation)
router.patch('/:id', authorize(`ADMIN`), fileValidation(updateVacationImageValidator), fileUploader, validation(updateVacationValidator), updateVacation)
router.delete('/:id', authorize(`ADMIN`), deleteVacation)

export default router