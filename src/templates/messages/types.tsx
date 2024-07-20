export type UserProps = {
    name: string,
    username: string,
    avatar: string,
    online: boolean,
    _id: string
  };

export type MessageProps = {
    id: string,
    content: string,
    timestamp: string,
    unread?: boolean,
    sender: UserProps | 'You',
    attachment?: {
      fileName: string,
      type: string,
      size: string
    },
    sender_id?: string
  };

export type ChatProps = {
    id: string,
    sender: UserProps,
    messages: MessageProps[]
  };
