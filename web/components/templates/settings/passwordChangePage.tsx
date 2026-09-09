import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { H2, P } from "@/components/ui/typography";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Lock } from "lucide-react";
import { useHeliconeAuthClient } from "@/packages/common/auth/client/AuthClientFactory";
import { useTranslation } from "react-i18next";

const PasswordChangePage = () => {
  const { t } = useTranslation(["settings", "common"]);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const authClient = useHeliconeAuthClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");
    setSuccess(false);

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError(t("settings:password.errors.allFieldsRequired"));
      return;
    }

    if (newPassword !== confirmPassword) {
      setError(t("settings:password.errors.passwordMismatch"));
      return;
    }

    if (newPassword.length < 8) {
      setError(t("settings:password.errors.passwordTooShort"));
      return;
    }

    setIsLoading(true);

    try {
      const result = await authClient.changePassword({
        currentPassword,
        newPassword,
      });
      if (result.error) {
        setError(result.error);
        return;
      }
      setSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(t("settings:password.errors.changeFailed"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 p-8">
      <div>
        <H2>{t("settings:password.title")}</H2>
        <P className="text-muted-foreground">
          {t("settings:password.subtitle")}
        </P>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-4 w-4" />
            {t("settings:password.cardTitle")}
          </CardTitle>
          <CardDescription>{t("settings:password.cardDescription")}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current-password">
                {t("settings:password.currentPassword")}
              </Label>
              <Input
                id="current-password"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder={t("settings:password.currentPasswordPlaceholder")}
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="new-password">
                {t("settings:password.newPassword")}
              </Label>
              <Input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder={t("settings:password.newPasswordPlaceholder")}
                disabled={isLoading}
              />
              <p className="text-xs text-muted-foreground">
                {t("settings:password.passwordHint")}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm-password">
                {t("settings:password.confirmPassword")}
              </Label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder={t("settings:password.confirmPasswordPlaceholder")}
                disabled={isLoading}
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="border-green-500 bg-green-50 dark:bg-green-950/20">
                <AlertDescription className="text-green-600 dark:text-green-400">
                  {t("settings:password.success")}
                </AlertDescription>
              </Alert>
            )}

            <div className="flex justify-end gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setCurrentPassword("");
                  setNewPassword("");
                  setConfirmPassword("");
                  setError("");
                  setSuccess(false);
                }}
                disabled={isLoading}
              >
                {t("common:actions.cancel")}
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading
                  ? t("settings:password.changing")
                  : t("settings:password.changePassword")}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default PasswordChangePage;
