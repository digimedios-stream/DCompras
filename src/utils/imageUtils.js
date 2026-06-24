/**
 * Convierte un archivo de imagen a formato WebP usando HTML5 Canvas.
 * @param {File} file - El archivo original (JPG, PNG, etc).
 * @param {number} quality - Calidad de la compresión WebP (0 a 1).
 * @returns {Promise<File>} Promesa que resuelve con el nuevo archivo WebP.
 */
export const convertToWebP = (file, quality = 0.8) => {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith('image/')) {
      return reject(new Error('El archivo no es una imagen válida.'));
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        
        canvas.toBlob((blob) => {
          if (blob) {
            // Extraer el nombre base sin extensión
            const nameWithoutExt = file.name.replace(/\.[^/.]+$/, "");
            const newFileName = `${nameWithoutExt}.webp`;
            
            const newFile = new File([blob], newFileName, {
              type: 'image/webp',
              lastModified: Date.now()
            });
            resolve(newFile);
          } else {
            reject(new Error('Fallo al convertir la imagen a WebP.'));
          }
        }, 'image/webp', quality);
      };
      img.onerror = (error) => {
        reject(error);
      };
      img.src = event.target.result;
    };
    reader.onerror = (error) => {
      reject(error);
    };
    reader.readAsDataURL(file);
  });
};
