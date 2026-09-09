import { z } from "zod";
import { useMemo, useState } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Mail, Plus, X } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

export type MemberRole = "admin" | "member";

type MemberFormData = {
  email: string;
  role: MemberRole;
};

interface Member {
  email: string;
  role: MemberRole;
}

interface MembersTableProps {
  members: Member[];
  onAddMember: (email: string, role: MemberRole) => void;
  onRemoveMember: (email: string) => void;
  ownerEmail: string;
}

export const MembersTable = ({
  members,
  onAddMember,
  onRemoveMember,
  ownerEmail,
}: MembersTableProps) => {
  const { t } = useTranslation("onboarding");
  const [isOpen, setIsOpen] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [newMemberForm, setNewMemberForm] = useState<MemberFormData>({
    email: "",
    role: "member",
  });

  const memberSchema = useMemo(
    () =>
      z.object({
        email: z
          .string()
          .min(1, t("members.emailRequired"))
          .email(t("members.emailInvalid")),
        role: z.enum(["member", "admin"] as const),
      }),
    [t],
  );

  const columns = useMemo<ColumnDef<Member>[]>(
    () => [
      {
        accessorKey: "email",
        header: t("members.user"),
        cell: ({ row }) => {
          const email = row.original.email;
          return (
            <div className="flex items-center gap-2.5">
              <span>{email}</span>
              {email === ownerEmail ? (
                <div className="rounded bg-[hsl(var(--muted))] px-1.5">
                  <span className="text-xs font-medium text-[hsl(var(--foreground))]">
                    {t("members.you")}
                  </span>
                </div>
              ) : (
                <Badge variant="helicone-sky">{t("members.invited")}</Badge>
              )}
            </div>
          );
        },
      },
      {
        accessorKey: "role",
        header: t("members.role"),
        cell: ({ row }) => (
          <span className="capitalize">{row.original.role}</span>
        ),
      },
      {
        id: "actions",
        header: "",
        cell: ({ row }) => {
          const email = row.original.email;
          if (email === ownerEmail) return null;
          return (
            <div className="flex justify-end">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onRemoveMember(email)}
              >
                <X className="h-4 w-4 text-[hsl(var(--muted-foreground))]" />
              </Button>
            </div>
          );
        },
      },
    ],
    [ownerEmail, onRemoveMember, t],
  );

  const tableData = useMemo(
    () => [{ email: ownerEmail, role: "owner" as MemberRole }, ...members],
    [members, ownerEmail],
  );

  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const validateForm = (data: MemberFormData): boolean => {
    try {
      memberSchema.parse(data);
      if (data.email === ownerEmail) {
        setEmailError(t("members.emailIsOwner"));
        return false;
      }
      if (members.some((m) => m.email === data.email)) {
        setEmailError(t("members.emailAlreadyInvited"));
        return false;
      }
      setEmailError("");
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const emailError = error.errors.find((e) => e.path[0] === "email");
        if (emailError) {
          setEmailError(emailError.message);
        }
      }
      return false;
    }
  };

  const handleInvite = () => {
    const isValid = validateForm(newMemberForm);
    const isDuplicate = members.some((m) => m.email === newMemberForm.email);

    if (!isValid || isDuplicate) {
      if (isDuplicate) {
        setEmailError(t("members.emailAlreadyInvited"));
      }
      return;
    }

    onAddMember(newMemberForm.email, newMemberForm.role);
    setNewMemberForm({ email: "", role: "member" });
    setEmailError("");
    setIsOpen(false);
  };

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium text-[hsl(var(--foreground))]">
          {t("members.title")}
        </h2>
        <Button variant="outline" size="xs" onClick={() => setIsOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          {t("members.invite")}
        </Button>
      </div>

      <div className="rounded-md border border-[hsl(var(--border))]">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} className="border-none">
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-[hsl(var(--muted-foreground))]"
                >
                  {t("members.noMembers")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="w-62 gap-2 p-6">
          <div className="flex flex-col gap-4">
            <DialogHeader>
              <DialogTitle className="text-lg font-semibold text-[hsl(var(--foreground))]">
                {t("members.inviteTitle")}
              </DialogTitle>
              <DialogDescription className="text-sm text-[hsl(var(--muted-foreground))]">
                {t("members.inviteDescription")}
              </DialogDescription>
            </DialogHeader>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label className="w-20 text-sm font-normal text-[hsl(var(--foreground))]">
                  {t("members.email")}
                </label>
                <div className="flex flex-1 flex-col gap-1">
                  <Input
                    type="email"
                    value={newMemberForm.email}
                    onChange={(e) => {
                      setNewMemberForm((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }));
                    }}
                    className={cn(
                      "flex-1",
                      emailError &&
                        "border-[hsl(var(--destructive))] focus-visible:ring-[hsl(var(--destructive))]",
                    )}
                    placeholder={t("members.emailPlaceholder")}
                  />
                  {emailError && (
                    <span className="text-xs text-[hsl(var(--destructive))]">
                      {emailError}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="w-20 text-sm font-normal text-[hsl(var(--foreground))]">
                  {t("members.role")}
                </label>
                <Select
                  value={newMemberForm.role}
                  onValueChange={(value: MemberRole) =>
                    setNewMemberForm((prev) => ({ ...prev, role: value }))
                  }
                >
                  <SelectTrigger className="flex-1 text-sm">
                    <SelectValue placeholder={t("members.selectRole")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="member">{t("members.member")}</SelectItem>
                    <SelectItem value="admin">{t("members.admin")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="mt-2 flex justify-end gap-2">
              <Button
                variant="default"
                onClick={handleInvite}
                disabled={!newMemberForm.email}
              >
                <Mail className="mr-2 h-4 w-4" />
                {t("members.sendInvitation")}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export const memberSchema = z.object({
  email: z.string().min(1).email(),
  role: z.enum(["member", "admin"] as const),
});
