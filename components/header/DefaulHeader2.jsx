import cookie from 'js-cookie';
import Link from "next/link";
import { useEffect, useState } from "react";
import fetchFromApi from '../../pages/api/api';
import HeaderNavContent from "./HeaderNavContent";

const DefaulHeader2 = () => {
  const [navbar, setNavbar] = useState(false);
  const [user, setUser] = useState(null);

  const isLoggedIn = !!cookie.get('token');
  const changeBackground = () => {
    if (window.scrollY >= 10) {
      setNavbar(true);
    } else {
      setNavbar(false);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      const token = cookie.get('token');

      if (token) {
        try {
          const data = await fetchFromApi('user/', 'GET', null, {
            Authorization: `Token ${token}`,
          });

          setUser(data[0]);
        } catch (error) {
          console.error('Failed to fetch user:', error);
        }
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", changeBackground);
  }, []);

  return (
    <header
      className={`main-header  ${navbar ? "fixed-header animated slideInDown" : ""
        }`}
    >
      <div className="main-box">
        <div className="nav-outer">
          <div className="logo-box">
            <div className="logo">
              <Link href="/">
                <img src="/images/logo.svg" alt="brand" />
              </Link>
            </div>
          </div>
          <HeaderNavContent />
        </div>

        <div className="outer-box">
          {user && (
            <Link href={user?.is_employer ? '/employer/dashboard' : "/candidate/profile"} className="my-profile">
              <img
                alt="avatar"
                className="thumb"
                src={user.avatar}
                width={50}
                style={{ objectFit: 'cover' }}
                height={50}
              />
              <span className="name">My Account</span>
            </Link>
          )}
          {user && user.is_employer && (
            <Link href="/employer/post-jobs" className="theme-btn btn-style-one">
              Post a Job
            </Link>
          )}

          <div className="btn-box">
            {!isLoggedIn && (
              <a
                href="#"
                className="theme-btn btn-style-three call-modal"
                data-bs-toggle="modal"
                data-bs-target="#loginPopupModal"
              >
                Login / Register
              </a>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default DefaulHeader2;
