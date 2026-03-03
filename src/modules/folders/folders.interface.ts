export interface IFolder {
  id: string;
  name: string;
  level: number;
  userId: string;
  parentId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateFolder {
  name: string;
  parentId: string;
}

export interface IUpdateFolder {
  name: string;
  parentId: string;
}
