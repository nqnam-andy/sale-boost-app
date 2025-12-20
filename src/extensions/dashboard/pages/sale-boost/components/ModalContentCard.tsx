import type { FC } from "react";
import {
  Box,
  Card,
  Dropdown,
  FormField,
  Input,
  InputArea,
} from "@wix/design-system";
import { useSaleBoost } from "../context/SaleBoostContext";
import type { SaleBoostConfig } from "../../../../../shared/saleBoostConfig";

export const ModalContentCard: FC = () => {
  const { config, updateConfig } = useSaleBoost();

  return (
    <Card>
      <Card.Header title="Modal content" />
      <Card.Content>
        <Box direction="vertical" gap="18px">
          <FormField label="Header">
            <Input
              value={config.header}
              onChange={(e) => updateConfig({ header: e.target.value })}
            />
          </FormField>

          <FormField label="Body">
            <InputArea
              value={config.body}
              rows={4}
              autoGrow
              onChange={(e) => updateConfig({ body: e.target.value })}
            />
          </FormField>

          <FormField label="Button label">
            <Input
              value={config.buttonLabel}
              onChange={(e) => updateConfig({ buttonLabel: e.target.value })}
            />
          </FormField>

          <FormField label="Button link (URL)">
            <Input
              value={config.link}
              onChange={(e) => updateConfig({ link: e.target.value })}
            />
          </FormField>

          <FormField label="Action">
            <Dropdown
              selectedId={config.action}
              options={[
                { id: "NEW_TAB", value: "Open in new tab" },
                { id: "SAME_TAB", value: "Open in same tab" },
              ]}
              onSelect={(option) =>
                updateConfig({
                  action: option.id as SaleBoostConfig["action"],
                })
              }
            />
          </FormField>
        </Box>
      </Card.Content>
    </Card>
  );
};

