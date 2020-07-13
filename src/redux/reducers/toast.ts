export type ToastState = {
  text: string;
  type?: string;
};

export const initialToast: ToastState = {text: '', type: 'danger'};

export const toast = (
  state: ToastState = initialToast,
  action: ToastAction,
) => {
  const {payload = {}, type} = action;
  switch (type) {
    case 'clean_toast':
      return initialToast;
    case 'set_toast':
      return {text: payload.text, type: payload.type ?? 'danger'};
    default:
      return state;
  }
};

export type ToastAction = {payload?: Partial<ToastState>; type: string};
