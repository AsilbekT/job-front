import Aos from 'aos';
import 'aos/dist/aos.css';
import { useEffect } from 'react';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { store } from '../app/store';
import ScrollToTop from '../components/common/ScrollTop';
import '../styles/index.scss';
import UserProvider from './context/UserContext';

if (typeof window !== 'undefined') {
  require('bootstrap/dist/js/bootstrap');
}

function MyApp({ Component, pageProps }) {
  // aos animation activation
  useEffect(() => {
    Aos.init({
      duration: 1400,
      once: true,
    });
  }, []);

  return (
    <UserProvider>
      <Provider store={store}>
        <div className="page-wrapper">
          <Component {...pageProps} />

          {/* Toastify */}
          <ToastContainer
            position="bottom-right"
            autoClose={500}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored"
          />
          {/* <!-- Scroll To Top --> */}
          <ScrollToTop />
        </div>
      </Provider>
    </UserProvider>
  );
}

export default MyApp;
