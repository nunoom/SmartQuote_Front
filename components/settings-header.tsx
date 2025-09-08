import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';

interface SettingsHeaderProps {
  onSave: () => void;
  isSaving?: boolean;
}

export function SettingsHeader({ onSave, isSaving = false }: SettingsHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Definições</h1>
        <p className="text-gray-600 dark:text-gray-300 mt-1">Gerir as preferências e configurações do sistema</p>
      </div>
      <Button
        onClick={onSave}
        disabled={isSaving}
        className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white"
      >
        <Save className="h-4 w-4 mr-2" />
        {isSaving ? 'Guardando...' : 'Guardar Alterações'}
      </Button>
    </div>
  );
}