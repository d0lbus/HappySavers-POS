// src/components/dashboard/ModuleCard.jsx
import Card, { CardBody } from "../common/Card";
import Badge from "../common/Badge";
import Button from "../common/Button";

export default function ModuleCard({
  title,
  description,
  actionLabel,
  icon: Icon,
  pill,
  onClick,
}) {
  return (
    <Card className="hover:shadow-md hover:-translate-y-[1px] transition">
      <CardBody className="p-5">
        <div className="flex items-start gap-3 mb-4">
          <div className="h-9 w-9 rounded-full bg-slate-100 flex items-center justify-center">
            <Icon className="h-5 w-5 text-slate-700" />
          </div>

          <div className="flex-1">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-semibold text-slate-800 text-sm leading-snug">
                {title}
              </h3>

              {pill ? <Badge variant="slate">{pill}</Badge> : null}
            </div>

            <p className="text-xs text-slate-500 mt-1">{description}</p>
          </div>
        </div>

        <Button size="sm" onClick={onClick}>
          {actionLabel}
        </Button>
      </CardBody>
    </Card>
  );
}
