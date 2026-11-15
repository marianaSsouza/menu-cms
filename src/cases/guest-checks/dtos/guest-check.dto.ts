export type GuestCheckStatus = "OPENED" | "CLOSED"

export interface GuestCheckDto {
  id: string;
  createdAt: string;
  status: GuestCheckStatus;
  spot: { id: string; name: string; active: boolean };
}