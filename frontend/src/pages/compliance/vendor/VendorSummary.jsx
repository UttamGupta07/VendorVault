import React from "react";
import {
  Users,
  CheckCircle2,
  Clock3,
  AlertTriangle,
} from "lucide-react";

const VendorSummary = () => {
  const cards = [
    {
      title: "Total Vendors",
      value: "128",
      change: "+8 this month",
      icon: Users,
    },
    {
      title: "Compliant",
      value: "94",
      change: "73.4% of vendors",
      icon: CheckCircle2,
    },
    {
      title: "Pending Review",
      value: "18",
      change: "Needs attention",
      icon: Clock3,
    },
    {
      title: "At Risk",
      value: "16",
      change: "Requires action",
      icon: AlertTriangle,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.title}
            className="
              rounded-2xl
              border
              border-slate-200
              bg-white
              p-5
            "
          >
            <div className="flex items-start justify-between">

              <div>
                <p className="text-sm font-medium text-slate-500">
                  {card.title}
                </p>

                <h2 className="mt-2 text-2xl font-bold text-slate-900">
                  {card.value}
                </h2>
              </div>

              <div className="rounded-xl bg-indigo-50 p-2.5">
                <Icon
                  size={20}
                  className="text-indigo-600"
                />
              </div>

            </div>

            <p className="mt-3 text-xs text-slate-400">
              {card.change}
            </p>

          </div>
        );
      })}

    </div>
  );
};

export default VendorSummary;