/* Adds a watermark image to a base64 image string.
 * Places the watermark at the bottom‑right corner with optional transparency and shadow.
 */
export const addWatermarkToImage = (base64Str: string, watermarkUrl: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    // Load the main image
    const img = new Image();
    img.onload = async () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error("Could not get canvas context"));
        return;
      }

      // 1. Draw the original image
      ctx.drawImage(img, 0, 0);

      const loadWatermarkImage = async (url: string): Promise<HTMLImageElement> => {
        return new Promise((res, rej) => {
          const wImg = new Image();
          wImg.crossOrigin = "anonymous";
          wImg.onload = () => res(wImg);
          wImg.onerror = rej;
          wImg.src = url;
        });
      };

      const fetchWatermarkWithProxy = async (url: string): Promise<HTMLImageElement> => {
        // Try a different proxy if corsproxy.io fails
        const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
        const response = await fetch(proxyUrl);
        if (!response.ok) throw new Error("Proxy fetch failed");
        const blob = await response.blob();
        const dataUrl = await new Promise<string>((res) => {
          const reader = new FileReader();
          reader.onloadend = () => res(reader.result as string);
          reader.readAsDataURL(blob);
        });
        return loadWatermarkImage(dataUrl);
      };

      try {
        let watermarkImg: HTMLImageElement;
        try {
          // Try direct load first (most efficient)
          watermarkImg = await loadWatermarkImage(watermarkUrl);
        } catch (e) {
          console.warn("Direct watermark load failed, trying proxy...");
          try {
            // Try first proxy
            const corsProxyUrl = `https://corsproxy.io/?${encodeURIComponent(watermarkUrl)}`;
            const response = await fetch(corsProxyUrl);
            if (!response.ok) throw new Error("corsproxy.io failed");
            const blob = await response.blob();
            const dataUrl = await new Promise<string>((res) => {
              const reader = new FileReader();
              reader.onloadend = () => res(reader.result as string);
              reader.readAsDataURL(blob);
            });
            watermarkImg = await loadWatermarkImage(dataUrl);
          } catch (e2) {
            console.warn("First proxy failed, trying second proxy...");
            // Try second proxy
            watermarkImg = await fetchWatermarkWithProxy(watermarkUrl);
          }
        }

        // 2. Calculate dimensions and position
        const maxWidth = canvas.width * 0.30;  // Increased from 25% to 30% (120% of original)
        const maxHeight = canvas.height * 0.30; 
        
        // Define w and h here so they aren't "undefined"
        let w = watermarkImg.width;
        let h = watermarkImg.height;
        const ratio = w / h;

        if (w > maxWidth) {
          w = maxWidth;
          h = w / ratio;
        }
        if (h > maxHeight) {
          h = maxHeight;
          w = h * ratio;
        }

        // Position at the bottom right, sticking to the bottom edge
        const padding = 10; 
        const x = canvas.width - w - padding;
        const y = canvas.height - h;

        // 3. Apply transparency and draw
        ctx.save();
        ctx.globalAlpha = 0.9;
        
        // TIGHTER SHADOW: This stops the "glow" that makes it look high up
        ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
        ctx.shadowBlur = 2; 
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 1;

        ctx.drawImage(watermarkImg, x, y, w, h);
        ctx.restore();

        resolve(canvas.toDataURL('image/png'));
      } catch (err) {
        console.warn("Watermark process failed, returning image without watermark:", err);
        resolve(canvas.toDataURL('image/png')); // fallback: return original image
      }
    };

    img.onerror = (err) => {
      console.error("Original image failed to load for watermarking:", err);
      reject(err);
    };

    img.src = base64Str;
  });
};
