import type { VercelRequest, VercelResponse } from '@vercel/node';
import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';

/**
 * Erzeugt Upload-Berechtigungen für den Preisrechner.
 * Die Dateien gehen direkt vom Browser in den Vercel-Blob-Speicher (auch große STL-Dateien).
 * Benötigt die Umgebungsvariable BLOB_READ_WRITE_TOKEN (wird beim Verbinden eines Blob-Speichers automatisch gesetzt).
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Nur POST erlaubt' });
  try {
    const json = await handleUpload({
      body: req.body as HandleUploadBody,
      request: req,
      onBeforeGenerateToken: async (pathname) => {
        if (!/^anfragen\/[\w.\-]+\.(stl|3mf)$/i.test(pathname)) throw new Error('Nur STL- und 3MF-Dateien erlaubt');
        return { maximumSizeInBytes: 50 * 1024 * 1024, addRandomSuffix: true };
      },
    });
    return res.status(200).json(json);
  } catch (e) {
    return res.status(400).json({ error: (e as Error).message });
  }
}
