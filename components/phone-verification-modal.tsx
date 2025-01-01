import { useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import axios from 'axios';
import { useAuth } from '@/lib/auth-context';
import { useLanguage } from '@/lib/language-context';
import { PhoneIcon, KeyIcon, ArrowLeftIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PhoneVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerificationComplete?: (phone: string, userData: any) => void;
}

export function PhoneVerificationModal({
  isOpen,
  onClose,
  onVerificationComplete,
}: PhoneVerificationModalProps) {
  const { t } = useLanguage();
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState<'phone' | 'code'>('phone');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timer, setTimer] = useState(0);
  const { setUser } = useAuth();

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length === 0) return '';
    if (numbers.length <= 1) return `+7 (${numbers}`;
    if (numbers.length <= 4) return `+7 (${numbers.slice(1, 4)}`;
    if (numbers.length <= 7) return `+7 (${numbers.slice(1, 4)}) ${numbers.slice(4, 7)}`;
    if (numbers.length <= 9) return `+7 (${numbers.slice(1, 4)}) ${numbers.slice(4, 7)}-${numbers.slice(7, 9)}`;
    return `+7 (${numbers.slice(1, 4)}) ${numbers.slice(4, 7)}-${numbers.slice(7, 9)}-${numbers.slice(9, 11)}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value);
    setPhone(formatted);
    setError(null);
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 4);
    setCode(value);
    setError(null);
  };

  async function sendCode(phone: string) {
    try {
      const response = await axios.post('https://cry-com.ru/api/v1/user/authenticate/sendCode', { phone });
      setTimer(60); // Устанавливаем таймер на 60 секунд
      return response.data;
    } catch (error) {
      console.error('Error sending code:', error);
      throw error;
    }
  }

  async function checkCode(code: string) {
    try {
      const response = await axios.post('https://cry-com.ru/api/v1/user/authenticate/checkCode', { code });
      const { token } = response.data;

      const userResponse = await axios.get('https://cry-com.ru/api/v1/user', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const userData = userResponse.data.user;
      localStorage.setItem('token', token);

      return { token, userData };
    } catch (error) {
      console.error('Error checking code:', error);
      throw error;
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (step === 'phone') {
        if (phone.length < 18) { // +7 (999) 999-99-99
          throw new Error(t('invalidPhoneNumber'));
        }
        await sendCode(phone);
        setStep('code');
      } else {
        if (code.length !== 4) {
          throw new Error(t('invalidCode'));
        }
        const { token, userData } = await checkCode(code);
        setUser(userData);

        if (onVerificationComplete) {
          onVerificationComplete(phone, userData);
        }

        // Reset the form state
        setPhone('');
        setCode('');
        setStep('phone');
        onClose();
      }
    } catch (error) {
      console.error('Error:', error);
      setError(error instanceof Error ? error.message : t('unknownError'));
    } finally {
      setIsLoading(false);
    }
  }

  const handleBack = () => {
    setStep('phone');
    setError(null);
    setCode('');
  };

  useEffect(() => {
    if (!isOpen) {
      setPhone('');
      setCode('');
      setStep('phone');
      setError(null);
    }
  }, [isOpen]);

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div className="relative">
                  {step === 'code' && (
                    <button
                      onClick={handleBack}
                      className="absolute left-0 top-0 p-2 text-gray-500 hover:text-gray-700 transition-colors"
                      aria-label={t('back')}
                    >
                      <ArrowLeftIcon className="h-5 w-5" />
                    </button>
                  )}
                  <Dialog.Title className="text-lg font-medium text-center mb-4">
                    {t('phoneVerification')}
                  </Dialog.Title>
                </div>

                <form onSubmit={handleSubmit} className="mt-4">
                  <div className="space-y-4">
                    {step === 'phone' ? (
                      <div className="space-y-2">
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                          {t('enterPhoneNumber')}
                        </label>
                        <div className="relative">
                          <PhoneIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <input
                            type="tel"
                            id="phone"
                            value={phone}
                            onChange={handlePhoneChange}
                            className={cn(
                              "pl-10 block w-full rounded-lg border shadow-sm py-2.5 text-gray-900 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 transition-all duration-200",
                              error ? "border-red-300 focus:ring-red-500" : "border-gray-300 focus:ring-primary"
                            )}
                            placeholder="+7 (999) 999-99-99"
                            required
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <label htmlFor="code" className="block text-sm font-medium text-gray-700">
                          {t('enterSmsCode')}
                        </label>
                        <div className="relative">
                          <KeyIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <input
                            type="text"
                            id="code"
                            value={code}
                            onChange={handleCodeChange}
                            className={cn(
                              "pl-10 block w-full rounded-lg border shadow-sm py-2.5 text-gray-900 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 tracking-widest font-mono transition-all duration-200",
                              error ? "border-red-300 focus:ring-red-500" : "border-gray-300 focus:ring-primary"
                            )}
                            placeholder="0000"
                            required
                            maxLength={4}
                          />
                        </div>
                        {timer > 0 && (
                          <p className="text-sm text-gray-500 text-center">
                            {t('resendCodeIn', { seconds: timer })}
                          </p>
                        )}
                      </div>
                    )}

                    {error && (
                      <p className="text-sm text-red-600 mt-2">
                        {error}
                      </p>
                    )}

                    <button
                      type="submit"
                      className={cn(
                        "w-full flex justify-center items-center rounded-lg px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors",
                        isLoading ? 'bg-gray-400 cursor-not-allowed' :
                          ((step === 'phone' && phone.length === 18) || (step === 'code' && code.length === 4))
                            ? 'bg-indigo-500 hover:bg-indigo-600'
                            : 'bg-gray-400'
                      )}
                      disabled={isLoading || (step === 'phone' ? phone.length < 18 : code.length !== 4) || (step === 'code' && timer === 0)}
                    >
                      {isLoading ? (
                        <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                      ) : null}
                      {step === 'phone'
                        ? (isLoading ? t('sending') : t('sendCode'))
                        : (isLoading ? t('verifying') : t('verifyCode'))
                      }
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
