export const AVATAR_MAP: Record<string, any> = {
  'avatar1': require('../assets/avatars/avatar1.png'),
  'avatar2': require('../assets/avatars/avatar2.png'),
  'avatar3': require('../assets/avatars/avatar3.png'),
  'avatar4': require('../assets/avatars/avatar4.png'),
  'avatar5': require('../assets/avatars/avatar5.png'),
  'avatar6': require('../assets/avatars/avatar6.png'),
};

export const getAvatarSource = (avatarPath: string | undefined) => {
  if (!avatarPath) return null;
  if (avatarPath.startsWith('avatar')) {
    return AVATAR_MAP[avatarPath];
  }
  return { uri: avatarPath };
};
