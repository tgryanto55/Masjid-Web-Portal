
export const getEventImageUrl = (imagePath: string | null | undefined) => {
    if (!imagePath) return null;

    // Jika sudah base64 (data:image...) atau url lengkap (http...), kembalikan langsung
    if (imagePath.startsWith('data:') || imagePath.startsWith('http')) {
        return imagePath;
    }

    // Jika relative path dari backend (misal /uploads/...)
    // Gunakan host yang sama dengan API (hardcoded sementara sesuai api.ts)
    const BASE_URL = 'http://127.0.0.1:5001';

    // Pastikan path diawali slash jika belum
    const path = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;

    return `${BASE_URL}${path}`;
};
