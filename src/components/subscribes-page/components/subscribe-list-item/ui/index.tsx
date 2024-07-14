import ReplyRoundedIcon from '@mui/icons-material/ReplyRounded'
import Avatar from '@mui/joy/Avatar'
import Box from '@mui/joy/Box'
import Button from '@mui/joy/Button'
import Sheet from '@mui/joy/Sheet'
import Typography from '@mui/joy/Typography'
import { useNavigate } from 'react-router-dom'

import { createChat } from '../../../../../hooks.ts'
import { getUser } from '../../../../../utils/storageUtils.ts'

type SubscribeListItemProps = {
  id: number,
  name: string | null,
  phone: string,
  avatar: string | null,
  surname: string | null,
  activate: false,
  lastname: string | null,
  birth_date: string | null
}

export const SubscribeListItem = ({ birth_date, activate, avatar, name, phone, surname, lastname, id }: SubscribeListItemProps) => {
  const navigate = useNavigate()

  const navigateToProfile = () => {
    navigate(`/profile/${id}`)
  }

  const checkAndAddChat = async () => {
    const currentUserId = +getUser()

    try {
      const { data, error }: any = await createChat([currentUserId, id])
      if (error) {
        console.log('error', error)
      }
      if (data) {
        navigate(`/message/${data?.id}`)
      }
    } catch (error) {
      console.error('Ошибка при создании чата:', error)
    }
  }

  const formatPhoneNumber = (phoneNumber: string) => {
    const digits = phoneNumber.replace(/\D/g, '')
    // Разделение номера на части и соединение с нужными разделителями
    const match = digits.match(/^(\d{1})(\d{3})(\d{3})(\d{2})(\d{2})$/)
    // Возврат отформатированного номера или оригинального значения, если формат не соответствует ожидаемому
    return match ? `+${match[1]} ${match[2]} ${match[3]} ${match[4]} ${match[5]}` : phoneNumber
  }

  return (
    <Sheet
      variant='soft'
      sx={{
        borderRadius: 'sm',
        border: 'none',
        p: 2,
        pt: 2,
        pb: 2,
        mb: 3
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Avatar
            src={avatar || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ4JYrktZNYfJ7k1QFk-hL3v6J9fiTAvsZeWRTybV0hSv_-wwPli_IJBB16Y8Tepi5U0Qg&usqp=CAU'}
            onClick={navigateToProfile}
          />
          <Box
            sx={{ ml: 2 }}
            onClick={navigateToProfile}
          >
            <Typography
              level='title-sm'
              textColor='text.primary'
              mb={0.5}
            >
              {(!surname && !name && !lastname) ? 'User' : `${surname} ${name} ${lastname}`}
            </Typography>
            <Typography
              level='title-sm'
              textColor='text.primary'
              mb={0.5}
            >
              {formatPhoneNumber(phone)}
            </Typography>
          </Box>
        </Box>
        <Box
          sx={{ display: 'flex', height: '100%', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'flex-end', mr: 0.5 }}
        >
          <Typography
            level='body-xs'
            textColor='text.tertiary'
          >
            {birth_date ? birth_date : 'ДР не указан'}
          </Typography>
          <Button
            size='sm'
            sx={{ p: 0 }}
            variant='plain'
            color='neutral'
            startDecorator={<ReplyRoundedIcon />}
            onClick={checkAndAddChat}
          >
            Reply
          </Button>
        </Box>
      </Box>
    </Sheet>
  )
}
