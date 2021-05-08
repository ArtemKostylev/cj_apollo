import { gql } from "@apollo/client";

export const LOGIN_MUTATION = gql`
  mutation LoginMutation($login: String!, $password: String!) {
    signin(login: $login, password: $password) {
      token
      user {
        roleId
        teacher {
          id
          relations {
            course {
              id
              name
              group
            }
          }
        }
      }
    }
  }
`;

export const UPDATE_JOURNAL_MUTATION = gql`
  mutation updateJournalMutation($data: JournalUpdateInput) {
    updateJournal(data: $data)
  }
`;

export const UPDATE_REPLACEMENTS_MUTATION = gql`
  mutation updateReplacementsMutation($data: [ReplacementInput]) {
    updateReplacements(data: $data) {
      id
      date
    }
  }
`;

export const UPDATE_NOTE_MUTATION = gql`
  mutation updateNoteMutation($data: NoteInput) {
    updateNote(data: $data) {
      id
      text
    }
  }
`;

export const UPDATE_CONSULTS_MUTATION = gql`
  mutation updateConsultsMutation($data: [ConsultInput]) {
    updateConsults(data: $data) {
      id
      date
    }
  }
`;

export const DELETE_CONSULTS_MUTATION = gql`
  mutation deleteConsultsMutation($ids: [Int!]!) {
    deleteConsults(ids: $ids)
  }
`;

export const UPDATE_SUBGROUPS_MUTATION = gql`
  mutation updateSubgroupsMutation($data: [SubgroupInput]) {
    updateSubgroups(data: $data) {
      subgroup
    }
  }
`;
