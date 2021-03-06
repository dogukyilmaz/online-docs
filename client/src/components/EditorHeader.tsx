import { formatDistanceToNow } from 'date-fns';
import { useDocContext } from 'context/DocumentContext';
import { useHistory } from 'react-router';
import { useAuthContext } from 'context/AuthContext';

interface Props {}

// TODO: refactor this component
const EditorHeader = (props: Props) => {
  const { document } = useDocContext();
  const { user, loadUser } = useAuthContext();
  const history = useHistory();

  return (
    <div id='editor-header'>
      <div>
        <div>
          <button onClick={() => history.push('/login')}>login</button>
          <button onClick={() => history.push('/profile')}>profile</button>
          <button onClick={() => history.push('/')}>reset</button>
          <button onClick={() => loadUser()}>loadUser</button>
        </div>
        <div>ICon</div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <div>{document?.title}</div>
        <div>Son guncelleme: {new Date(document?.updatedAt as string).toLocaleString('tr')}</div>
        <div>
          Son guncelleme:{' '}
          {document &&
            formatDistanceToNow(new Date(document?.updatedAt as string), {
              addSuffix: true,
              includeSeconds: true,
            })}
        </div>
      </div>
      <div>
        <div>user: {user?.name || 'NONAME'}</div>
        <div>Paylas/lock : {document?.privacy} </div>
      </div>
    </div>
  );
};

export default EditorHeader;
