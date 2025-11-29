import { StatsSection } from "@/components/profile/StatsSection";

export default function ProfileStats() {
    return (
        <div className="space-y-6 max-w-5xl mx-auto pb-10">
            <h1 className="text-3xl font-bold">My Stats</h1>
            <StatsSection />
        </div>
    );
}
