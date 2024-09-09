import './index.scss'
import 'react-datepicker/dist/react-datepicker.css'

import { Box } from '@mui/material'
import { es } from 'date-fns/locale/es'
import { ru } from 'date-fns/locale/ru'
import moment from 'moment'
import { memo } from 'react'
import DatePicker, { registerLocale } from 'react-datepicker'
import { useTranslation } from 'react-i18next'

registerLocale('es', es)
registerLocale('ru', ru)

type DatePickerProps = {
  startDate: moment.Moment | null,
  endDate: moment.Moment | null,
  onChange: (dates: [(moment.Moment | null), (moment.Moment | null)]) => void
}

export const RangeDatePicker = memo(({ startDate, endDate, onChange }: DatePickerProps) => {
  const { i18n } = useTranslation()

  const onChangeHandler = (dates: [Date | null, Date | null]) => {
    const [start, end] = dates

    const formattedStartDate = start !== null ? moment(start) : null
    const formattedEndDate = end !== null ? moment(end) : null

    onChange([formattedStartDate, formattedEndDate])
  }

  return (
    <Box className='DatePicker-wrapper'>
      <DatePicker
        className='DatePicker'
        locale={i18n.language}
        onChange={onChangeHandler}
        startDate={startDate ? startDate.toDate() : null as any} //ts ругается на null
        endDate={endDate ? endDate.toDate() : null as any} //ts ругается на null
        selectsRange
        inline
      />
    </Box>
  )
})
