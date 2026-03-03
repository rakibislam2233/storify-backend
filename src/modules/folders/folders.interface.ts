export interface IFolder {
  id: string;
  name: string;
  level: number;
  userId: string;
  parentId: string | null;
  createdAt: Date;
  updatedAt: Date;
  children?: IFolder[];
  parent?: IFolder | null;
}

export interface ICreateFolder {
  name: string;
  parentId?: string | null;
}

export interface IUpdateFolder {
  name?: string;
  parentId?: string | null;
}

// -- Folder Filter Interface --
export interface IFolderFilter {
  searchTerm?: string;
  level?: number;
  parentId?: string;
}
