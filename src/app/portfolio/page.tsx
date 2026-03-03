import { PageHeader } from "@/components/layout/page-header";
import { PortfolioStats } from "@/components/portfolio/portfolio-stats";
import { ProjectCard } from "@/components/portfolio/project-card";
import { projects } from "@/data/projects";

export default function PortfolioPage() {
  return (
    <>
      <PageHeader
        title="Portfolio"
        description="Overview of all solar PV and BESS projects"
      />
      <PortfolioStats />
      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </>
  );
}
