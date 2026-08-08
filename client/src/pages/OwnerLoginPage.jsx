import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { ownerLoginSchema } from '../schemas/ownerLoginSchema.js';
import { useOwnerAuth } from '../features/owner-auth/OwnerAuthContext.jsx';
import Card from '../components/common/Card.jsx';
import TextInput from '../components/common/TextInput.jsx';
import Button from '../components/common/Button.jsx';
import Logo from '../components/common/Logo.jsx';
import ErrorBanner from '../components/form/ErrorBanner.jsx';
import OwnerLoginIllustration from '../components/owner/OwnerLoginIllustration.jsx';
import { useNoIndex } from '../hooks/useNoIndex.js';

export default function OwnerLoginPage() {
  useNoIndex();
  const { login, isAuthenticated, checkingSession } = useOwnerAuth();
  const [formError, setFormError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(ownerLoginSchema) });

  if (!checkingSession && isAuthenticated) {
    const redirectTo = location.state?.from || '/owner/candidates';
    return <Navigate to={redirectTo} replace />;
  }

  async function onSubmit(data) {
    setFormError('');
    try {
      await login(data.email, data.password);
      navigate('/owner/candidates', { replace: true });
    } catch (error) {
      setFormError(error?.response?.data?.message || 'Login failed. Please try again.');
    }
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="hidden h-full overflow-y-auto lg:block lg:w-1/2 xl:w-3/5">
        <OwnerLoginIllustration />
      </div>

      <div className="bg-mesh-light relative flex h-full w-full flex-col items-center justify-center overflow-y-auto px-4 py-6 lg:w-1/2 xl:w-2/5">
        <div className="relative w-full max-w-sm">
          <div className="mb-6 flex flex-col items-center text-center lg:hidden">
            <Logo size="lg" variant="light" showTagline={false} />
          </div>

          <p className="mb-5 hidden text-center text-xs font-semibold uppercase tracking-wide text-gold-600 lg:block">
            Owner Access
          </p>

          <Card className="p-6 shadow-[0_8px_40px_rgba(10,21,48,0.08)] sm:p-8">
            <div className="mb-5 flex items-center gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-2.5 text-xs font-medium text-emerald-700">
              <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.2">
                <rect x="5" y="11" width="14" height="9" rx="2" />
                <path strokeLinecap="round" d="M8 11V7a4 4 0 0 1 8 0v4" />
                <circle cx="12" cy="15.5" r="1.4" fill="currentColor" stroke="none" />
              </svg>
              Restricted to authorized SecurityJob staff only
            </div>

            <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
              <ErrorBanner message={formError} />

              <TextInput
                id="email"
                label="Email"
                type="email"
                required
                autoComplete="username"
                placeholder="Enter email"
                error={errors.email?.message}
                {...register('email')}
              />
              <TextInput
                id="password"
                label="Password"
                type="password"
                required
                autoComplete="current-password"
                placeholder="Enter password"
                error={errors.password?.message}
                {...register('password')}
              />

              <Button type="submit" variant="gold" loading={isSubmitting} className="w-full">
                {isSubmitting ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>
          </Card>

          <p className="mt-6 text-center text-xs text-slate-400">
            &copy; {new Date().getFullYear()} SecurityJob. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
