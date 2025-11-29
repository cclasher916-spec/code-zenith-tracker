import { NotificationsSection } from "@/components/profile/NotificationsSection";

export default function ProfileNotifications() {
    return (
        <div className="space-y-6 max-w-5xl mx-auto pb-10">
            <h1 className="text-3xl font-bold">Notifications</h1>
            <NotificationsSection />
        </div>
    );
}
