import React from "react";

interface Props {}

// TODO: refactor this component
const EditorHeader = (props: Props) => {
  return (
    <div id='editor-header'>
      <div>
        <div>ICon</div>
      </div>
      <div style={{ textAlign: "center" }}>
        <div>Adsiz dosya</div>
        <div>Son guncelleme: 15 dakika once</div>
      </div>
      <div>
        <div>user</div>
        <div>Paylas lock </div>
      </div>
    </div>
  );
};

export default EditorHeader;
