import { Card, CardContent } from "@/components/ui/card";
import { useListPlans, useGetStats } from "@workspace/api-client-react";
import { Link, useLocation } from "wouter";
import {
  IndianRupee,
  Users,
  MapPin,
  Sparkles,
  Plus,
  BarChart3
} from "lucide-react";

export default function Dashboard() {
  const [, setLocation] = useLocation();

  const { data: recentPlans, isLoading: isLoadingPlans } = useListPlans();
  const { data: stats } = useGetStats();

  // Get latest event type dynamically
  const latestEventType =
    recentPlans?.[0]?.eventType?.toLowerCase() || "";

  return (
    <div className="py-12 px-6 max-w-7xl mx-auto space-y-16">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-6">

        <div>
          <h1 className="text-5xl font-bold mb-2">
            Plan Archive
          </h1>

          <p className="text-gray-500 text-lg">
            Your AI Generated Event Plans
          </p>
        </div>

        <Link href="/setup">
          <button className="bg-black text-white px-6 py-3 rounded-xl flex items-center gap-2 hover:opacity-90 transition">
            <Plus className="w-5 h-5" />
            Create New Plan
          </button>
        </Link>

      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

        <Card className="rounded-2xl shadow-lg border-none">
          <CardContent className="p-8">

            <div className="flex justify-between items-center mb-4">
              <Sparkles className="w-8 h-8 text-purple-500" />

              <span className="text-sm text-gray-400 uppercase">
                Total Plans
              </span>
            </div>

            <div className="text-4xl font-bold">
              {stats?.totalPlans ?? 0}
            </div>

            <div className="text-gray-500 mt-2">
              Plans Generated
            </div>

          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-lg border-none">
          <CardContent className="p-8">

            <div className="flex justify-between items-center mb-4">
              <IndianRupee className="w-8 h-8 text-green-500" />

              <span className="text-sm text-gray-400 uppercase">
                Budget
              </span>
            </div>

            <div className="text-4xl font-bold">
              ₹{(stats?.totalBudgetPlanned ?? 0).toLocaleString()}
            </div>

            <div className="text-gray-500 mt-2">
              Total Budget Planned
            </div>

          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-lg border-none">
          <CardContent className="p-8">

            <div className="flex justify-between items-center mb-4">
              <Users className="w-8 h-8 text-blue-500" />

              <span className="text-sm text-gray-400 uppercase">
                Guests
              </span>
            </div>

            <div className="text-4xl font-bold">
              {stats?.totalGuestsPlanned ?? 0}
            </div>

            <div className="text-gray-500 mt-2">
              Total Guests Managed
            </div>

          </CardContent>
        </Card>

      </div>

      {/* MAIN CONTENT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

        {/* LEFT */}
        <div className="lg:col-span-8 space-y-8">

          <div className="flex items-center gap-3">
            <BarChart3 className="w-5 h-5 text-purple-500" />

            <h2 className="text-2xl font-bold capitalize">
              {latestEventType || "Recent"} Plans
            </h2>
          </div>

          {isLoadingPlans ? (

            <div className="text-center py-10">
              Loading Plans...
            </div>

          ) : recentPlans && recentPlans.length > 0 ? (

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

              {recentPlans
                .filter(
                  (plan: any) =>
                    plan.eventType?.toLowerCase() === latestEventType
                )
                .map((plan: any) => (

                  <Card
                    key={plan.id}
                    className="rounded-2xl overflow-hidden shadow-xl cursor-pointer hover:scale-[1.02] transition duration-300"
                    onClick={() => setLocation(`/plan/${plan.id}`)}
                  >

                    {/* TOP */}
                    <div className="h-44 bg-gray-100 p-8 flex flex-col justify-end relative overflow-hidden">

                      <div className="absolute -right-6 -top-6 opacity-10 text-[10rem] font-bold">
                        {plan.eventType?.charAt(0) || "E"}
                      </div>

                      <div className="relative z-10">

                        <span className="text-xs uppercase tracking-widest text-purple-600 font-bold block mb-2">
                          {plan.eventType || "Unknown Event"}
                        </span>

                        <h3 className="text-3xl font-bold">
                          {plan.eventTitle || "Untitled Event"}
                        </h3>

                      </div>

                    </div>

                    {/* CONTENT */}
                    <CardContent className="p-8">

                      <div className="space-y-4 text-sm">

                        <div className="flex items-center justify-between border-b pb-3">

                          <span className="flex items-center gap-2 text-gray-500">
                            <MapPin className="w-4 h-4" />
                            Location
                          </span>

                          <span>
                            {plan.city || "Unknown City"}
                          </span>

                        </div>

                        <div className="flex items-center justify-between border-b pb-3">

                          <span className="flex items-center gap-2 text-gray-500">
                            <Users className="w-4 h-4" />
                            Guests
                          </span>

                          <span>
                            {plan.guests || 0}
                          </span>

                        </div>

                        <div className="flex items-center justify-between pt-1">

                          <span className="flex items-center gap-2 text-gray-500">
                            <IndianRupee className="w-4 h-4" />
                            Budget
                          </span>

                          <span className="text-lg font-bold">
                            ₹{(plan.budget || 0).toLocaleString()}
                          </span>

                        </div>

                      </div>

                    </CardContent>

                  </Card>

                ))}

            </div>

          ) : (

            <div className="text-center py-24 border rounded-2xl">

              <p className="text-gray-400 text-xl mb-6">
                No Plans Found
              </p>

            </div>

          )}

        </div>

        {/* RIGHT */}
        <div className="lg:col-span-4 space-y-8">

          <div className="flex items-center gap-3">

            <Sparkles className="w-5 h-5 text-pink-500" />

            <h2 className="text-2xl font-bold">
              Analytics
            </h2>

          </div>

          <Card className="rounded-2xl shadow-xl border-none">

            <CardContent className="p-8">

              {/* TOP CITIES */}
              <h3 className="font-bold mb-6 text-gray-500 uppercase text-sm">
                Top Cities
              </h3>

              <div className="space-y-5">

                {stats?.topCities?.map((c: any, i: number) => (

                  <div
                    key={i}
                    className="flex justify-between items-center"
                  >

                    <div className="flex items-center gap-3">

                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm font-bold">
                        {i + 1}
                      </div>

                      <span>{c.city}</span>

                    </div>

                    <span className="text-gray-400">
                      {c.count} plans
                    </span>

                  </div>

                ))}

              </div>

              <hr className="my-8" />

              {/* EVENT TYPES */}
              <h3 className="font-bold mb-6 text-gray-500 uppercase text-sm">
                Event Types
              </h3>

              <div className="space-y-5">

                {stats?.topEventTypes?.map((t: any, i: number) => (

                  <div key={i}>

                    <div className="flex justify-between mb-2">

                      <span className="capitalize">
                        {t.eventType || "Unknown"}
                      </span>

                      <span className="font-bold">
                        {t.count}
                      </span>

                    </div>

                    <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">

                      <div
                        className="bg-purple-500 h-full"
                        style={{
                          width: `${(t.count / (stats?.totalPlans || 1)) * 100}%`
                        }}
                      />

                    </div>

                  </div>

                ))}

              </div>

            </CardContent>

          </Card>

        </div>

      </div>

    </div>
  );
}