import { PrivacyControlsSection } from "@/components/profile/PrivacyControlsSection";

export default function ProfilePrivacy() {
    return (
        <div className="space-y-6 max-w-5xl mx-auto pb-10">
            <h1 className="text-3xl font-bold">Privacy Controls</h1>
            <PrivacyControlsSection />
        </div>
    );
}
