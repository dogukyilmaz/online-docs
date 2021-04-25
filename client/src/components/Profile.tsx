import React from "react";
import { useHistory } from "react-router";

interface Props {}

const Profile = (props: Props) => {
  const history = useHistory();
  return (
    <div>
      <h1>Profile</h1>
      <button onClick={() => history.push("/document/75c6757b-48af-4d51-978f-27e2c409da12")}>go to document</button>
    </div>
  );
};

export default Profile;
