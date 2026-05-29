import { Users, Truck, Wrench } from 'lucide-react';
import { ResourceAllocation } from '../../mocks/projectMockData';

interface ResourceAllocationWidgetProps {
  resources: ResourceAllocation[];
}

export function ResourceAllocationWidget({ resources }: ResourceAllocationWidgetProps) {
  const getResourceIcon = (type: ResourceAllocation['type']) => {
    switch (type) {
      case 'HUMAN':
        return <Users className="h-4 w-4 text-indigo-500 shrink-0" />;
      case 'VEHICLE':
        return <Truck className="h-4 w-4 text-emerald-500 shrink-0" />;
      case 'EQUIPMENT':
        return <Wrench className="h-4 w-4 text-amber-500 shrink-0" />;
      default:
        return <Users className="h-4 w-4 text-zinc-400 shrink-0" />;
    }
  };

  const getRoleLabel = (role: ResourceAllocation['role']) => {
    switch (role) {
      case 'PROJECT_MANAGER':
        return 'Project Manager';
      case 'SITE_SUPERVISOR':
        return 'Site Supervisor';
      case 'DESIGN_ENGINEER':
        return 'Design Engineer';
      case 'QA_INSPECTOR':
        return 'Quality Inspector';
      case 'PROCUREMENT_OFFICER':
        return 'Procurement Coordinator';
      case 'VEHICLE':
        return 'Logistics Truck';
      case 'EQUIPMENT':
        return 'Site Machinery';
      default:
        return role;
    }
  };

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
      <div className="border-b border-zinc-150 pb-4 mb-4">
        <h3 className="text-base font-bold text-zinc-950">Resource Allocation</h3>
        <p className="text-xs text-zinc-500">Field personnel and operational assets</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {resources.length === 0 ? (
          <p className="col-span-2 text-xs text-zinc-400 italic">No resources allocated to this project.</p>
        ) : (
          resources.map((res) => (
            <div
              key={res.id}
              className="flex items-center gap-3 rounded-lg border border-zinc-150 p-3 bg-zinc-50/30"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm">
                {getResourceIcon(res.type)}
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-bold text-zinc-900 truncate">{res.name}</h4>
                <p className="text-[10px] text-zinc-400 font-semibold leading-none mt-0.5">
                  {getRoleLabel(res.role)}
                </p>
                {res.details && (
                  <p className="text-[10px] text-zinc-500 truncate mt-1">
                    {res.details}
                  </p>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
