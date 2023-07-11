import { Notify } from 'quasar';

const showNotifications = (messages, status, position, timeout) => {
  messages.forEach((message) => {
    Notify.create({
      message: message.text,
      color: status === true ? 'green' : 'red',
      position,
      caption: message.detail,
      timeout,
      actions: [
        {
          size: 'xs',
          bold: true,
          round: true,
          icon: 'close',
          class: 'bg-white',
          color: 'gray-1',
          handler: () => undefined,
        },
      ],
    });
  });
};

export { showNotifications };
