// Safe Web Mock for expo-image-manipulator
export const SaveFormat = {
  JPEG: 'jpeg',
  PNG: 'png',
  WEBP: 'webp',
};

export async function manipulateAsync(uri: string, _actions: any[] = [], _saveOptions: any = {}) {
  return {
    uri,
    base64: uri.replace(/^data:image\/[^;]+;base64,/, ''),
    width: 512,
    height: 512,
  };
}

export default {
  SaveFormat,
  manipulateAsync,
};
