import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { FiCheckCircle, FiMail } from 'react-icons/fi';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import AuthCard from '../components/AuthCard';
import { useRequestPasswordReset } from '../hooks/useAuth';
import { toast } from '@/app/store/toast-store';

interface ForgotPasswordForm {
  email: string;
}

export default function ForgotPasswordPage() {
  const requestReset = useRequestPasswordReset();
  const [sentTo, setSentTo] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordForm>({ defaultValues: { email: '' } });

  const onSubmit = handleSubmit(async (values) => {
    try {
      await requestReset.mutateAsync(values.email);
      setSentTo(values.email);
      toast.success('Reset link sent', 'Check your inbox for password reset instructions.');
    } catch {
      toast.error('Request failed', 'Unable to send a reset link to that email.');
    }
  });

  if (sentTo) {
    return (
      <AuthCard title="Check your inbox">
        <div className="flex flex-col items-center gap-4 py-4 text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-green-50 text-green-600">
            <FiCheckCircle size={30} />
          </span>
          <p className="text-sm leading-relaxed text-slate-600">
            We sent a password reset link to <span className="font-bold text-slate-900">{sentTo}</span>. The link
            expires in 30 minutes.
          </p>
          <Button variant="outline" onClick={() => setSentTo(null)}>
            Try another email
          </Button>
        </div>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title="Forgot your password?"
      description="Enter your email and we'll send you a link to reset it."
      footer={
        <p>
          Remembered it?{' '}
          <Link to="/login" className="font-semibold text-primary-600 hover:underline">
            Back to sign in
          </Link>
        </p>
      }
    >
      <form onSubmit={onSubmit} className="space-y-5" noValidate>
        <Input
          label="Email address"
          type="email"
          placeholder="you@company.com"
          icon={<FiMail size={16} />}
          autoComplete="email"
          error={errors.email?.message}
          {...register('email', {
            required: 'Email is required',
            pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email address' },
          })}
        />
        <Button type="submit" full size="lg" loading={requestReset.isPending}>
          Send reset link
        </Button>
      </form>
    </AuthCard>
  );
}
