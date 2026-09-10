import React from 'react';
import { AuthLayout } from './AuthLayout';
import { LoginForm } from './LoginForm';

export const LoginPage: React.FC = () => {
  return (
    <AuthLayout
      heading="Welcome back to CAREER SYNC"
      subheading="Connect your skills, opportunities, learning, and industry collaboration in one place."
    >
      <LoginForm />
    </AuthLayout>
  );
};
