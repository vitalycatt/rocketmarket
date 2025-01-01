'use client'

import { useState, useEffect } from 'react'
import { useLanguage, LanguageProvider } from "@/lib/language-context"
import { CartProvider } from "@/lib/cart-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { User, ShoppingBag, Bell, CreditCard, Edit, FileText, Plus } from 'lucide-react'
import { Header } from '@/components/header'
import { MobileBottomMenu } from '@/components/mobile-bottom-menu'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils";
import { useRouter, useSearchParams } from 'next/navigation'
import { PhoneVerificationModal } from '@/components/phone-verification-modal';
import { useAuth, AuthProvider } from "@/lib/auth-context";
import { getUserProfile, updateUserProfile, User as ApiUser } from '@/lib/api'
import { toast } from "sonner"
import { ContractsTab } from '@/components/contracts/ContractsTab';

function ProfileHeader() {
  const { language, setLanguage } = useLanguage();
  const { user } = useAuth();

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="relative mb-20 sm:mt-0 sm:mb-16"
    >
      <div className="h-32 sm:h-48 w-full relative">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url("/rocket-pattern.jpg")' }}
        >
          <div className="absolute inset-0 bg-black/10 backdrop-blur-[2px]"></div>
        </div>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className="absolute -bottom-12 sm:-bottom-8 w-full"
      >
        <div className="container mx-auto px-4">
          <div className="flex sm:flex-row items-center gap-4 sm:gap-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm p-6 border border-gray-100">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.4 }}
              className="flex-1 text-left space-y-2"
            >
              <h1 className="text-2xl font-semibold text-gray-900">
                {user?.name || user?.phone || 'Guest'}
              </h1>
              {user?.email && (
                <p className="text-sm text-gray-500">{user.email}</p>
              )}
              {!user?.email && user?.phone && (
                <p className="text-sm text-gray-500">{user.phone}</p>
              )}
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.6 }}
              className="flex items-center gap-3"
            >
              <Select value={language} onValueChange={(value: 'en' | 'ru') => setLanguage(value)}>
                <SelectTrigger className="h-9 text-sm w-[100px] bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ru">RU</SelectItem>
                  <SelectItem value="en">EN</SelectItem>
                </SelectContent>
              </Select>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

function Stats() {
  const { t } = useLanguage();
  const stats = [
    { label: t('orders'), value: '24', icon: ShoppingBag },
    { label: t('contracts'), value: '3', icon: FileText },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 mb-6 px-4">
      {stats.map((stat, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            delay: 0.2 * i,
            ease: [0.22, 1, 0.36, 1]
          }}
          whileHover={{
            scale: 1.02,
            transition: { duration: 0.2 }
          }}
          className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-gray-100 hover:border-gray-200 transition-all hover:shadow-sm"
        >
          <div className="flex items-center gap-3">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{
                duration: 0.5,
                delay: 0.4 * i,
                ease: [0.22, 1, 0.36, 1]
              }}
              className="p-2.5 bg-gray-50/80 rounded-lg"
            >
              <stat.icon className="h-5 w-5 text-gray-600" />
            </motion.div>
            <div>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.6 * i }}
                className="text-2xl font-semibold text-gray-900"
              >
                {stat.value}
              </motion.p>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.7 * i }}
                className="text-sm text-gray-500"
              >
                {stat.label}
              </motion.p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

function AccountTab() {
  const [userData, setUserData] = useState<ApiUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    birthday: ''
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await getUserProfile();
        setUserData(data);
        setFormData({
          name: data.name,
          email: data.email,
          phone: data.phone,
          birthday: data.dateOfBirth
        });
      } catch (error) {
        console.error('Error fetching user data:', error);
        toast.error(t('profileUpdateError'));
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [t]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const updatedUser = await updateUserProfile({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        birthday: formData.birthday
      });

      setUserData(updatedUser);
      toast.success(t('profileUpdated'));
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(t('profileUpdateError'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="text-muted-foreground">{t('loadingProfile')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center space-x-4">

            <div>
              <CardTitle>{t('personalInfo')}</CardTitle>

            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">{t('name')}</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full"
                  placeholder={t('name')}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">{t('email')}</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full"
                  placeholder="email@example.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">{t('phone')}</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full"
                  placeholder="+7 (XXX) XXX-XX-XX"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="birthday">{t('dateOfBirth')}</Label>
                <Input
                  id="birthday"
                  name="birthday"
                  type="date"
                  value={formData.birthday}
                  onChange={handleInputChange}
                  className="w-full"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                type="submit"
                className="min-w-[150px]"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-white"></div>
                    {t('updating')}
                  </>
                ) : (
                  t('saveChanges')
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

function ProfileTabs() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { t } = useLanguage();
  const tab = searchParams?.get('tab') || 'account';

  const tabs = [
    { id: 'account', label: t('profile'), icon: <User className="h-5 w-5" /> },
    { id: 'orders', label: t('orders'), icon: <ShoppingBag className="h-5 w-5" /> },
    { id: 'contracts', label: t('contracts'), icon: <FileText className="h-5 w-5" /> }
  ];

  const handleTabChange = (value: string) => {
    router.push(`/profile?tab=${value}`);
  };

  return (
    <Tabs defaultValue={tab} onValueChange={handleTabChange}>
      <div className="flex items-center justify-between">
        <TabsList className="h-auto p-1 bg-muted">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              className="data-[state=active]:bg-background flex items-center gap-2 px-4 py-2"
            >
              {tab.icon}
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>
      <div className="mt-6">
        <TabsContent value="account">
          <AccountTab />
        </TabsContent>
        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle>{t('recentOrders')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3].map((order) => (
                  <div
                    key={order}
                    className="flex items-center justify-between p-4 bg-muted/50 rounded-lg hover:bg-muted/80 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-background rounded-md">
                        <ShoppingBag className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-medium">#{1000 + order}</p>
                        <p className="text-sm text-muted-foreground">{t('processed')}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      {t('viewOrder')}
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="contracts">
          <ContractsTab />
        </TabsContent>
      </div>
    </Tabs>
  );
}

function ProfileContent() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50/50">
      <Header />
      {!user ? (
        <div className="container mx-auto px-4 py-8 flex justify-center">
          <Button onClick={() => setIsModalOpen(true)}>Login</Button>
        </div>
      ) : (
        <>
          <ProfileHeader />
          <div className="container mx-auto px-4">
            <Stats />
            <ProfileTabs />
          </div>
        </>
      )}
      <MobileBottomMenu />
      <PhoneVerificationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}

export default function ModernProfilePage() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <CartProvider>
          <ProfileContent />
        </CartProvider>
      </LanguageProvider>
    </AuthProvider>
  );
}
