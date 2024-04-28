import { supabase } from "./api";

// Функция регистрации пользователя
export async function registerUser(phone) {
  // Проверяем, существует ли пользователь
  let { data: existingUser, error: findError } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('phone', phone)
    .maybeSingle();

  if (findError && findError.message !== 'Item not found') {
    console.error('Ошибка при поиске пользователя:', findError.message);
    return { error: findError };
  }

  if (existingUser) {
    return { data: { message: 'Пользователь уже существует. Отправьте код верификации.' } };
  }

  // Создаем нового пользователя
  let { data: newUser, error: createError } = await supabase
    .from('user_profiles')
    .insert([
      { phone }
    ]);

  if (createError) {
    console.error('Ошибка при создании пользователя:', createError.message);
    return { error: createError };
  }

  return { data: newUser };
}

// Функция для верификации пользователя
export async function verifyUser(phone, code) {
  if (code !== '1111') {  // Здесь можно заменить на проверку с реальным кодом, если необходимо
    return { error: { message: 'Неверный код верификации.' } };
  }

  let { data: user, error: findError } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('phone', phone)
    .single();

  if (findError) {
    console.error('Ошибка при поиске пользователя:', findError.message);
    return { error: findError };
  }

  if (!user) {
    return { error: { message: 'Пользователь не найден.' } };
  }

  // Симуляция создания токена (в реальном проекте нужен сервер для безопасности)
  const fakeToken = `fake-jwt-token-for-${user.id}`;

  return { data: { token: fakeToken, user } };
}

export async function createChat(participants) {
  // Создаем новый чат
  let { data: chat, error: chatError } = await supabase
    .from('chats')
    .insert([{}])
    .select()

  if (chatError) {
    console.error('Ошибка при создании чата:', chatError.message);
    return { error: chatError };
  }

  // Добавляем участников к чату
  const participantRecords = participants.map(userId => ({
    chat_id: chat[0].id,
    user_profile_id: userId
  }));

  let { error: participantsError } = await supabase
    .from('chat_participants')
    .insert(participantRecords);

  if (participantsError) {
    console.error('Ошибка при добавлении участников:', participantsError.message);
    return { error: participantsError };
  }

  return { data: chat };
}

export async function getUserChats(userId) {
  let { data: chats, error } = await supabase
    .from('chats')
    .select(`
      *,
      messages: messages(*)
    `)
    .eq('user_id', userId)

  if (error) {
    console.error('Ошибка при получении чатов:', error.message);
    return { error };
  }

  return { data: chats };
}

// Функция для получения сообщений чата
export async function getChatMessages(chatId) {
  let { data: messages, error } = await supabase
    .from('messages')
    .select(`
      *,
      sender: user_profiles (name, avatar)
    `)
    .eq('chat_id', chatId);

  if (error) {
    console.error('Ошибка при получении сообщений:', error.message);
    return { error };
  }

  return { data: messages };
}

// Функция для отправки сообщения в чат
export async function sendMessage(chatId, senderId, text) {
  let { data: message, error } = await supabase
    .from('messages')
    .insert([
      { chat_id: chatId, sender_id: senderId, text }
    ]);

  if (error) {
    console.error('Ошибка при отправке сообщения:', error.message);
    return { error };
  }

  return { data: message };
}

// users
export async function getAllUsers() {
  let { data: users, error } = await supabase
    .from('user_profiles')
    .select('*');

  if (error) {
    console.error('Ошибка при получении пользователей:', error.message);
    return { error };
  }

  return { data: users };
}

export async function getUserById(userId) {
  let { data: user, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Ошибка при получении пользователя:', error.message);
    return { error };
  }

  return { data: user };
}

export async function updateUser(userId, updateData) {
  let { data: updatedUser, error } = await supabase
    .from('user_profiles')
    .update(updateData)
    .eq('id', userId);

  if (error) {
    console.error('Ошибка при обновлении пользователя:', error.message);
    return { error };
  }

  return { data: updatedUser };
}

// Получение всех постов с фильтрацией по геолокации
export async function getPostsByLocation(longitude, latitude, radius = 1000) {
  const locationFilter = `location <@ ST_MakeEnvelope(${longitude - 0.01}, ${latitude - 0.01}, ${longitude + 0.01}, ${latitude + 0.01}, 4326)`;

  let { data: posts, error } = await supabase
    .from('posts')
    .select(`
      *,
      author: user_profiles (name, avatar)
    `)
    .filter('location', 'st_d_within', locationFilter)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Ошибка при получении постов:', error.message);
    return { error };
  }

  return { data: posts };
}

// Получение всех постов с фильтрацией по геолокации
export async function getPostsByTag(tag) {
  let { data: posts, error } = await supabase
    .from('posts')
    .select(`
      *,
      author: user_profiles (name, avatar)
    `)
    .ilike('tags', `%${tag}%`);

  if (error) {
    console.error('Ошибка при получении постов по тегу:', error.message);
    return { error };
  }

  return { data: posts };
}

// Добавление нового поста
export async function createPost({ title, images, tags, longitude, latitude, authorId }) {
  let { data: newPost, error } = await supabase
    .from('posts')
    .insert([{
      title,
      images,
      tags,
      location: `POINT(${longitude} ${latitude})`,
      author_id: authorId
    }]);

  if (error) {
    console.error('Ошибка при создании поста:', error.message);
    return { error };
  }

  return { data: newPost };
}

// Удаление поста
export async function deletePost(postId) {
  let { data: deletedPost, error } = await supabase
    .from('posts')
    .delete()
    .match({ id: postId });

  if (error) {
    console.error('Ошибка при удалении поста:', error.message);
    return { error };
  }

  return { data: deletedPost };
}
