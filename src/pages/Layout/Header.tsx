import styled from "styled-components";
import commonStyle from "./styles/common.module.scss";
// import { AiOutlineBell } from "react-icons/ai";
// import { BsPersonCircle } from "react-icons/bs";
import Logo from "../../assets/images/logo.png";
import ProfileIcon from "../../components/ProfileIcon";

//#region Styling
const Menubar = styled.div`
  /* Remove <Layout> padding */
  p {
    margin: 0;
  }
`;

const MenubarContent = styled.div`
  display: flex;
  flex-direction: column;
`;

const MenubarItem = styled.div`
  font-size: 0.875rem;
`;

function Header() {
  return (
    <>
      <Menubar className={commonStyle.headerMenu}>
        <MenubarContent className="py-2 flex-lg-row justify-content-md-between">
          {/* Filters */}
          <MenubarItem style={{margin: '5px 12px'}}>
            <img
              src={Logo}
              style={{marginTop: '-7px'}}
              alt="Nucleus transparent white logo"
              className="ms-0" />
              <span className={commonStyle.portalName}>GDP</span>
          </MenubarItem>
          <MenubarItem className={commonStyle.headerItems}>
            <ProfileIcon></ProfileIcon>
          </MenubarItem>
        </MenubarContent>
      </Menubar>
    </>
  );
}

export default Header;
