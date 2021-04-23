import Document, { BaseDoc, Doc } from "../models/Document";

type TempDoc = String;

export interface DocResponse {
  success: boolean;
  doc: Doc | null | TempDoc;
}

export const findDocOrCreate = async (id: string, data?: Omit<BaseDoc, "_id">): Promise<DocResponse> => {
  try {
    let doc = await Document.findById(id);
    if (doc) return { success: true, doc };
    doc = await Document.create({ _id: id, content: "" });
    // doc = await Document.create({ _id: id, ...data });
    return { success: true, doc };
  } catch (error) {
    console.log(error);
    return { success: false, doc: null };
  }
};

export const updateDoc = async (id: string, data: TempDoc) => {
  await Document.findByIdAndUpdate(id, { data });
};
