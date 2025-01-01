'use client';

import { useEffect, useState } from 'react';
import { UserCompany, getUserCompanies, dissolveCompany, createCompany } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/lib/language-context';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { ShieldCloseIcon, PlusIcon } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

export function ContractsTab() {
  const [companies, setCompanies] = useState<UserCompany[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newCompanyName, setNewCompanyName] = useState('');
  const { t, language } = useLanguage();

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const data = await getUserCompanies();
        setCompanies(data);
      } catch (error) {
        console.error('Error fetching companies:', error);
        toast.error(t('failedToLoadContracts'));
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, [t]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'dd MMMM yyyy', {
      locale: language === 'ru' ? ru : undefined
    });
  };

  const getStatusTranslation = (status: any): string => {
    const statusStr = String(status || '').toLowerCase();

    switch (statusStr) {

      case '1':
        return t('status_active');
      case '2':
        return t('status_inactive');
      case '3':
        return t('status_dissolution');
      case '4':
        return t('status_dissolved');
      case '5':
        return t('status_pending');
      default:
        return t('unknown');
    }
  };

  const getStatusColor = (status: any): string => {
    const statusStr = String(status || '').toLowerCase();

    switch (statusStr) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleDissolve = async (companyId: string) => {
    try {
      const result = await dissolveCompany(companyId);
      if (result.status) {
        toast.success(t('contract_dissolved_success'));
        // Refresh the companies list
        const data = await getUserCompanies();
        setCompanies(data);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error(t('error_dissolving_contract'));
    }
  };

  const handleCreateCompany = async () => {
    if (!newCompanyName.trim()) return;

    try {
      await createCompany(newCompanyName);
      toast.success(t('companyCreated'));
      setNewCompanyName('');
      setIsDialogOpen(false);
      // Обновляем список компаний
      const data = await getUserCompanies();
      setCompanies(data);
    } catch (error) {
      console.error('Error creating company:', error);
      toast.error(t('failedToCreateCompany'));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="text-muted-foreground">{t('loadingContracts')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">{t('contracts')}</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex gap-2 bg-black hover:bg-white hover:text-black text-white rounded-2xl">
              <PlusIcon className="h-4 w-4" />
              {t('createNewContract')}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t('createNewContract')}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <Input
                placeholder={t('enterCompanyName')}
                value={newCompanyName}
                onChange={(e) => setNewCompanyName(e.target.value)}
              />
              <Button
                className="w-full bg-black hover:bg-white hover:text-black text-white rounded-2xl"
                onClick={handleCreateCompany}
              >
                {t('createNewContract')}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {companies.length === 0 ? (
        <p className="text-center text-muted-foreground">{t('noContracts')}</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {companies.map((company) => (
            <Card key={company.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl font-bold">{company.company_name} </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {t('contract_number')}: {company.number_company}
                    </p>

                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(company.status)}`}>
                    {getStatusTranslation(company.status)}
                  </span>
                </div>

              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-muted-foreground">
                    <span>{t('created')}:</span>
                    <span>{formatDate(company.created_at)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>{t('updated')}:</span>
                    <span>{formatDate(company.updated_at)}</span>
                  </div>
                </div>
                {company.status != '3' && company.status != '5' && company.status != '4' && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDissolve(company.id)}
                    className="w-fit mt-4 flex gap-2 bg-black hover:bg-white hover:text-black text-white rounded-2xl"
                  >
                    <ShieldCloseIcon className="h-4 w-4" /> {t('terminateContract')}
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
