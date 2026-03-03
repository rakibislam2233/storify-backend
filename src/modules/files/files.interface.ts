export interface IFile {
  id: string;
  originalName: string;
  name: string;
  type: string;
  size: number;
  url: string;
  userId: string;
  folderId: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateFile {
  originalName: string;
  name: string;
  type: string;
  size: number;
  url: string;
  folderId: string;
}

export interface IUpdateFile {
  originalName?: string;
  name?: string;
  folderId?: string;
}

// -- File Filter Interface --
export interface IFileFilter {
  searchTerm?: string;
  type?: string;
  folderId?: string;
}
