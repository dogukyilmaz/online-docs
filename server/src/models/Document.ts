import { Schema, model, Document, ObjectId, SchemaTypes } from "mongoose";

export type DocOwner = ObjectId | ObjectId[] | "anonymous";

export enum Privacy {
  PRIVATE = "private",
  PUBLIC = "public",
  UNLISTED = "unlisted",
}

export interface Doc extends Document {
  _id: string;
  title: String;
  content: Object;
  privacy: Privacy;
  owner: DocOwner;
}

const DocSchema: Schema<Doc, any> = new Schema(
  {
    _id: { type: String, required: [true, "ID is mandatory!"] },
    title: { type: String, required: [true, "Title is nice to have!"] },
    content: { type: Object, required: [true, "Content is required!"] },
    privacy: { type: String, enum: Object.values(Privacy), default: Privacy.PRIVATE },
    owner: { type: [SchemaTypes.ObjectId], ref: "User", default: ["anonymous"] },
  },
  {
    timestamps: true,
  }
);

export default model<Doc>("Doc", DocSchema);
