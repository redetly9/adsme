import { useQuery } from 'react-query'

import { supabase } from './api'

// Функция регистрации пользователя
export async function registerUser(phone) {
  // Проверяем, существует ли пользователь
  const { data: existingUser, error: findError } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('phone', phone)
    .maybeSingle()

  if (findError && findError.message !== 'Item not found') {
    console.error('Ошибка при поиске пользователя:', findError.message)
    return { error: findError }
  }

  if (existingUser) {
    return { data: { message: 'Пользователь уже существует. Отправьте код верификации.' } }
  }

  // Создаем нового пользователя
  const { data: newUser, error: createError } = await supabase
    .from('user_profiles')
    .insert([
      { phone }
    ])

  if (createError) {
    console.error('Ошибка при создании пользователя:', createError.message)
    return { error: createError }
  }

  return { data: newUser }
}

// Функция для верификации пользователя
export async function verifyUser(phone, code) {
  if (code !== '1111') { // Здесь можно заменить на проверку с реальным кодом, если необходимо
    throw console.error()

    return { error: { message: 'Неверный код верификации.' } }
  }

  const { data: user, error: findError } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('phone', phone)
    .single()

  if (findError) {
    console.error('Ошибка при поиске пользователя:', findError.message)
    return { error: findError }
  }

  if (!user) {
    return { error: { message: 'Пользователь не найден.' } }
  }

  // Симуляция создания токена (в реальном проекте нужен сервер для безопасности)
  const fakeToken = `fake-jwt-token-for-${user.id}`

  return { data: { token: fakeToken, user } }
}

export async function createChat(participants) {

  // Проверяем, существует ли уже чат с данными участниками
  const existingChat = await checkExistingChat(participants)
  console.log('existingChat', existingChat)

  if (!existingChat) {
    // Если чата не существует, создаем новый
    const { data: chat, error: chatError } = await supabase
      .from('chats')
      .insert([{}])
      .select()
      .single()

    if (chatError) {
      console.error('Ошибка при создании чата:', chatError.message)
      return { error: chatError }
    }

    // Добавляем участников к новому чату
    const participantRecords = participants.map(userId => ({
      chat_id: chat?.id,
      user_profile_id: userId
    }))

    const { error: participantsError } = await supabase
      .from('chat_participants')
      .insert(participantRecords)

    if (participantsError) {
      console.error('Ошибка при добавлении участников:', participantsError.message)
      return { error: participantsError }
    }

    return { data: chat }
  }

  // Если чат существует, возвращаем его
  if (existingChat.data) {
    return { data: existingChat.data }
  }

}

async function checkExistingChat(participants) {
//
  const { data: chats1, error: error1 } = await supabase
    .from('chat_participants')
    .select('chat_id')
    .eq('user_profile_id', participants[0])

  // Запрос для второго participant
  const { data: chats2, error: error2 } = await supabase
    .from('chat_participants')
    .select('chat_id')
    .eq('user_profile_id', participants[1])

  // Находим пересечение chat_id из обоих запросов
  const commonChats = chats1?.filter(chat1 => chats2?.some(chat2 => chat2.chat_id === chat1.chat_id))
  //

  if (error1 || error2 || !commonChats.length) {
    return null
  }
  // let { data: chats, error } = await supabase
  //   .from('chat_participants')
  //   .select('chat_id')
  //   .in('user_profile_id', participants);

  // if (error || chats.length < 2) {
  //   return null
  // }

  // Теперь находим чаты, где количество участников совпадает с количеством переданных участников
  const chatIds = commonChats.map(chat => chat.chat_id)

  // Запрашиваем участников чатов
  const { data: participantsData, groupError } = await supabase
    .from('chat_participants')
    .select('chat_id, user_profile_id')
    .in('chat_id', chatIds)

  if (groupError) {
    console.error('Ошибка при запросе данных:', groupError)
    return
  }

  // Группируем участников по chat_id
  const groupedParticipants = participantsData.reduce((acc, item) => {
    acc[item.chat_id] = acc[item.chat_id] || []
    acc[item.chat_id].push(item.user_profile_id)
    return acc
  }, {})

  // Фильтруем чаты, где количество участников соответствует заданному
  const validChats = Object.keys(groupedParticipants).filter(chatId => groupedParticipants[chatId].length === participants.length)

  if (!validChats.length) {
    console.log('Не найдено чатов с указанным количеством участников')
  } else {
    console.log('ID чатов с нужным количеством участников:', validChats)
  }

  // Возвращаем первый подходящий чат
  const validChatId = validChats[0]
  const { data: chat, error: chatError } = await supabase
    .from('chats')
    .select('*')
    .eq('id', validChatId)
    .single()

  if (chatError) {
    return { error: chatError }
  }

  return { data: chat }
}

export async function getUserChats(userId) {
  let { data: allChatIds } = await supabase
    .from('chat_participants')
    .select('*')
    .eq('user_profile_id', userId)

  allChatIds = [{
    chat_id: 58,
    user_profile_id: 1
  }, ...allChatIds]

  if (!allChatIds) {
    return { data: null }
  }

  const { data: chats, error } = await supabase
    .from('chats')
    .select(`
      *,
      messages: messages(*),
      sender: user_profiles!chats_user_id_fkey(*)
    `)
    .in('id', allChatIds?.map(c => c.chat_id))

  console.log('chats', chats)

  if (error) {
    console.error('Ошибка при получении чатов:', error.message)
    return { error }
  }

  return { data: chats }
}

export async function getChatParticipants(chatId) {
  const { data: allChatIds } = await supabase
    .from('chat_participants')
    .select('*, user_profiles: user_profiles(*)')
    .eq('chat_id', chatId)

  return { data: allChatIds }
}

// Функция для получения сообщений чата
export async function getChatMessages(chatId) {
  const { data: messages, error } = await supabase
    .from('messages')
    .select(`
      *,
      sender: user_profiles (name, avatar)
    `)
    .eq('chat_id', chatId)

  if (error) {
    console.error('Ошибка при получении сообщений:', error.message)
    return { error }
  }

  return { data: messages }
}

const fetchMessagesByLocation = async ({ queryKey }) => {
  const [_, { longitude, latitude, radius }] = queryKey

  const { data: messages, error } = await supabase
    .rpc('get_messages_by_location', { long: longitude, lat: latitude, rad: radius })

  if (error) {
    throw new Error(error.message)
  }

  return messages?.map(m => ({
    id: m.id,
    chat_id: m.chat_id,
    text: m.text,
    created_at: m.created_at,
    sender_id: m.sender_id,
    sender: {
      id: m.sender_id,
      name: m.sender_name,
      avatar: m.sender_avatar
    }
  }))
}

export const useMessagesByLocation = (longitude, latitude, radius = 1000) => {
  return useQuery(['messagesByLocation', { longitude, latitude, radius }], fetchMessagesByLocation, {
    refetchInterval: 5000
  })
}

// Функция для отправки сообщения в чат
export async function sendMessage(chatId, senderId, text, longitude: number | null = null, latitude: number | null = null) {
  if (!longitude && !latitude) {
    const { data: message, error } = await supabase
      .from('messages')
      .insert([
        { chat_id: chatId, sender_id: senderId, text }
      ])

    if (error) {
      console.error('Ошибка при отправке сообщения:', error.message)
      return { error }
    }

    return { data: message }
  }

  const { data: message, error } = await supabase
    .from('messages')
    .insert([
      { chat_id: chatId, sender_id: senderId, text, location: `POINT(${longitude} ${latitude})` }
    ])
}
// users
export async function getAllUsers() {
  const { data: users, error } = await supabase
    .from('user_profiles')
    .select('*')

  if (error) {
    console.error('Ошибка при получении пользователей:', error.message)
    return { error }
  }

  return { data: users }
}

export async function getUserById(userId) {
  const { data: user, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) {
    console.error('Ошибка при получении пользователя:', error.message)
    return { error }
  }

  return { data: user }
}

export async function updateUser(userId, updateData) {
  const { data: updatedUser, error } = await supabase
    .from('user_profiles')
    .update(updateData)
    .eq('id', userId)

  if (error) {
    console.error('Ошибка при обновлении пользователя:', error.message)
    return { error }
  }

  return { data: updatedUser }
}

// Получение всех постов с фильтрацией по геолокации
export async function getPostsByLocation(longitude, latitude, radius: number = 1000) {
  const { data: posts, error } = await supabase
    .rpc('get_posts_by_location2', { p_long: longitude, p_lat: latitude, p_rad: radius })

  if (error) {
    console.error('Ошибка при получении постов:', error.message)
    return { error }
  }

  const mapped = posts?.map(p => ({
    id: p.id,
    title: p.title,
    images: p.images,
    tags: p.tags,
    created_at: p.created_at,
    lat: p.lat,
    long: p.long,
    dist_meters: p.dist_meters,
    author: {
      id: p.author_id,
      name: p.author_name,
      avatar: p.avatar,
      surname: p.author_surname,
      lastname: p.author_lastname
    }
  }))

  return { data: mapped }
}

export async function getPostsByLocation2({ queryKey }) {
  const [_, { longitude, latitude, radius }] = queryKey
  const { data: posts, error } = await supabase
    .rpc('get_posts_by_location2', { p_long: longitude, p_lat: latitude, p_rad: radius })

  if (error) {
    console.error('Ошибка при получении постов:', error.message)
    return { error }
  }

  const mapped = posts?.map(p => ({
    id: p.id,
    title: p.title,
    images: p.images,
    tags: p.tags,
    created_at: p.created_at,
    lat: p.lat,
    long: p.long,
    dist_meters: p.dist_meters,
    author: {
      id: p.author_id,
      name: p.author_name,
      avatar: p.avatar,
      surname: p.author_surname,
      lastname: p.author_lastname
    }
  }))

  return { data: mapped }
}

export const usePostsByLocation = (longitude, latitude, radius = 1000) => {
  return useQuery(['postsByLocation', { longitude, latitude, radius }], getPostsByLocation2, {
  })
}

export async function getPostsByTag(tag) {
  const { data: posts, error } = await supabase
    .from('posts')
    .select(`
      *,
      author: user_profiles (*)
    `)
    .ilike('tags', `%${tag}%`)

  if (error) {
    console.error('Ошибка при получении постов по тегу:', error.message)
    return { error }
  }

  return { data: posts }
}

export async function getPostsByUserId(userId) {
  const { data: posts, error } = await supabase
    .from('posts')
    .select(`
      *,
      author: user_profiles (*)
    `)
    .eq('author', userId)

  if (error) {
    console.error('Ошибка при получении постов по тегу:', error.message)
    return { error }
  }

  return { data: posts }
}

// Добавление нового поста
export async function createPost({ title, images, tags, longitude, latitude, author }) {
  const { data: newPost, error } = await supabase
    .from('posts')
    .insert([{
      title,
      images,
      tags,
      location: `POINT(${longitude} ${latitude})`,
      author: +author
    }])
    .select()

  if (error) {
    console.error('Ошибка при создании поста:', error.message)
    return { error }
  }

  return { data: newPost }
}

// Удаление поста
export async function deletePost(postId) {
  const { data: deletedPost, error } = await supabase
    .from('posts')
    .delete()
    .match({ id: postId })

  if (error) {
    console.error('Ошибка при удалении поста:', error.message)
    return { error }
  }

  return { data: deletedPost }
}

async function fetchUserFollowings(userId) {
  const { data, error } = await supabase
    .from('user_followings')
    .select(`*,
        follow_user:user_profiles!user_followings_follow_user_id_fkey(*)
      `)
    .eq('user_id', userId)

  if (error) {
    throw new Error(error.message)
  }

  return data
}

export function useUserFollowings(userId) {
  return useQuery(['userFollowings', userId], () => fetchUserFollowings(userId), {
    enabled: !!userId
  })
}

export async function followUser(userId, followUserId) {
  const { data, error } = await supabase
    .from('user_followings')
    .insert({
      user_id: userId,
      follow_user_id: followUserId
    })
    .select('*')

  if (error) {
    console.error(error.message)
    return { error }
  }

  return data
}

export async function unfollowUser(userId, followUserId) {
  const { data, error } = await supabase
    .from('user_followings')
    .delete()
    .match({
      user_id: userId,
      follow_user_id: followUserId
    })

  if (error) {
    console.error('Ошибка при отписке:', error.message)
    return { error }
  }

  return { data }
}
