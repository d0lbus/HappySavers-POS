// src/components/dashboard/KpiCard.jsx
import Card, { CardBody } from "../common/Card";

const ACCENTS = {
  sky: {
    bgSoft: "bg-sky-50",
    iconBg: "bg-sky-100",
    iconColor: "text-sky-600",
    border: "border-sky-100",
  },
  emerald: {
    bgSoft: "bg-emerald-50",
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-600",
    border: "border-emerald-100",
  },
  amber: {
    bgSoft: "bg-amber-50",
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
    border: "border-amber-100",
  },
  violet: {
    bgSoft: "bg-violet-50",
    iconBg: "bg-violet-100",
    iconColor: "text-violet-600",
    border: "border-violet-100",
  },
};

export default function KpiCard({ label, value, icon: Icon, accent = "sky" }) {
  const styles = ACCENTS[accent] || ACCENTS.sky;

  return (
    <Card
      className={`relative overflow-hidden ${styles.bgSoft} ${styles.border}`}
    >
      <CardBody className="px-4 py-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-wide text-slate-500">
              {label}
            </p>
            <p className="text-xl font-semibold text-slate-900 mt-1">{value}</p>
          </div>

          <div
            className={`h-9 w-9 rounded-full flex items-center justify-center ${styles.iconBg}`}
          >
            <Icon className={`h-5 w-5 ${styles.iconColor}`} />
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
