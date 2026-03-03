// -- Folder Cache Keys --
export const FOLDER_CACHE_KEY = {
  PROFILE: (userId: string) => `folder:profile:${userId}`,
  FOLDER: (id: string) => `folder:${id}`,
  USER_FOLDERS: (userId: string) => `folders:user:${userId}`,
  ROOT_FOLDERS: (userId: string) => `folders:root:${userId}`,
};

// -- Folder Cache TTL --
export const FOLDER_CACHE_TTL = {
  PROFILE: 3600, // 1 hour
  FOLDER: 1800, // 30 minutes
  USER_FOLDERS: 900, // 15 minutes
  ROOT_FOLDERS: 900, // 15 minutes
};
