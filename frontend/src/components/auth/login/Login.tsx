import { useState } from "react";
import { useDispatch } from "react-redux";
import { useForm } from 'react-hook-form';
import Login from "../../../models/Login";
import SpinnerButton from "../../common/spinner-button/SpinnerButton";
import { login } from "../../../redux/auth-slice";
import authService from "../../../services/auth";
import { useNavigate } from "react-router-dom";


export default function Login() {

    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors } } = useForm<Login>();

    async function onSubmit(data: Login) {
        try {

            setIsSubmitting(true);
            const { jwt } = await authService.login(data);
            localStorage.setItem("jwt", jwt);
            dispatch(login(jwt));
            navigate("/vacations");

        } catch (err) {
            alert("Login failed");
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="login-form">

            <h2>Login</h2>

            <label>Email:</label>
            <input
                {...register("email", {
                    required: "Email is required",
                    pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "Email is invalid"
                    }
                })}
                type="email"
            />
            {errors.email && <p className="error">{errors.email.message}</p>}

            <label>Password:</label>
            <input
                {...register("password", {
                    required: "Password is required",
                    minLength: { value: 4, message: "Minimum 4 characters" }
                })}
                type="password"
            />
            {errors.password && <p className="error">{errors.password.message}</p>}

            <button type="submit">Login</button>
            <SpinnerButton
                buttonText='Login'
                loadingText='logging in...'
                isSubmitting={isSubmitting}
            />
        </form>
    )
};