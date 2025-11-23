import { NavLink } from 'react-router-dom';
import './Header.css';
import { useUsername } from '../../../hooks/use-username';
import { logout } from '../../../redux/auth-slice';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../redux/store';
import logo from '../../../assets/vacations-logo.jpg'

export default function Header() {
    const name = useUsername();
    const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
    const isAdmin = useSelector((state: RootState) => state.auth.isAdmin);
    const dispatch = useDispatch();

    return (

        <div className='Header'>
            <div>
                <img src={logo} />
            </div>
            <h1> Vacations R Us </h1>
            <nav>
                {!isLoggedIn && (
                    <>
                        <NavLink to="/auth">Sign up</NavLink> |
                        <NavLink to="/login">Login</NavLink>
                    </>
                )}

                {isLoggedIn && (
                    <>
                        <NavLink to="/vacations">Vacations</NavLink>
                        {isAdmin && (
                            <>
                                {/* &nbsp;|&nbsp;
                                <NavLink style={{ color: "red" }} to="/add-vacation">
                                    Add
                                </NavLink> */}

                                &nbsp;|&nbsp;
                                <NavLink style={{ color: "red" }} to="/vacations/manage">
                                    Manage
                                </NavLink>
                            </>
                        )}
                    </>
                )}
            </nav>
            {isLoggedIn && (
                <div>
                    Welcome {name}!&nbsp;
                    <button onClick={ ()=> dispatch(logout()) }> Logout </button>
                </div>
            )}

        </div>
    );
}