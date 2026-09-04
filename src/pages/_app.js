import '../styles/globals.css';
import NavigationBar from '../components/navbar';

export default function App({ Component, pageProps }) {
    return (
        <>
            <NavigationBar />
            <Component {...pageProps} />
        </>
    );
}
