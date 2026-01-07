import { useLocation, Link } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";
import { Fragment } from "react";

export const PageBreadcrumb = () => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  return (
    <nav className="flex items-center text-sm text-muted-foreground mb-4 animate-in fade-in slide-in-from-left-2 duration-300">
      <Link to="/" className="hover:text-primary transition-colors flex items-center gap-1">
        <Home className="h-4 w-4" />
      </Link>
      
      {pathnames.length > 0 && <ChevronRight className="h-4 w-4 mx-2" />}
      
      {pathnames.map((value, index) => {
        const to = `/${pathnames.slice(0, index + 1).join("/")}`;
        const isLast = index === pathnames.length - 1;
        
        // Format nama path: "data-jemaat" -> "Data Jemaat"
        const title = value.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

        return (
          <span key={to} className="flex items-center">
            {isLast ? (
              <span className="font-medium text-foreground">{title}</span>
            ) : (
              <Link to={to} className="hover:text-primary transition-colors">
                {title}
              </Link>
            )}
            {!isLast && <ChevronRight className="h-4 w-4 mx-2" />}
          </span>
        );
      })}
    </nav>
  );
};