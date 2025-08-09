import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronRight, ArrowLeft } from "lucide-react";
import type { BreadcrumbsProps } from "@/types/type";
import { Button } from "@/components/ui/button";

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  items,
  showBackButton = true,
}) => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };
  return (
    <div className="flex justify-between items-center w-full">
      <nav aria-label="breadcrumb">
        <ol className="flex items-center space-x-2 text-sm text-muted-foreground">
          {items.map((item, index) => (
            <li key={item.href} className="flex items-center">
              {index > 0 && <ChevronRight className="h-4 w-4 mx-2" />}
              {index === items.length - 1 ? (
                <span className="font-semibold text-foreground text-amber-500 text-lg">
                  {item.label}
                </span>
              ) : (
                <Link
                  to={item.href}
                  className="hover:text-amber-600 hover:underline text-lg"
                >
                  {item.label}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
      {showBackButton && (
        <Button variant="outline" size="sm" onClick={handleGoBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
      )}
    </div>
  );
};

export default Breadcrumbs;
