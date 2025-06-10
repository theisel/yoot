export const IMAGE_URL_TEMPLATE = 'https://cdn.shopify.com/s/files/1/2/3/4/files/123456789_2048%s?v=1234567890';
export const IMAGE_FILE_EXTENSION = '.jpg';
export const IMAGE_URL = IMAGE_URL_TEMPLATE.replace('%s', IMAGE_FILE_EXTENSION);

export const IMAGE_URL_WITH_DIRECTIVES = IMAGE_URL_TEMPLATE.replace(
  '%s',
  '_100x100_crop_center' + IMAGE_FILE_EXTENSION,
);

export const IMAGE_METADATA = {
  width: 2048,
  height: 2048,
} as const;
