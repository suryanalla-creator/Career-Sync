import React from 'react';
import { AuthLayout } from './AuthLayout';
import { RegisterForm } from './RegisterForm';

export const RegisterPage: React.FC = () => {
  return (
    <AuthLayout
      heading="Join the CAREER SYNC Ecosystem"
      subheading="Empowering students, educational institutions, and corporate recruiters."
    >
      <RegisterForm />
    </AuthLayout>
  );
};
