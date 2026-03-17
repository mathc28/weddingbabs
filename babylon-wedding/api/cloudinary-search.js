export default async function handler(req, res) {
  const cloudName = process.env.VITE_CLOUDINARY_CLOUD_NAME
  const apiKey = process.env.VITE_CLOUDINARY_API_KEY
  const apiSecret = process.env.VITE_CLOUDINARY_API_SECRET

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/resources/search?expression=tags%3Dduo&with_field=context&max_results=500`,
    {
      headers: {
        Authorization: 'Basic ' + Buffer.from(`${apiKey}:${apiSecret}`).toString('base64')
      }
    }
  )

  const data = await response.json()
  res.status(response.status).json(data)
}
