import type { FC } from "react";
import { Box, Button, Loader, Page } from "@wix/design-system";
import { useSaleBoost } from "../context/SaleBoostContext";

export const PageHeader: FC = () => {
  const { isDirty, saveState, isLoading, onSave, onResetDefaults } =
    useSaleBoost();

  return (
    <Page.Header
      title="Sale Boost"
      subtitle="Configure a promo modal that appears on your site."
      actionsBar={
        <Box
          width="100%"
          style={{ justifyContent: "flex-end" }}
          direction="horizontal"
          gap="12px"
          align="center"
        >
          <Button
            skin="inverted"
            priority="secondary"
            onClick={onResetDefaults}
          >
            Reset
          </Button>
          <Button
            priority="primary"
            onClick={onSave}
            disabled={!isDirty || saveState === "saving"}
          >
            {saveState === "saving" ? (
              <Box direction="horizontal" gap="6px" align="center">
                <Loader size="tiny" />
                <span>Saving…</span>
              </Box>
            ) : (
              "Save"
            )}
          </Button>
        </Box>
      }
    />
  );
};
