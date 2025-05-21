import { sanityClient } from '@/sanity/lib/client'

/**
 * Uploads an image file to Sanity and returns the asset document ID.
 * @param file The image file to upload
 * @returns The Sanity asset document ID (string)
 */
export async function uploadImageToSanity(file: File): Promise<string> {
  // Supported image types by Sanity
  const supportedTypes = [
    'image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp', 'image/svg+xml',
    'image/tiff', 'image/bmp', 'image/x-icon', 'image/heic', 'image/heif'
  ]
  if (!supportedTypes.includes(file.type)) {
    throw new Error('Nieobsługiwany format pliku. Dozwolone: PNG, JPEG, GIF, WebP, SVG, TIFF, BMP, ICO, HEIC.')
  }

  const formData = new FormData()
  formData.append('file', file)

  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
  const token = process.env.NEXT_PUBLIC_SANITY_API_TOKEN

  if (!projectId || !dataset || !token) {
    console.error('Sanity env missing:', { projectId, dataset, token })
    throw new Error('Sanity project ID, dataset, or token not set')
  }

  const uploadUrl = `https://${projectId}.api.sanity.io/v2021-06-07/assets/images/${dataset}`

  // Debug: log file info
  console.log('Uploading file:', file)
  console.log('Sanity upload URL:', uploadUrl)

  const res = await fetch(uploadUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      // Do NOT set 'Content-Type' when using FormData
    },
    body: formData,
  })

  if (!res.ok) {
    const errorText = await res.text()
    console.error('Sanity upload error:', res.status, errorText)
    throw new Error('Image upload failed: ' + errorText)
  }

  const data = await res.json()
  return data.document._id as string
}
