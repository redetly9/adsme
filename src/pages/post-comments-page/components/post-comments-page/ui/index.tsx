import './index.scss'

import SendIcon from '@mui/icons-material/Send'
import { Box } from '@mui/material'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'

import { UserFeedPageFeed, UserFeedPageSkeleton } from '~pages/user-feed-page'
import { getPostById } from '~shared/api/post-api'
import type { PostType } from '~shared/types/posts'
import { CustomInput } from '~shared/ui/custom-input'
import { PageHeader } from '~shared/ui/page-header'

export const PostCommentsPage = () => {
  const { t } = useTranslation()
  const { id: paramsPostId } = useParams()

  const [post, setPost] = useState<PostType | null>(null)
  const [textAreaValue, setTextAreaValue] = useState('')

  const sendComment = () => {
    console.log('comment', textAreaValue) // TODO отправка комментариев к посту
    setTextAreaValue('')
  }

  useEffect(() => {
    if (!paramsPostId) return

    (async () => {
      {
        try {
          const response = await getPostById(paramsPostId)
          if (response && 'data' in response) {
            setPost(response.data)
          } else {
            console.error(response.error)
          }
        } catch (err) {
          console.error(err)
        }
      }
    })()
  }, [paramsPostId])

  console.log('post', post)

  return (
    <Box className='PostCommentsPage'>
      <PageHeader
        title={t('Комментарии')}
        withRightSideAction={false}
      />
      <Box className='PostCommentsPage-content'>
        {
          post
            ? (
              <UserFeedPageFeed
                withoutComments
                post={post}
              />
            )
            : <UserFeedPageSkeleton />
        }
        <Box className='PostCommentsPage-content-chat'>
          Chat
        </Box>
      </Box>
      <Box className='PostCommentsPage-footer'>
        <CustomInput
          className='PostCommentsPage-footer-input'
          placeholder={t('Сообщение')}
          value={textAreaValue}
          onChange={(event) => setTextAreaValue(event.target.value)}
          iconRight={textAreaValue ? <SendIcon sx={{ color: '#0b6bcb' }} /> : null}
          onRightIconClick={sendComment}
        />
      </Box>
    </Box>
  )
}
