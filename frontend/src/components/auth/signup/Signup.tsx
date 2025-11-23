import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import UserDraft from "../../../models/UserDraft";
import authService from "../../../services/auth";

export default function Signup() {

    const { register, handleSubmit, formState: { errors } } = useForm<UserDraft>();
    const navigate = useNavigate();

    async function submit(data: UserDraft) {

        try {
            await authService.signup(data);
            alert("Signup successful!");
            navigate("/login");
        }
        catch (err: any) {
            if (err.response?.status === 409) {
                alert("Email already exists");
            } else {
                alert("Signup failed");
            }
        }
    }

    return (
        <form onSubmit={handleSubmit(submit)} className="auth-form">

            <h2>Sign Up</h2>

            <label>First Name:</label>
            <input
                {...register("firstName", {
                    required: "First name is required",
                    minLength: {
                        value: 2,
                        message: "First name must be at least 2 characters long"
                    }
                })}
                type="text"
            />
            {errors.firstName && <p className="error">{errors.firstName.message}</p>}

            <label>Last Name:</label>
            <input
                {...register("lastName", {
                    required: "Last name is required",
                    minLength: {
                        value: 2,
                        message: "Last name must be at least 2 characters long"
                    }
                })}
                type="text"
            />
            {errors.lastName && <p className="error">{errors.lastName.message}</p>}

            <label>Email:</label>
            <input
                {...register("email", {
                    required: "Required",
                    pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "Invalid email"
                    }
                })}
                type="email"
            />
            {errors.email && <p className="error">{errors.email.message}</p>}

            <label>Password:</label>
            <input
                {...register("password", {
                    required: "Required",
                    minLength: { value: 4, message: "Password must have minimum 4 characters"}
                })}
                type="password"
            />
            {errors.password && <p className="error">{errors.password.message}</p>}

            <button>Sign Up</button>
        </form>
    );
}