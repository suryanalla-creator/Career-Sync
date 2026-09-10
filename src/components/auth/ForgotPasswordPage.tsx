import React from 'react';
import { AuthLayout } from './AuthLayout';
import { ForgotPasswordForm } from './ForgotPasswordForm';

export const ForgotPasswordPage: React.FC = () => {
  return (
    <AuthLayout
      heading="Account Recovery & Security"
      subheading="Secure access recovery for students, recruiters, and university administrators."
    >
      <ForgotPasswordForm />
    </AuthLayout>
  );
};
