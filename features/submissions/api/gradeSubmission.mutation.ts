import { gql } from '@apollo/client';

export const GRADE_SUBMISSION_MUTATION = gql`
  mutation GradeSubmission($submissionId: ID!, $grade: Int!, $feedback: String) {
    gradeSubmission(submissionId: $submissionId, grade: $grade, feedback: $feedback) {
      id
      content
      grade
      feedback
      author {
        id
        name
      }
    }
  }
`;
