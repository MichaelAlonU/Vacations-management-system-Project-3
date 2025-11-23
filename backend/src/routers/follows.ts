import { Router } from "express";
import paramValidation from "../middlewares/param-validation";
import { followValidator, unfollowValidator } from "../controllers/follows/validator";
import { follow, unfollow } from "../controllers/follows/controller";

const router = Router()

router.post('/follow/:vacationId', paramValidation(followValidator), follow)
router.delete('/unfollow/:vacationId', paramValidation(unfollowValidator), unfollow)

export default router