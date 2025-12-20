import type { FC } from "react";
import { Notification } from "@wix/design-system";
import { useSaleBoost } from "../context/SaleBoostContext";

export const Notifications: FC = () => {
  const { saveState, error } = useSaleBoost();

  return (
    <>
      {saveState === "saved" && (
        <Notification type="local" theme="success">
          Published! Your site will start showing the modal based on the
          configuration.
        </Notification>
      )}
      {saveState === "error" && (
        <Notification type="local" theme="error">
          Couldn't publish your settings. Please try again.
        </Notification>
      )}
      {error && (
        <Notification type="local" theme="warning">
          {error.message ?? "Couldn't load embedded script settings."}
        </Notification>
      )}
    </>
  );
};

