// import { Button } from "@/components/ui/button"
// import { Save } from "lucide-react"

// export function SettingsHeader() {
//   return (
//     <div className="flex items-center justify-between">
//       <div>
//         <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
//         <p className="text-gray-600 mt-1">Manage your system preferences and configuration</p>
//       </div>

//       <Button>
//         <Save className="h-4 w-4 mr-2" />
//         Save Changes
//       </Button>
//     </div>
//   )
// }

import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";

interface SettingsHeaderProps {
  onSave: () => void; // Callback to trigger saving settings
  isSaving?: boolean; // Optional: to show loading state
}

export function SettingsHeader({ onSave, isSaving = false }: SettingsHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">Manage your system preferences and configuration</p>
      </div>
      <Button onClick={onSave} disabled={isSaving}>
        <Save className="h-4 w-4 mr-2" />
        {isSaving ? "Saving..." : "Save Changes"}
      </Button>
    </div>
  );
}
