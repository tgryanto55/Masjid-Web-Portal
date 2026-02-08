
export const getEventImageUrl = (imagePath: string | null | undefined) => {
    if (!imagePath) return null;


    if (imagePath.startsWith('data:') || imagePath.startsWith('http')) {
        return imagePath;
    }


    const BASE_URL = 'http://127.0.0.1:5001';


    const path = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;

    return `${BASE_URL}${path}`;
};
