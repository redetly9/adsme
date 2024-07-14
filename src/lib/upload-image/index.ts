export const uploadImage = async (file: File) => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', 'ml_default')
  formData.append('api_key', '695968168657315')
  const url = 'https://api.cloudinary.com/v1_1/your_cloud_name/image/upload'

  try {
    const response = await fetch(url, {
      method: 'POST',
      body: formData
    })
    const data = await response.json()
    return data.secure_url
  } catch (error) {
    console.error('Ошибка при загрузке изображения: ', error)
  }
}
