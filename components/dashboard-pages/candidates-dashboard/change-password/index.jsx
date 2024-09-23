import LoginPopup from "../../../common/form/login/LoginPopup";
import DashboardCandidatesHeader from "../../../header/DashboardCandidatesHeader";
import DashboardCandidatesSidebar from "../../../header/DashboardCandidatesSidebar";
import DashboardEmployerSidebar from "../../../header/DashboardEmployerSidebar";
import DashboardHeader from "../../../header/DashboardHeader";
import MobileMenu from "../../../header/MobileMenu";
import BreadCrumb from "../../BreadCrumb";
import CopyrightFooter from "../../CopyrightFooter";
import MenuToggler from "../../MenuToggler";
import Form from "./components/Form";

const index = ({ employer }) => {
  return (
    <div className="page-wrapper dashboard">
      <span className="header-span"></span>
      {/* <!-- Header Span for hight --> */}

      <LoginPopup />
      {/* End Login Popup Modal */}

      {employer ? <DashboardHeader /> : <DashboardCandidatesHeader />}
      {/* End Header */}

      <MobileMenu />
      {/* End MobileMenu */}

      {employer ? <DashboardEmployerSidebar /> : <DashboardCandidatesSidebar />}
      {/* <!-- End Candidates Sidebar Menu --> */}

      {/* <!-- Dashboard --> */}
      <section className="user-dashboard">
        <div className="dashboard-outer">
          <BreadCrumb title="Change Password" />
          {/* breadCrumb */}

          <MenuToggler />
          {/* Collapsible sidebar button */}

          <div className="ls-widget">

            <div className="widget-content">
              <Form />
            </div>
          </div>
          {/* <!-- Ls widget --> */}
        </div>
        {/* End dashboard-outer */}
      </section>
      {/* <!-- End Dashboard --> */}

      <CopyrightFooter />
      {/* <!-- End Copyright --> */}
    </div>
    // End page-wrapper
  );
};

export default index;
