import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiAlertCircle, FiEye, FiEyeOff, FiLock, FiMail } from 'react-icons/fi';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import AuthCard from '../components/AuthCard';
import { useLogin } from '../hooks/useAuth';
import { useAuthStore } from '@/app/store/auth-store';
import { MOCK_CREDENTIALS } from '@/constants/app';
import { toast } from '@/app/store/toast-store';
import type { LoginPayload } from '../types';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const setSession = useAuthStore((state) => state.setSession);
  const login = useLogin();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginPayload>({
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      const response = await login.mutateAsync(values);
      setSession(response.user, response.token);
      toast.success('Welcome back!', `Signed in as ${response.user.role}`);
      const from = (location.state as { from?: string } | null)?.from;
      navigate(from && from.startsWith('/admin') ? from : '/admin', { replace: true });
    } catch {
      toast.error('Login failed', 'Invalid email or password. Try the demo credentials.');
    }
  });

  return (
    <AuthCard
      title="Sign in to your account"
      description="Enter your credentials to access the admin dashboard."
      footer={
        <p>
          Don't have an account?{' '}
          <Link to="/register" className="font-semibold text-primary-600 hover:underline">
            Register
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
        <div className="relative">
          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter your password"
            icon={<FiLock size={16} />}
            autoComplete="current-password"
            error={errors.password?.message}
            {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Password must be at least 6 characters' } })}
          />
          <button
            type="button"
            onClick={() => setShowPassword((visible) => !visible)}
            className="absolute right-3 top-[38px] text-slate-400 transition-colors hover:text-slate-600"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
          </button>
        </div>
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-xs text-slate-600">
            <input type="checkbox" className="h-3.5 w-3.5 rounded border-slate-300 text-primary-500 focus:ring-primary-500" />
            Remember me
          </label>
          <Link to="/forgot-password" className="text-xs font-semibold text-primary-600 hover:underline">
            Forgot password?
          </Link>
        </div>
        <Button type="submit" full size="lg" loading={login.isPending}>
          Sign in
        </Button>
      </form>

      <div className="mt-5 flex items-start gap-2.5 rounded-lg border border-blue-200 bg-blue-50 p-3.5">
        <FiAlertCircle size={15} className="mt-0.5 shrink-0 text-blue-500" />
        <p className="text-xs leading-relaxed text-blue-700">
          <span className="font-bold">Demo credentials</span>
          <br />
          Email: {MOCK_CREDENTIALS.email} · Password: {MOCK_CREDENTIALS.password}
        </p>
      </div>
    </AuthCard>
  );
}
