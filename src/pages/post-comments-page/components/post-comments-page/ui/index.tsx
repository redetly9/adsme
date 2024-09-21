import './index.scss'

import SendIcon from '@mui/icons-material/Send'
import { Box, Typography } from '@mui/material'
import { memo, useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'

import { useUserStore } from '~model/user-model'
import { ChatMessage } from '~pages/user-chat-page'
import { UserFeedPageFeed, UserFeedPageSkeleton } from '~pages/user-feed-page'
import { getCommentsByPostId } from '~shared/api'
import { addComment } from '~shared/api/comments'
import { getPostById } from '~shared/api/post-api'
import type { CommentWithUser } from '~shared/types/comments'
import type { PostType } from '~shared/types/posts'
import { CustomInput } from '~shared/ui/custom-input'
import { LoadingOverlay } from '~shared/ui/loading-overlay'
import { PageHeader } from '~shared/ui/page-header'

export const PostCommentsPage = memo(() => {
  const { t } = useTranslation()
  const { id: paramsPostId } = useParams()
  const user = useUserStore(state => state.user)

  const [post, setPost] = useState<PostType | null>(null)
  const [textAreaValue, setTextAreaValue] = useState('')
  const [comments, setComments] = useState<CommentWithUser[]>([])
  const [isInitialLoading, setIsInitialLoading] = useState(false)
  const [isPostingComment, setIsPostingComment] = useState(false)

  const sendComment = async () => {
    if (!textAreaValue || !paramsPostId || !user?.id) return

    try {
      setIsPostingComment(true)
      await addComment({
        postId: paramsPostId,
        senderId: user.id.toString(),
        text: textAreaValue
      })
    } catch (err) {
      console.error(err)
    } finally {
      setIsPostingComment(false)
      setTextAreaValue('')
      getComments()
    }
  }

  const getComments = useCallback(async () => {
    if (!paramsPostId) return

    try {
      const response = await getCommentsByPostId(paramsPostId)
      if (response && 'data' in response) {
        setComments(response.data)
      } else {
        console.error(response.error)
      }
    } catch (err) {
      console.error(err)
    } finally {
    }
  }, [paramsPostId])

  useEffect(() => {
    if (!paramsPostId) return

    (async () => {
      {
        try {
          setIsInitialLoading(true)
          const response = await getPostById(paramsPostId)
          await getComments()
          if (response && 'data' in response) {
            setPost(response.data)
          } else {
            console.error(response.error)
          }
        } catch (err) {
          console.error(err)
        } finally {
          setIsInitialLoading(false)
        }
      }
    })()
  }, [getComments, paramsPostId])

  return (
    <Box className='PostCommentsPage'>
      {isInitialLoading ? <LoadingOverlay /> : null}
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
                withoutViewsFunc
              />
            )
            : <UserFeedPageSkeleton />
        }
        <Box className='PostCommentsPage-content-chat'>
          {
            comments.length > 0
              ? comments.map((comment) => (
                <ChatMessage
                  key={comment.id}
                  text={comment.text}
                  name={comment.sender_id.name}
                  sender_id={comment.sender_id.id}
                  created_at={comment.created_at}
                />
              ))
              : (
                <Box className='PostCommentsPage-content-chat-empty'>
                  <Typography
                    variant='body2'
                    sx={{ color: 'text.secondary' }}
                  >
                    {t('Комментариев нет')}
                  </Typography>
                </Box>
              )
          }
        </Box>
      </Box>
      <Box className='PostCommentsPage-footer'>
        <CustomInput
          className='PostCommentsPage-footer-input'
          placeholder={t('Комментарий')}
          value={textAreaValue}
          onChange={(event) => setTextAreaValue(event.target.value)}
          iconRight={textAreaValue ? <SendIcon sx={{ color: '#0b6bcb' }} /> : null}
          disabled={isPostingComment}
          onRightIconClick={sendComment}
        />
      </Box>
    </Box>
  )
})
