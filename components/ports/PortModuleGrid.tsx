import type { DashboardModuleId, PortSnapshot } from "@/lib/types/domain";

const wideModules = new Set<DashboardModuleId>(["heatmap", "cameras", "video_flow"]);
import { AdZone } from "@/components/modules/AdZone";
import { AlertsPanel } from "@/components/modules/AlertsPanel";
import { ApproachCongestionPanel } from "@/components/modules/ApproachCongestionPanel";
import { BestTimeToCrossPanel } from "@/components/modules/BestTimeToCrossPanel";
import { CameraPanel } from "@/components/modules/CameraPanel";
import { CommercialCrossingPanel } from "@/components/modules/CommercialCrossingPanel";
import { HourlyRhythmHeatmap } from "@/components/modules/HourlyRhythmHeatmap";
import { OfficialWaitCard } from "@/components/modules/OfficialWaitCard";
import { OpenLanesCard } from "@/components/modules/OpenLanesCard";
import { PredictedWaitCard } from "@/components/modules/PredictedWaitCard";
import { QueueEstimatePanel } from "@/components/modules/QueueEstimatePanel";
import { TrendCard } from "@/components/modules/TrendCard";
import { VideoFlowAnalysisPanel } from "@/components/modules/VideoFlowAnalysisPanel";

function Module({ id, snap }: { id: DashboardModuleId; snap: PortSnapshot }) {
  switch (id) {
    case "alerts":
      return <AlertsPanel alerts={snap.alerts} />;
    case "official_wait":
      return <OfficialWaitCard waits={snap.waits} />;
    case "predicted_wait":
      return <PredictedWaitCard waits={snap.waits} />;
    case "open_lanes":
      return <OpenLanesCard waits={snap.waits} />;
    case "trend":
      return <TrendCard points={snap.trend} />;
    case "heatmap":
      return <HourlyRhythmHeatmap cells={snap.hourly} />;
    case "best_time":
      return <BestTimeToCrossPanel windows={snap.bestWindows} />;
    case "queue":
      return <QueueEstimatePanel rows={snap.queue} />;
    case "approach":
      return <ApproachCongestionPanel segments={snap.approach} />;
    case "video_flow":
      return <VideoFlowAnalysisPanel segments={snap.videoFlow} />;
    case "cameras":
      return <CameraPanel cameras={snap.cameras} />;
    case "commercial":
      return <CommercialCrossingPanel commercial={snap.commercial} />;
    case "ads_rail":
      return <AdZone slot="rail" />;
    case "ads_footer":
      return <AdZone slot="footer" />;
    default:
      return null;
  }
}

export function PortModuleGrid({ snap }: { snap: PortSnapshot }) {
  const order = snap.layout.moduleOrder;
  const main = order.filter((m) => m !== "ads_rail");
  const hasRail = order.includes("ads_rail");

  return (
    <div className={`grid gap-2 ${hasRail ? "xl:grid-cols-12" : ""}`}>
      {hasRail ? (
        <aside className="hidden xl:col-span-2 xl:block">
          <Module id="ads_rail" snap={snap} />
        </aside>
      ) : null}
      <div className={hasRail ? "xl:col-span-10" : ""}>
        <div className="grid grid-cols-1 gap-2 lg:grid-cols-2">
          {main.map((id) => (
            <div key={id} className={wideModules.has(id) ? "lg:col-span-2" : undefined}>
              <Module id={id} snap={snap} />
            </div>
          ))}
        </div>
        {hasRail ? (
          <div className="mt-2 xl:hidden">
            <Module id="ads_rail" snap={snap} />
          </div>
        ) : null}
      </div>
    </div>
  );
}
