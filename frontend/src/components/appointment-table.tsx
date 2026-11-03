import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatSlot, money } from "@/lib/slots";
import type { Appointment } from "@/lib/types";

export function AppointmentTable({
  rows,
  perspective,
  busyId,
  onCancel,
  onComplete,
  onPaid,
}: {
  rows: Appointment[];
  perspective: "user" | "doctor" | "admin";
  busyId?: string | null;
  onCancel?: (id: string) => void;
  onComplete?: (id: string) => void;
  onPaid?: (id: string) => void;
}) {
  if (!rows.length) {
    return (
      <div className="rounded-2xl border border-dashed border-[#e6edf5] bg-white px-6 py-16 text-center text-sm text-ink/60">
        No appointments yet.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-[#e6edf5] bg-white shadow-[0_8px_30px_rgba(18,32,51,0.04)]">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="bg-[#f7fbfb] text-ink/55">
            <tr>
              <th className="px-4 py-3 font-medium">{perspective === "user" ? "Doctor" : "Patient"}</th>
              <th className="px-4 py-3 font-medium">When</th>
              <th className="px-4 py-3 font-medium">Fee</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium"> </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const person = perspective === "user" ? row.doctor.name : row.user.name;
              const detail = perspective === "user" ? row.doctor.speciality : row.user.email;
              const open = row.status === "booked" || row.status === "paid";
              return (
                <tr key={row.id} className="border-t border-line">
                  <td className="px-4 py-4">
                    <p className="font-medium">{person}</p>
                    <p className="text-ink/55">{detail}</p>
                  </td>
                  <td className="px-4 py-4">{formatSlot(row.slotDate, row.slotTime)}</td>
                  <td className="px-4 py-4">{money(row.amount)}</td>
                  <td className="px-4 py-4">
                    <Badge tone={row.status}>{row.status}</Badge>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex justify-end gap-2">
                      {onPaid && row.status === "booked" ? (
                        <Button size="sm" variant="outline" disabled={busyId === row.id} onClick={() => onPaid(row.id)}>
                          Mark paid
                        </Button>
                      ) : null}
                      {onComplete && open ? (
                        <Button size="sm" disabled={busyId === row.id} onClick={() => onComplete(row.id)}>
                          Complete
                        </Button>
                      ) : null}
                      {onCancel && open ? (
                        <Button size="sm" variant="danger" disabled={busyId === row.id} onClick={() => onCancel(row.id)}>
                          Cancel
                        </Button>
                      ) : null}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
