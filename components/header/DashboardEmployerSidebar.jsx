import Cookies from "js-cookie";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCallback, useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import employerMenuData from "../../data/employerMenuData";
import { menuToggle } from "../../features/toggle/toggleSlice";
import { useFetch } from "../../hooks/useFetch";
import { UserContext } from "../../pages/context/UserContext";
import { isActiveLink } from "../../utils/linkActiveChecker";
import Modal from "../Modal";

const DashboardEmployerSidebar = () => {
    const router = useRouter();
    const { menu } = useSelector((state) => state.toggle);
    const user = useContext(UserContext);

    const dispatch = useDispatch();
    // menu togggle handler
    const menuToggleHandler = () => {
        dispatch(menuToggle());
    };

    useEffect(() => {
        if (user && !user.is_employer) {
            router.replace('/candidate/profile');
        }
    }, [user]);

    const userFetch = useFetch();
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const onLogOut = useCallback(async () => {
        Cookies.remove('token');
        await router.replace('/');
        window.location.reload();
    }, [router]);


    const onDeleteProfile = useCallback(async () => {
        await userFetch.makeRequest(`/user/${user.id}/`, {
            method: 'DELETE',
        });
        onLogOut();
    }, [user, onLogOut]);

    return (
        <>
            {showDeleteModal && (
                <Modal
                    primaryAction={onDeleteProfile}
                    onClose={() => setShowDeleteModal(false)}
                    title="Delete profile"
                    primaryActionTitle="Confirm"
                >
                    <span className="error w-100 d-flex justify-content-center">
                        Are you sure you want to delete your profile?
                    </span>
                </Modal>
            )}
            <div className={`user-sidebar ${menu ? "sidebar_open" : ""}`}>
                {/* Start sidebar close icon */}
                <div className="pro-header text-end pb-0 mb-0 show-1023">
                    <div className="fix-icon" onClick={menuToggleHandler}>
                        <span className="flaticon-close"></span>
                    </div>
                </div>
                {/* End sidebar close icon */}

                <div className="sidebar-inner">
                    <ul className="navigation">
                        {employerMenuData.map((item) => (
                            <li
                                className={`${isActiveLink(item.routePath, router.asPath)
                                    ? "active"
                                    : ""
                                    } mb-1`}
                                key={item.id}
                                onClick={menuToggleHandler}
                            >
                                <Link href={item.routePath}>
                                    <i className={`la ${item.icon}`}></i>{" "}
                                    {item.name}
                                </Link>
                            </li>
                        ))}
                        <li className="mb-1">
                            <a onClick={onLogOut}>
                                <i
                                    className="la la-sign-out"
                                ></i>{" "}
                                Logout
                            </a>
                        </li>
                        <li className="mb-1">
                            <a onClick={() => setShowDeleteModal(true)}>
                                <i
                                    className="la la-trash"
                                ></i>{" "}
                                Delete profile
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </>
    );
};

export default DashboardEmployerSidebar;
