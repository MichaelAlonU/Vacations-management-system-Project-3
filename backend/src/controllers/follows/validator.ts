import Joi from "joi";

export const followValidator = Joi.object({
    vacationId: Joi.string().uuid().required()
})

export const unfollowValidator = followValidator