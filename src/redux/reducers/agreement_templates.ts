export type AgreementTemplatesState = {
  templates: [];
};

export const initialAgreementTemplates: {
  [_: string]: any;
} = {
  templates: [],
};

const emptyPayload = {
  key: undefined,
};

export const agreement_templates = (
  state: {
    [_: string]: any;
  } = initialAgreementTemplates,
  action: AgreementTemplatesAction,
) => {
  const {payload = emptyPayload, type} = action;
  switch (type) {
    case 'clean_agreement_templates':
      if (!payload.key) {
        return initialAgreementTemplates;
      } else {
        return {
          ...state,
          [payload.key]: initialAgreementTemplates[payload.key],
        };
      }
    case 'set_agreement_templates':
      return {
        ...state,
        ...payload,
      };
    default:
      return state;
  }
};

export type AgreementTemplatesAction = {
  payload?: {
    key: string | undefined;
    templates: [];
  };
  type: string;
};
