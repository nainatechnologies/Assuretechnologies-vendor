import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Swal from 'sweetalert2';
import API from '../services/api';
import './Login.css';
import { MdPhone, MdLock, MdKey, MdArrowBack } from 'react-icons/md';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

// Step 1: Mobile Schema (10-digit Indian mobile number matching backend)
const step1Schema = z.object({
  mobile: z
    .string()
    .trim()
    .regex(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit mobile number')
});
type Step1Inputs = z.infer<typeof step1Schema>;

// Step 2: Reset Password Schema (OTP + New Password + Confirm Password)
const step2Schema = z
  .object({
    otp: z
      .string()
      .trim()
      .length(6, 'Please enter the 6-digit OTP code'),
    newPassword: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .max(72, 'Password must be at most 72 characters')
      .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Must contain at least one lowercase letter')
      .regex(/\d/, 'Must contain at least one number')
      .regex(/[^A-Za-z0-9]/, 'Must contain at least one special character'),
    confirmPassword: z.string().min(1, 'Please confirm your new password')
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword']
  });
type Step2Inputs = z.infer<typeof step2Schema>;

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2>(1);
  const [mobile, setMobile] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);

  // Forms
  const formStep1 = useForm<Step1Inputs>({
    resolver: zodResolver(step1Schema),
    defaultValues: { mobile: '' }
  });

  const formStep2 = useForm<Step2Inputs>({
    resolver: zodResolver(step2Schema),
    defaultValues: { otp: '', newPassword: '', confirmPassword: '' }
  });

  // Resend Countdown Timer
  useEffect(() => {
    if (resendCountdown <= 0) return;
    const interval = setInterval(() => {
      setResendCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [resendCountdown]);

  // Step 1: Submit Mobile -> Send OTP
  const onStep1Submit = async (data: Step1Inputs) => {
    setLoading(true);
    const cleanMobile = data.mobile.trim();

    try {
      const res = await API.post('/auth/vendor/forgot-password', { mobile: cleanMobile });
      if (res.data.success) {
        setMobile(cleanMobile);
        setResendCountdown(30); // 30s cooldown matching backend rate limit
        Swal.fire({
          icon: 'success',
          title: 'OTP Sent!',
          text: res.data.message || 'A 6-digit verification code has been sent to your mobile number.',
          timer: 2000,
          showConfirmButton: false
        }).then(() => {
          setStep(2);
        });
      }
    } catch (err: any) {
      console.error('Forgot Password Error:', err);
      const serverMessage = err.response?.data?.message;
      if (err.response?.status === 429) {
        Swal.fire({
          title: 'Please Wait',
          text: serverMessage || 'Please wait 30 seconds before requesting another OTP.',
          icon: 'warning',
          confirmButtonColor: '#2563EB'
        });
      } else {
        formStep1.setError('mobile', {
          type: 'server',
          message: serverMessage || 'Vendor account not found with this mobile number.'
        });
      }
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP Action
  const handleResendOtp = async () => {
    if (resendCountdown > 0 || !mobile || loading) return;
    setLoading(true);

    try {
      const res = await API.post('/auth/vendor/forgot-password', { mobile });
      if (res.data.success) {
        setResendCountdown(30);
        Swal.fire({
          icon: 'success',
          title: 'OTP Resent!',
          text: 'A new 6-digit OTP code has been sent to your mobile number.',
          timer: 2000,
          showConfirmButton: false
        });
      }
    } catch (err: any) {
      console.error('Resend OTP Error:', err);
      Swal.fire({
        icon: 'error',
        title: 'Failed to Resend',
        text: err.response?.data?.message || 'Unable to send OTP. Please try again later.',
        confirmButtonColor: '#EF4444'
      });
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Submit OTP + New Password -> Reset Password
  const onStep2Submit = async (data: Step2Inputs) => {
    setLoading(true);

    try {
      const res = await API.post('/auth/vendor/reset-password', {
        mobile,
        otp: data.otp.trim(),
        newPassword: data.newPassword
      });

      if (res.data.success) {
        Swal.fire({
          title: 'Success!',
          text: 'Password reset successfully! Please sign in with your new password.',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        }).then(() => {
          navigate('/login');
        });
      }
    } catch (err: any) {
      console.error('Reset Password Error:', err);
      const serverMessage = err.response?.data?.message;

      if (serverMessage?.toLowerCase().includes('otp')) {
        formStep2.setError('otp', {
          type: 'server',
          message: serverMessage || 'Invalid or expired OTP. Please check and try again.'
        });
      } else if (err.response?.data?.errors && Array.isArray(err.response.data.errors)) {
        err.response.data.errors.forEach((e: any) => {
          if (e.field === 'newPassword') {
            formStep2.setError('newPassword', { type: 'server', message: e.message });
          } else if (e.field === 'otp') {
            formStep2.setError('otp', { type: 'server', message: e.message });
          }
        });
      } else {
        Swal.fire({
          title: 'Reset Failed',
          text: serverMessage || 'Failed to reset password. Please try again.',
          icon: 'error',
          confirmButtonColor: '#EF4444'
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-header text-center mb-4">
          <div className="vendor-logo-wrapper">
            {step === 1 ? <MdKey className="vendor-logo-icon" /> : <MdLock className="vendor-logo-icon" />}
          </div>
          <h2 className="login-title mb-0">
            {step === 1 ? 'Forgot Password' : 'Set New Password'}
          </h2>
          <p className="login-subtitle mt-2">
            {step === 1
              ? 'Enter your registered 10-digit mobile number to receive an OTP.'
              : `Enter the 6-digit code sent to +91 ${mobile} and choose your new password.`}
          </p>
        </div>

        {/* Step 1: Enter Mobile Number */}
        {step === 1 && (
          <form onSubmit={formStep1.handleSubmit(onStep1Submit)} className="login-form" noValidate>
            <div className="form-group">
              <label htmlFor="mobile">Mobile Number</label>
              <div className="input-icon-wrapper">
                <MdPhone className="input-icon" />
                <input
                  type="tel"
                  id="mobile"
                  maxLength={10}
                  className={`form-control with-icon ${formStep1.formState.errors.mobile ? 'input-error' : ''}`}
                  placeholder="Enter 10-digit mobile (e.g. 9876543210)"
                  {...formStep1.register('mobile')}
                />
              </div>
              {formStep1.formState.errors.mobile && (
                <span style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '4px', display: 'block' }}>
                  {formStep1.formState.errors.mobile.message}
                </span>
              )}
            </div>

            <button type="submit" className="btn btn-primary w-100 mt-4" disabled={loading}>
              {loading ? 'Sending OTP...' : 'Send OTP'}
            </button>

            <div className="text-center mt-3">
              <Link
                to="/login"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  color: 'var(--primary)',
                  textDecoration: 'none',
                  fontSize: '0.875rem',
                  fontWeight: 600
                }}
              >
                <MdArrowBack /> Back to Sign In
              </Link>
            </div>
          </form>
        )}

        {/* Step 2: OTP + New Password */}
        {step === 2 && (
          <form onSubmit={formStep2.handleSubmit(onStep2Submit)} className="login-form" noValidate>
            {/* 6-Digit OTP */}
            <div className="form-group">
              <label htmlFor="otp">6-Digit OTP Code</label>
              <div className="input-icon-wrapper">
                <MdKey className="input-icon" />
                <input
                  type="text"
                  id="otp"
                  maxLength={6}
                  className={`form-control with-icon ${formStep2.formState.errors.otp ? 'input-error' : ''}`}
                  placeholder="Enter 6-digit OTP"
                  {...formStep2.register('otp')}
                  style={{ letterSpacing: '4px', fontSize: '1.05rem', fontWeight: 600 }}
                />
              </div>
              {formStep2.formState.errors.otp && (
                <span style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '4px', display: 'block' }}>
                  {formStep2.formState.errors.otp.message}
                </span>
              )}
            </div>

            {/* New Password */}
            <div className="form-group">
              <label htmlFor="newPassword">New Password</label>
              <div className="input-icon-wrapper" style={{ position: 'relative' }}>
                <MdLock className="input-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="newPassword"
                  className={`form-control with-icon ${formStep2.formState.errors.newPassword ? 'input-error' : ''}`}
                  placeholder="Min 8 chars (A-Z, a-z, 0-9, special)"
                  {...formStep2.register('newPassword')}
                  style={{ paddingRight: '42px' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: '#64748b',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '4px'
                  }}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <FaEyeSlash size={17} /> : <FaEye size={17} />}
                </button>
              </div>
              {formStep2.formState.errors.newPassword && (
                <span style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '4px', display: 'block' }}>
                  {formStep2.formState.errors.newPassword.message}
                </span>
              )}
            </div>

            {/* Confirm New Password */}
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm New Password</label>
              <div className="input-icon-wrapper" style={{ position: 'relative' }}>
                <MdLock className="input-icon" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  className={`form-control with-icon ${formStep2.formState.errors.confirmPassword ? 'input-error' : ''}`}
                  placeholder="Re-enter new password"
                  {...formStep2.register('confirmPassword')}
                  style={{ paddingRight: '42px' }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: '#64748b',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '4px'
                  }}
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? <FaEyeSlash size={17} /> : <FaEye size={17} />}
                </button>
              </div>
              {formStep2.formState.errors.confirmPassword && (
                <span style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '4px', display: 'block' }}>
                  {formStep2.formState.errors.confirmPassword.message}
                </span>
              )}
            </div>

            <button type="submit" className="btn btn-primary w-100 mt-4" disabled={loading}>
              {loading ? 'Resetting Password...' : 'Reset Password'}
            </button>

            <div
              className="d-flex justify-content-between align-items-center mt-3"
              style={{ fontSize: '0.85rem' }}
            >
              <button
                type="button"
                onClick={() => {
                  setStep(1);
                  formStep2.reset();
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  padding: 0
                }}
              >
                ← Change Mobile Number
              </button>

              <button
                type="button"
                onClick={handleResendOtp}
                disabled={resendCountdown > 0 || loading}
                style={{
                  background: 'none',
                  border: 'none',
                  color: resendCountdown > 0 ? 'var(--text-light, #94a3b8)' : 'var(--primary)',
                  cursor: resendCountdown > 0 ? 'not-allowed' : 'pointer',
                  fontWeight: 600,
                  padding: 0
                }}
              >
                {resendCountdown > 0 ? `Resend OTP in ${resendCountdown}s` : 'Resend OTP'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
