// -- File Cache Keys --
export const FILE_CACHE_KEY = {
  PROFILE: (userId: string) => `file:profile:${userId}`,
  FILE: (id: string) => `file:${id}`,
  USER_FILES: (userId: string) => `files:user:${userId}`,
  FOLDER_FILES: (folderId: string) => `files:folder:${folderId}`,
};

// -- File Cache TTL --
export const FILE_CACHE_TTL = {
  PROFILE: 3600, // 1 hour
  FILE: 1800, // 30 minutes
  USER_FILES: 900, // 15 minutes
  FOLDER_FILES: 900, // 15 minutes
};
