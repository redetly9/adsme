import AddIcon from '@mui/icons-material/Add'
import { Box, Button, Chip, Input } from '@mui/material'
import Stack from '@mui/material/Stack'
import type { ChangeEvent, Dispatch, SetStateAction } from 'react'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

type TextInputMultipleSelectProps = {
  tags: string[],
  setTags: Dispatch<SetStateAction<string[]>>
}

export const TextInputMultipleSelect = ({ tags, setTags }: TextInputMultipleSelectProps) => {
  const { t } = useTranslation()
  const [tagInputValue, setTagInputValue] = useState('')
  const [tagInputError, setTagInputError] = useState(false)

  const tagsInputHandle = (event: ChangeEvent<HTMLInputElement>) => {
    // запрещает вводить что-то кроме букв и цифр
    // const value = event.target.value.replace(/[^a-zA-Zа-яА-Я0-9]/g, '')
    const value = event.target.value.replace(/[.,\s!%^*()+=\-\\|/{}[\]:;"'?<>~`]/g, '')

    if (tags.some(t => t === value)) {
      setTagInputError(true)
    } else {
      setTagInputError(false)
    }

    setTagInputValue(value)
  }

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      addTag()
    }
  }

  const addTag = () => {
    setTags(prev => ([...prev, tagInputValue]))
    setTagInputValue('')
  }

  const deleteTag = (tag: string) => {
    setTags(prev => prev.filter(t => t !== tag))
  }

  return (
    <Stack>
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Input
          fullWidth
          value={tagInputValue}
          onChange={tagsInputHandle}
          onKeyDown={onKeyDown}
          placeholder={t('# Добавить тег')}
          error={tagInputError}
        />
        <Button
          variant='contained'
          onClick={addTag}
          disabled={tagInputError}
        >
          <AddIcon />
        </Button>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '5px', maxWidth: 'max-content', flexWrap: 'wrap', mt: 1 }}>
        {
          tags.map(tag => (
            <Chip
              key={tag}
              sx={{ alignItems: 'center', overflow: 'hidden', p: 1, fontSize: '16px' }}
              onClick={deleteTag.bind(null, tag)}
              label={tag}
            />
          ))
        }
      </Box>
    </Stack>
  )
}
