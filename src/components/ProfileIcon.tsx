import styled, { css } from "styled-components";
import {default as ProfilePic} from "../assets/icons/user.svg";
import NavMenuButton from "./NavMenuButton";

const textOverflow = css`
  overflow: hidden;
  max-width: 30ch;
  text-overflow: ellipsis;
`;

const ProfileName = styled.span`
  display: inline-block;
  color: #404041;
  margin: 8px 0px 0;
  ${textOverflow}
`;

const ProfileUsername = styled.span`
  display: block;
  color: #a7a7a7;
  font-size: 0.8em;
  margin: 8px 0px 10px;
  ${textOverflow}
`;

const ProfileBtnStack = styled.div`
  max-width: 100%;
  margin: 0 16px 8px;
`;

const SignOutLink = styled.a`
  color: #0079a1;
  text-decoration: none;
  float: right;
  cursor: pointer;
  :hover {
    color: #0056b3;
    text-decoration: underline;
  }
`;

function SignOutButton() {
  return <SignOutLink>Logout</SignOutLink>;
}

function ProfileIcon() {
  return (
    <NavMenuButton Icon={ProfilePic}>
      <Internal />
    </NavMenuButton>
  );
}

const Internal = () => {
  const userName = () =>
    `User Name`;

  const userEmail = () =>
    `xxx@nttdata.com`;

  return (
    <ProfileBtnStack>
      <ProfileName>{userName()}</ProfileName>
      <ProfileUsername>{userEmail()}</ProfileUsername>
      <SignOutButton />
    </ProfileBtnStack>
  );
};

export default ProfileIcon;