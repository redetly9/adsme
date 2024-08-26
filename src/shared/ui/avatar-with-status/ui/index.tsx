import type { AvatarProps } from '@mui/material'
import { Avatar, Badge } from '@mui/material'

type AvatarWithStatusProps = AvatarProps & {
  online?: boolean
};

export const AvatarWithStatus = ({ online = false, ...other }: AvatarWithStatusProps) => {
  return (
    <Badge
      color={online ? 'success' : 'default'}
      variant={online ? 'dot' : 'standard'}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    >
      <Avatar {...other} />
    </Badge>
  )
}
