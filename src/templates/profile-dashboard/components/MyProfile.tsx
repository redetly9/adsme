import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createChat, getUserById, getUserChats, updateUser } from '../../../hooks';
import LoadingOverlay from './LoadingOverlay';
import { getUser } from '../../../utils/storageUtils';
import UserProfile from './UserProfile';
import OwnProfile from './OwnProfile';

export default function MyProfile() {
  const { id } = useParams();
  const [profileData, setProfileData] = useState('')
  const userId = id;
  const [nameInput, setNameInput] = useState(profileData?.name)
  const [surnameInput, setSurnameInput] = useState(profileData?.surname)
  const [phoneInput, setPhoneInput] = useState(profileData?.phone)
  const [imageUrl, setImageUrl] = React.useState('' || '');

  const fileInputRef = useRef(null);

  const handleAvatarChange = async (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      await uploadImage(file);
    }
  };
  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'ml_default');
    formData.append('api_key', '695968168657315');
    const url = `https://api.cloudinary.com/v1_1/your_cloud_name/image/upload`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      setImageUrl(data.secure_url);
    } catch (error) {
      console.error('Ошибка при загрузке изображения: ', error);
    }
  };

  const handleEditIconClick = () => {
    fileInputRef.current.click();
  };
  
  useEffect(() => {
    if (profileData?.phone) {
      setPhoneInput(profileData.phone);
      setSurnameInput(profileData.surname);
      setNameInput(profileData.name);
    }
    if(!profileData.phone) {
      setIsLoading(true)
    } else {
      setIsLoading(false)
    }
  }, [profileData]);
  const navigate = useNavigate();

  const onProfile = async (userId: string) => {
    try {
    
      const response = await getUserById(userId);
      setProfileData(response.data)
      console.log(response.data);
      
    } catch (error) {
      if ((error)) {
        console.error('Ошибка запроса:', error || error);
      } else {
        console.error('Непредвиденная ошибка:', error);
      }
    }
  };

  const UpdateProfile = async (userId: string) => {
    try {
    
      const data = {
        name: nameInput,
        surname:surnameInput,
        avatar: imageUrl || profileData?.avatar,
      };

  
      await updateUser(userId, data)

      // navigate('/confirm')
    } catch (error) {
      if ((error)) {
        console.error('Ошибка запроса:', error || error);
      } else {
        console.error('Непредвиденная ошибка:', error);
      }
    }
  };
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  useEffect(()=> { //@ts-ignore
    onProfile(id);
  },[id])
  let isOwn = false
  if (userId === getUser()) {
    isOwn = true
  }
console.log('profileData', profileData);
console.log('getUser(),', getUser(),);


const [chats, setChats] = useState<any>(null);
const getChats = async () => {
  const { data } = await getUserChats(userId)
  setChats(data?.slice().reverse().map(c => ({ ...c, ...({ sender: c.participants?.find(p => p?.id !== userId) }) })))
}
useEffect(() => {
  if (userId) {
    getChats()
  }
}, [userId])
console.log('chats', chats);

function signOut() {
  localStorage.removeItem('user');
  localStorage.removeItem('phone');
}

const checkAndAddChat = async () => {
  const currentUserId = +getUser();
  const otherUserId = profileData?.id;

  // const existingChat = chats.find(chat =>
  //   chat.participants.find(p => p.id === currentUserId) &&
  //   chat.participants.find(p => p.id === otherUserId)
  // );

  // if (existingChat) {
  //   navigate(`/message/${existingChat.id}`);
  // } else {
    
    try {
      const { data, error } = await createChat([currentUserId, otherUserId])
      if (error) {
        console.log('error', error)
      }
      if (data) {
        console.log('datasasasasaa', data);
        navigate(`/message/${data?.id}`);
      }
    } catch (error) {
      console.error("Ошибка при создании чата:", error);
    }
  // }
};

function formatPhoneNumber(phoneNumber) {
  // Убедитесь, что phoneNumber является строкой
  if (typeof phoneNumber !== 'string') {
    console.error('Invalid input type:', phoneNumber);
    return phoneNumber; // или можно вернуть пустую строку или дефолтное значение, если это более уместно
  }

  // Удаление всех нецифровых символов
  const digits = phoneNumber.replace(/\D/g, '');

  // Разделение номера на части и соединение с нужными разделителями
  const match = digits.match(/^(\d{1})(\d{3})(\d{3})(\d{2})(\d{2})$/);

  // Возврат отформатированного номера или оригинального значения, если формат не соответствует ожидаемому
  return match ? `+${match[1]} ${match[2]} ${match[3]} ${match[4]} ${match[5]}` : phoneNumber;
}
const formattedPhoneNumber = phoneInput ? formatPhoneNumber(phoneInput.toString()) : '';

console.log('formattedPhoneNumber', formattedPhoneNumber);

const [isLoading, setIsLoading] = useState(false)
const [isChatLoading, setIsChatLoading] = useState(false)



const [isModalOpen, setIsModalOpen] = useState(false);

  return (
      <>
      { isOwn ? (
<OwnProfile
     profileData ={profileData}
     isChatLoading= {isChatLoading}
      isLoading={isLoading}
      formattedPhoneNumber= {formattedPhoneNumber}
      nameInput= {nameInput}
      surnameInput= {surnameInput}
      setIsChatLoading= {setIsChatLoading}
      checkAndAddChat= {checkAndAddChat}
      imageUrl={imageUrl}
      fileInputRef= {fileInputRef}
      handleAvatarChange ={handleAvatarChange}
/>
    ) : (

     <UserProfile
     profileData ={profileData}
     isChatLoading= {isChatLoading}
      isLoading={isLoading}
      formattedPhoneNumber= {formattedPhoneNumber}
      nameInput= {nameInput}
      surnameInput= {surnameInput}
      setIsChatLoading= {setIsChatLoading}
      checkAndAddChat= {checkAndAddChat}
     
     />
 ) } 



{isLoading ?  (<LoadingOverlay    noFull={80}/>) : ('')}
{isChatLoading ?  (<LoadingOverlay />) : ('')}

{isModalOpen && (
        <div style={{
          backgroundColor: 'aquamarine',
          margin: '30px',
          bottom: '50%',
          position: 'absolute',
          width:'80%',
          padding:'15px'
        }}className="modal-overlay">
          <div className="modal-content">
            <span className="close-button" style={{fontSize: '25px'}} onClick={()=> setIsModalOpen(false)}>&times;</span>
            <h2>Модальное окно</h2>
            <p>Для создания постов нужно купить премиум.</p>
            <button onClick={()=> setIsModalOpen(false)} className="close-modal-button">Купить</button>
          </div>
        </div>
      )}
    
    
    </>

   
  );
}