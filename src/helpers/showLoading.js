import { Loading } from 'quasar';

const showLoading = (message, detail, html) => {
  Loading.show({
    message: `<b>
                ${message}
              </b>
              <br/>
              <span
                class="text-amber text-italic"
              >
                ${detail}
              </span>`,
    html,
  });
};

export { showLoading };
