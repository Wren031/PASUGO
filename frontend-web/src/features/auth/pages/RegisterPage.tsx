import { useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { FiMail, FiPhone, FiUser } from 'react-icons/fi';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import AuthCard from '../components/AuthCard';
import { useRegister } from '../hooks/useAuth';
import { toast } from '@/app/store/toast-store';
import type { RegisterPayload } from '../types';

export default function RegisterPage() {
  const [searchParams] = useSearchParams();
  const defaultRole = searchParams.get('role') === 'driver' ? 'driver' : 'passenger';
  const register = useRegister();

  const {
    register: registerField,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterPayload & { confirmPassword: string }>({
    defaultValues: { name: '', email: '', phone: '', password: '', confirmPassword: '', role: defaultRole },
  });

  const password = watch('password');

  const onSubmit = handleSubmit(async (values) => {
    try {
      await register.mutateAsync({
        name: values.name,
        email: values.email,
        phone: values.phone,
        password: values.password,
        role: values.role,
      });
      toast.success('Account created', 'Your account has been registered successfully.');
    } catch {
      toast.error('Registration failed', 'Unable to create your account at this time.');
    }
  });

  return (
    <AuthCard
      title="Create your account"
      description="Join HatodGo as a passenger or driver."
      footer={
        <p>
          Already have an account?{' '}
          <a href="/login" className="font-semibold text-primary-600 hover:underline">
            Sign in
          </a>
        </p>
      }
    >
      <form onSubmit={onSubmit} className="space-y-5" noValidate>
        <Input
          label="Full name"
          placeholder="Juan Dela Cruz"
          icon={<FiUser size={16} />}
          autoComplete="name"
          error={errors.name?.message}
          {...registerField('name', { required: 'Full name is required', minLength: { value: 3, message: 'Name must be at least 3 characters' } })}
        />
        <Input
          label="Email address"
          type="email"
          placeholder="you@email.com"
          icon={<FiMail size={16} />}
          autoComplete="email"
          error={errors.email?.message}
          {...registerField('email', {
            required: 'Email is required',
            pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email address' },
          })}
        />
        <Input
          label="Mobile number"
          type="tel"
          placeholder="09XX XXX XXXX"
          icon={<FiPhone size={16} />}
          autoComplete="tel"
          error={errors.phone?.message}
          {...registerField('phone', {
            required: 'Mobile number is required',
            pattern: { value: /^09\d{9}$/, message: 'Enter a valid 11-digit PH mobile number' },
          })}
        />
        <div>
          <span className="mb-1.5 block text-sm font-medium text-slate-700">I want to join as</span>
          <div className="grid grid-cols-2 gap-3">
            <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-slate-300 p-3 text-sm font-semibold text-slate-700 transition-colors has-[:checked]:border-primary-500 has-[:checked]:bg-primary-50 has-[:checked]:text-primary-700">
              <input type="radio" value="passenger" className="sr-only" {...registerField('role')} />
              Passenger
            </label>
            <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-slate-300 p-3 text-sm font-semibold text-slate-700 transition-colors has-[:checked]:border-primary-500 has-[:checked]:bg-primary-50 has-[:checked]:text-primary-700">
              <input type="radio" value="driver" className="sr-only" {...registerField('role')} />
              Driver
            </label>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            autoComplete="new-password"
            error={errors.password?.message}
            {...registerField('password', {
              required: 'Password is required',
              minLength: { value: 8, message: 'Minimum 8 characters' },
            })}
          />
          <Input
            label="Confirm password"
            type="password"
            placeholder="••••••••"
            autoComplete="new-password"
            error={errors.confirmPassword?.message}
            {...registerField('confirmPassword', {
              required: 'Please confirm your password',
              validate: (value) => value === password || 'Passwords do not match',
            })}
          />
        </div>
        <Button type="submit" full size="lg" loading={register.isPending}>
          Create account
        </Button>
        <p className="text-center text-xs leading-relaxed text-slate-400">
          By registering, you agree to our Terms &amp; Conditions and Privacy Policy.
        </p>
      </form>
    </AuthCard>
  );
}
