import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Swal from 'sweetalert2';
import API from '../services/api';
import './Login.css';
import { MdEmail, MdLock, MdKey, MdArrowBack } from 'react-icons/md';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

// Step 1: Identifier Schema (Email or 10-digit Mobile)
const step1Schema = z.object({
  identifier: z
    .string()
    .trim()
    .min(1, 'Email or mobile number is required')
    .refine((val) => {
      const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
      const isMobile = /^[6-9]\d{9}$/.test(val);
      return isEmail || isMobile;
    }, 'Please enter a valid email address or 10-digit mobile number')
});
type Step1Inputs = z.infer<typeof step1Schema>;

// Step 2: OTP Schema
const step2Schema = z.object({
  otp: z
    .string()
    .trim()
    .length(6, 'Please enter the 6-digit OTP code')
});
type Step2Inputs = z.infer<typeof step2Schema>;

// Step 3: Password Schema
const step3Schema = z
  .object({
    newPassword: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Must contain at least one lowercase letter')
      .regex(/\d/, 'Must contain at least one number')
      .regex(/[^A-Za-z0-9]/, 'Must contain at least one special character'),
    confirmPassword: z.string().min(1, 'Please confirm your password')
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword']
  });
type Step3Inputs = z.infer<typeof step3Schema>;

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [identifier, setIdentifier] = useState('');
  const [verifiedOtp, setVerifiedOtp] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Forms for each step
  const formStep1 = useForm<Step1Inputs>({ resolver: zodResolver(step1Schema) });
  const formStep2 = useForm<Step2Inputs>({ resolver: zodResolver(step2Schema) });
  const formStep3 = useForm<Step3Inputs>({ resolver: zodResolver(step3Schema) });

  // Step 1: Submit Identifier -> Send OTP
  const onStep1Submit = async (data: Step1Inputs) => {
    setLoading(true);
    const cleanVal = data.identifier.trim();
    const payload = cleanVal.includes('@')
      ? { email: cleanVal.toLowerCase() }
      : { mobile: cleanVal };

    try {
      const res = await API.post('/auth/vendor/forgot-password', payload);
      if (res.data.success) {
        setIdentifier(cleanVal);
        Swal.fire({
          icon: 'success',
          title: 'OTP Sent!',
          text: 'A 6-digit code has been sent. (Use demo OTP: 123456)',
          timer: 2000,
          showConfirmButton: false
        }).then(() => {
          setStep(2);
        });
      }
    } catch (err: any) {
      console.error('Forgot Password Error:', err);
      formStep1.setError('identifier', {
        type: 'server',
        message: err.response?.data?.message || 'Vendor account not found with this email / mobile.'
      });
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Submit OTP -> Verify
  const onStep2Submit = async (data: Step2Inputs) => {
    setLoading(true);
    const payload = identifier.includes('@')
      ? { email: identifier.toLowerCase(), otp: data.otp }
      : { mobile: identifier, otp: data.otp };

    try {
      const res = await API.post('/auth/vendor/verify-reset-otp', payload);
      if (res.data.success) {
        setVerifiedOtp(data.otp);
        setStep(3);
      }
    } catch (err: any) {
      console.error('Verify OTP Error:', err);
      formStep2.setError('otp', {
        type: 'server',
        message: err.response?.data?.message || 'Invalid or expired OTP. Use 123456.'
      });
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Submit New Password
  const onStep3Submit = async (data: Step3Inputs) => {
    setLoading(true);
    const payload = identifier.includes('@')
      ? { email: identifier.toLowerCase(), otp: verifiedOtp, newPassword: data.newPassword }
      : { mobile: identifier, otp: verifiedOtp, newPassword: data.newPassword };

    try {
      const res = await API.post('/auth/vendor/reset-password', payload);
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
      Swal.fire({
        title: 'Reset Failed',
        text: err.response?.data?.message || 'Failed to reset password. Please try again.',
        icon: 'error',
        confirmButtonColor: '#EF4444'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-header text-center mb-4">
          <div className="vendor-logo-wrapper">
            <MdKey className="vendor-logo-icon" />
          </div>
          <h2 className="login-title mb-0">
            {step === 1 && 'Forgot Password'}
            {step === 2 && 'Verify OTP'}
            {step === 3 && 'Set New Password'}
          </h2>
          <p className="login-subtitle mt-2">
            {step === 1 && 'Enter your registered vendor email or mobile number.'}
            {step === 2 && `Enter the 6-digit code sent to ${identifier}`}
            {step === 3 && 'Choose a strong password for your vendor account.'}
          </p>
        </div>

        {/* Step 1: Identifier */}
        {step === 1 && (
          <form onSubmit={formStep1.handleSubmit(onStep1Submit)} className="login-form" noValidate>
            <div className="form-group">
              <label htmlFor="identifier">Email or Mobile Number</label>
              <div className="input-icon-wrapper">
                <MdEmail className="input-icon" />
                <input
                  type="text"
                  id="identifier"
                  className={`form-control with-icon ${formStep1.formState.errors.identifier ? 'input-error' : ''}`}
                  placeholder="e.g. vendor@example.com or 9876543210"
                  {...formStep1.register('identifier')}
                />
              </div>
              {formStep1.formState.errors.identifier && (
                <span style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '4px', display: 'block' }}>
                  {formStep1.formState.errors.identifier.message}
                </span>
              )}
            </div>

            <button type="submit" className="btn btn-primary w-100 mt-4" disabled={loading}>
              {loading ? 'Sending OTP...' : 'Send OTP'}
            </button>

            <div className="text-center mt-3">
              <Link to="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--primary)', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 600 }}>
                <MdArrowBack /> Back to Sign In
              </Link>
            </div>
          </form>
        )}

        {/* Step 2: OTP */}
        {step === 2 && (
          <form onSubmit={formStep2.handleSubmit(onStep2Submit)} className="login-form" noValidate>
            <div className="form-group">
              <label htmlFor="otp">6-Digit OTP Code</label>
              <div className="input-icon-wrapper">
                <MdKey className="input-icon" />
                <input
                  type="text"
                  id="otp"
                  maxLength={6}
                  className={`form-control with-icon ${formStep2.formState.errors.otp ? 'input-error' : ''}`}
                  placeholder="123456"
                  {...formStep2.register('otp')}
                  style={{ letterSpacing: '4px', fontSize: '1.1rem', fontWeight: 700 }}
                />
              </div>
              {formStep2.formState.errors.otp && (
                <span style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '4px', display: 'block' }}>
                  {formStep2.formState.errors.otp.message}
                </span>
              )}
            </div>

            <button type="submit" className="btn btn-primary w-100 mt-4" disabled={loading}>
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>

            <div className="d-flex justify-content-between align-items-center mt-3" style={{ fontSize: '0.85rem' }}>
              <button
                type="button"
                onClick={() => setStep(1)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 0 }}
              >
                Change Email/Mobile
              </button>
              <button
                type="button"
                onClick={() => Swal.fire('OTP Resent', 'Use demo OTP: 123456', 'info')}
                style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontWeight: 600, padding: 0 }}
              >
                Resend OTP
              </button>
            </div>
          </form>
        )}

        {/* Step 3: Password */}
        {step === 3 && (
          <form onSubmit={formStep3.handleSubmit(onStep3Submit)} className="login-form" noValidate>
            <div className="form-group">
              <label htmlFor="newPassword">New Password</label>
              <div className="input-icon-wrapper" style={{ position: 'relative' }}>
                <MdLock className="input-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="newPassword"
                  className={`form-control with-icon ${formStep3.formState.errors.newPassword ? 'input-error' : ''}`}
                  placeholder="At least 8 chars (A-Z, a-z, 0-9, @#$)"
                  {...formStep3.register('newPassword')}
                  style={{ paddingRight: '42px' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4px' }}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <FaEyeSlash size={17} /> : <FaEye size={17} />}
                </button>
              </div>
              {formStep3.formState.errors.newPassword && (
                <span style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '4px', display: 'block' }}>
                  {formStep3.formState.errors.newPassword.message}
                </span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm New Password</label>
              <div className="input-icon-wrapper" style={{ position: 'relative' }}>
                <MdLock className="input-icon" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  className={`form-control with-icon ${formStep3.formState.errors.confirmPassword ? 'input-error' : ''}`}
                  placeholder="Re-enter new password"
                  {...formStep3.register('confirmPassword')}
                  style={{ paddingRight: '42px' }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4px' }}
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? <FaEyeSlash size={17} /> : <FaEye size={17} />}
                </button>
              </div>
              {formStep3.formState.errors.confirmPassword && (
                <span style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '4px', display: 'block' }}>
                  {formStep3.formState.errors.confirmPassword.message}
                </span>
              )}
            </div>

            <button type="submit" className="btn btn-primary w-100 mt-4" disabled={loading}>
              {loading ? 'Resetting Password...' : 'Reset Password'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
