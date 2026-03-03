export interface IPackage {
  id: string;
  name: string;
  maxFolders: number;
  maxNestingLevel: number;
  allowedFileTypes: string[];
  maxFileSize: number;
  totalFileLimit: number;
  filesPerFolder: number;
  createdAt: Date;
  updatedAt: Date;
}

// -- Create Package Interface --
export interface ICreatePackage {
  name: string;
  maxFolders: number;
  maxNestingLevel: number;
  allowedFileTypes: string[];
  maxFileSize: number;
  totalFileLimit: number;
  filesPerFolder: number;
}

// -- Update Package Interface --
export interface IUpdatePackage {
  name?: string;
  maxFolders?: number;
  maxNestingLevel?: number;
  allowedFileTypes?: string[];
  maxFileSize?: number;
  totalFileLimit?: number;
  filesPerFolder: number;
}
