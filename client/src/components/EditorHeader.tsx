import { formatDistance, formatDistanceToNow, subDays } from "date-fns";
import { useDocContext } from "context/DocumentContext";
import { useHistory } from "react-router";

interface Props {}

// TODO: refactor this component
const EditorHeader = (props: Props) => {
  const { document } = useDocContext();
  const history = useHistory();
  return (
    <div id='editor-header'>
      <div>
        <div>
          <button onClick={() => history.push("/profile")}>profile</button>
          <button onClick={() => history.push("/")}>reset</button>
        </div>
        <div>ICon</div>
      </div>
      <div style={{ textAlign: "center" }}>
        <div>{document?.title}</div>
        <div>Son guncelleme: {new Date(document?.updatedAt as string).toLocaleString("tr")}</div>
        <div>
          Son guncelleme:{" "}
          {document &&
            formatDistanceToNow(new Date(document?.updatedAt as string), {
              addSuffix: true,
              includeSeconds: true,
            })}
        </div>
      </div>
      <div>
        <div>user: {document?.owner}</div>
        <div>Paylas/lock : {document?.privacy} </div>
      </div>
    </div>
  );
};

export default EditorHeader;
