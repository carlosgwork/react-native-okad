import { TableSortOps } from '@utils/types'

type ContactsState = {
  contacts: [],
  sortOp: TableSortOps
}

export const initialContacts: ContactsState = {
  contacts: [],
  sortOp: { sortBy: 'phoneNumber', sortOrder: 'ASC' }
}

export const contacts = (state: ContactsState = initialContacts, action: ContactsAction) => {
  const { payload = {}, type } = action
  switch (type) {
    case 'clean_contacts':
      if (!payload.key) {
        return initialContacts
      } else {
        return {
          ...state,
          [payload.key]: initialContacts[payload.key]
        }
      }
    case 'set_contacts':
      return {
        ...state,
        ...payload,
      }
    default:
      return state
  }
}

export type ContactsAction = { payload?: $Shape<ContactsState>, type: string }