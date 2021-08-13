import { useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import { v4 } from 'uuid';
import EditorHeader from 'components/EditorHeader';
import TextEditor from 'components/TextEditor';
import MyDocuments from 'components/MyDocuments';
import Profile from 'components/Profile';
import Login from 'components/Login';
import Register from 'components/Register';
import { useAuthContext } from 'context/AuthContext';

function App() {
  const { loadUser } = useAuthContext();

  useEffect(() => {
    loadUser();
  }, []);

  return (
    <div className='App'>
      <Router>
        <Switch>
          <Route path='/login' component={Login} />
          <Route path='/register' component={Register} />
          {/* TODO: refactor */}
          <Route exact path='/'>
            <Redirect to={`/document/${v4()}`} />
          </Route>
          <Route path='/my-documents' component={MyDocuments} />
          <Route path='/profile' component={Profile} />
          <Route path='/document/:docId'>
            <EditorHeader />
            <TextEditor />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
