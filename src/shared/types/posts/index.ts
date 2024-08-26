export type PostType = {
  id: number,
  title: string,
  images: string,
  tags: string,
  created_at: string,
  lat: number,
  long: number,
  dist_meters: number,
  author: PostTypeAuthor | null
}

export type PostTypeAuthor = {
  id: number,
  name: string,
  avatar: string,
  surname: string,
  lastname: string
}

export type CreatePostType = {
  title: string,
  images: string,
  tags: string[],
  longitude: number,
  latitude: number,
  author: string
}
