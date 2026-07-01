import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { StatusDot, type StatusDotVariant } from './ui/status-dot';

interface ConnectionDetailsProps {
  session?: {
    id: string;
    name: string;
    protocol: string;
    host?: string;
    username?: string;
    port?: number;
    status: 'connected' | 'connecting' | 'disconnected' | 'pending';
  };
}

export function ConnectionDetails({ session }: ConnectionDetailsProps) {
  const { t } = useTranslation();
  if (!session) {
    return (
      <Card className="w-80">
        <CardHeader>
          <CardTitle className="text-sm">{t('connectionDetails.title')}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{t('connectionDetails.noSession')}</p>
        </CardContent>
      </Card>
    );
  }

  const getStatusVariant = (status: string): StatusDotVariant => {
    switch (status) {
      case 'connected': return 'connected';
      case 'connecting': return 'connecting';
      case 'pending': return 'pending';
      default: return 'disconnected';
    }
  };

  return (
    <Card className="w-80">
      <CardHeader>
        <CardTitle className="text-sm">{t('connectionDetails.title')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">{t('connectionDetails.name')}</span>
            <span className="text-sm">{session.name}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">{t('connectionDetails.type')}</span>
            <Badge variant="outline">{session.protocol}</Badge>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">{t('connectionDetails.status')}</span>
            <div className="flex items-center gap-2">
              <StatusDot variant={getStatusVariant(session.status)} />
              <span className="text-sm capitalize">{t(`connectionDetails.${session.status}`)}</span>
            </div>
          </div>
        </div>
        
        {session.host && (
          <>
            <Separator />
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{t('connectionDetails.host')}</span>
                <span className="text-sm">{session.host}</span>
              </div>
              
              {session.username && (
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{t('connectionDetails.username')}</span>
                  <span className="text-sm">{session.username}</span>
                </div>
              )}
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{t('connectionDetails.port')}</span>
                <span className="text-sm">{session.port || (session.protocol === 'SSH' ? 22 : 23)}</span>
              </div>
            </div>
          </>
        )}
        
        <Separator />
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">{t('connectionDetails.subItems')}</span>
            <span className="text-sm">2</span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">{t('connectionDetails.protocol')}</span>
            <span className="text-sm">{session.protocol}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">{t('connectionDetails.description')}</span>
            <span className="text-sm text-muted-foreground">-</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}