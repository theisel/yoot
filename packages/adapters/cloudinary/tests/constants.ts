export const IMAGE_URL_TEMPLATE = 'https://res.cloudinary.com/demo/image/upload%s/pm/woman_car.jpg';
export const IMAGE_URL_WITH_DIRECTIVES = IMAGE_URL_TEMPLATE.replace('%s', '/c_crop,g_south,h_150,w_200');

export const IMAGE_URL = IMAGE_URL_TEMPLATE.replace('%s', '');
