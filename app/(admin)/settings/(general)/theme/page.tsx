import {Separator} from "@/components/ui/separator";
import {ThemeSettingsForm} from "@/app/(admin)/settings/(general)/theme/theme-settings-form";
import {ThemeCustomizer} from "@/components/lib/theme-customizer";
import {ThemeWrapper} from "@/components/lib/theme-wrapper";


export default function SettingsNotificationsPage() {
  return (
    <div className="space-y-6">
      <div>
          <h3 className="text-xl text-primary font-heading font-bold ">Theme Options</h3>
        <p className="text-sm text-muted-foreground">
            Pick theme to personalize experience.
        </p>
      </div>
      <Separator />
      <ThemeSettingsForm/>

    </div>
  )
}
