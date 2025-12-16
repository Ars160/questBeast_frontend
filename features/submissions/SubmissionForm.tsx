// features/submissions/SubmissionForm.tsx
'use client';

import { useState } from 'react';
import { useMutation } from '@apollo/client/react';
import { CREATE_SUBMISSION_MUTATION } from '@/features/submissions/api/createSubmission.mutation';

type SubmissionFormProps = {
  questId: string;
  refreshSubmissions: () => void;
};

export default function SubmissionForm({ questId, refreshSubmissions }: SubmissionFormProps) {
  const [content, setContent] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [createSubmission, { loading, error }] = useMutation(CREATE_SUBMISSION_MUTATION);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      alert('Content не может быть пустым');
      return;
    }

    try {
      await createSubmission({
        variables: {
          content,
          questId,
          fileUrl: fileUrl || null,
        },
      });
      setContent('');
      setFileUrl('');
      refreshSubmissions();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border p-4 rounded mt-4 space-y-2">
      <textarea
        placeholder="Текст submission"
        className="w-full border p-2"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
      />
      <input
        placeholder="Ссылка на файл (необязательно)"
        className="w-full border p-2"
        value={fileUrl}
        onChange={(e) => setFileUrl(e.target.value)}
      />
      <button
        type="submit"
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        {loading ? 'Отправка...' : 'Отправить'}
      </button>
      {error && <p className="text-red-500">{error.message}</p>}
    </form>
  );
}
