import { RootState } from '../../../redux/store'
import { useSelector } from 'react-redux';
import Footer from '../footer/Footer';
import Header from '../header/Header';
import Main from '../main/Main';
import './Layout.css';
import { Navigate } from 'react-router-dom';

export default function Layout() {

    const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);

    return (

        <div className='Layout'>

            <header>
                <Header />
            </header>

            {isLoggedIn && (
                <main>
                    <Main />
                </main>
            )}

            {!isLoggedIn && <Navigate to="/login" replace />}

            <footer>
                <Footer />
            </footer>


        </div>
    );
}