import React from "react";
import Breadcrumbs from "../common/Breadcrumbs";
import type { BreadcrumbItem } from "@/types/type";

interface ModuleLayoutProps {
  children: React.ReactNode;
  title: string;
  breadcrumbs: BreadcrumbItem[];
}

const ModuleLayout: React.FC<ModuleLayoutProps> = ({
  children,
  title,
  breadcrumbs,
}) => {
  return (
    <div>
      <div className="mb-4">
        <Breadcrumbs items={breadcrumbs} />
      </div>

      <h1 className="text-3xl font-bold text-slate-900">{title}</h1>

      <div>{children}</div>
    </div>
  );
};

export default ModuleLayout;
