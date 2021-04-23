import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import { v4 } from "uuid";
import EditorHeader from "components/EditorHeader";
import TextEditor from "components/TextEditor";
import MyDocuments from "components/MyDocuments";
import Profile from "components/Profile";

function App() {
  return (
    <div className='App'>
      <Router>
        <Switch>
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
