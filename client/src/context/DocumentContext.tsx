import { createContext, FC, useContext, useState } from "react";
import { Document } from "types";

type NullableDoc = Document | null;

export interface DocumentContext {
  document: NullableDoc;
  setDocument: (doc: NullableDoc) => void;
}

const DocContext = createContext<DocumentContext>({
  document: null,
  setDocument: () => {},
});

export const useDocContext = () => useContext(DocContext);

const DocContextProvider: FC = ({ children }) => {
  const [document, setDocument] = useState<NullableDoc>(null);

  const value = {
    document,
    setDocument,
  };

  return <DocContext.Provider value={value}>{children}</DocContext.Provider>;
};

export default DocContextProvider;
