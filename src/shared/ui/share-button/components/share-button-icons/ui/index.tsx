import { shareButtonConfig } from '../../../config'

type ShareButtonLinksProps = {
  shareUrl: string
}

export const ShareButtonLinks = ({ shareUrl }: ShareButtonLinksProps) => {
  return (
    <>
      {shareButtonConfig.map(({ Button, Icon, props = {} }, index) => (
        <Button
          key={index}
          url={shareUrl}
          {...props}
        >
          <Icon
            size={40}
            round
          />
        </Button>
      ))}
    </>
  )
}
