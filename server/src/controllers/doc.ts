import Document, { BaseDoc, Doc, DocOwner } from "../models/Document";

interface AnyDoc extends Doc {
  owner?: DocOwner;
}
export interface DocResponse {
  success: boolean;
  doc: any;
  message?: string;
}

const TEMP_DATA = {
  title: "Adsiz",
  content: "",
  privacy: "private",
  owner: "507f1f77bcf86cd799439011",
};

export const findDocOrCreate = async (
  id: string,
  userId: string /* FIXME: need?  data?: Omit<BaseDoc, "_id"> */
): Promise<DocResponse> => {
  try {
    let doc: AnyDoc | null = await Document.findById(id);
    if (doc) {
      // check owner
      // TODO: make sure not need to Stringfy
      if (doc.owner !== userId) return { success: false, doc: null, message: "Not authorized!" };
      return { success: true, doc };
    }
    // TODO: data values etc. // get user id insert
    doc = await Document.create({ _id: id, ...TEMP_DATA });
    // doc = await Document.create({ _id: id, ...data });
    return { success: true, doc };
  } catch (error) {
    console.log(error);
    return { success: false, doc: null };
  }
};

export const updateDoc = async (id: string, content: any) => {
  try {
    await Document.findByIdAndUpdate(id, { content }, { runValidators: false }); // TODO: enable validators
  } catch (error) {
    console.log(error);
  }
};
