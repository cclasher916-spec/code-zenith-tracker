import { TeamInfoSection } from "@/components/profile/TeamInfoSection";

export default function ProfileTeams() {
    return (
        <div className="space-y-6 max-w-5xl mx-auto pb-10">
            <h1 className="text-3xl font-bold">My Teams</h1>
            <TeamInfoSection />
        </div>
    );
}
