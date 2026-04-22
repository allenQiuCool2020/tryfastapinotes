export type Note = {
  id: number;
  title: string;
  content: string;
  weather: string | null;
  summary: string | null;
  created_at: string;
  created_by: number;
};

export type NoteCreateInput = {
  title: string;
  content: string;
  weather?: string | null;
  summary?: string | null;
};

export type NoteUpdateInput = Partial<NoteCreateInput>;

export type User = {
  id: number;
  username: string;
};

export type UserCreateInput = {
  username: string;
  password: string;
};

export type LoginInput = {
  username: string;
  password: string;
};

export type TokenResponse = {
  access_token: string;
  token_type: string;
};

export type DeleteNoteResponse = {
  detail: string;
};

export type ApiValidationIssue = {
  loc: Array<string | number>;
  msg: string;
  type: string;
};

export type ApiErrorResponse = {
  detail: string | ApiValidationIssue[];
};
