import type { FC } from "react";
import {
  Box,
  Card,
  ColorInput,
  Divider,
  Dropdown,
  FormField,
  Input,
  NumberInput,
  ToggleSwitch,
} from "@wix/design-system";
import { useSaleBoost } from "../context/SaleBoostContext";
import type { SaleBoostConfig } from "../../../../../shared/saleBoostConfig";

export const StyleBehaviorCard: FC = () => {
  const { config, updateConfig, premiumFieldsDisabled } = useSaleBoost();

  return (
    <Card>
      <Card.Header title="Style & behavior" />
      <Card.Content>
        <Box direction="vertical" gap="18px">
          <FormField label="Text color">
            <ColorInput
              value={config.textColor}
              onChange={(color) =>
                updateConfig({
                  textColor:
                    typeof color === "string" ? color : config.textColor,
                })
              }
            />
          </FormField>

          <FormField label="Button color">
            <ColorInput
              value={config.buttonColor}
              onChange={(color) =>
                updateConfig({
                  buttonColor:
                    typeof color === "string" ? color : config.buttonColor,
                })
              }
            />
          </FormField>

          <Divider />

          <FormField label="Show close button">
            <ToggleSwitch
              checked={config.showCloseButton === "1"}
              onChange={() =>
                updateConfig({
                  showCloseButton: config.showCloseButton === "1" ? "0" : "1",
                })
              }
            />
          </FormField>

          <FormField label="Hide when clicking the backdrop">
            <ToggleSwitch
              checked={config.hideOnBackdropClick === "1"}
              onChange={() =>
                updateConfig({
                  hideOnBackdropClick:
                    config.hideOnBackdropClick === "1" ? "0" : "1",
                })
              }
            />
          </FormField>

          <Divider />

          <FormField
            label="Popup delay (seconds)"
            infoContent={
              premiumFieldsDisabled ? "Available on Medium plan." : undefined
            }
          >
            <NumberInput
              min={0}
              step={1}
              value={config.popupDelay}
              disabled={premiumFieldsDisabled}
              onChange={(value) =>
                updateConfig({ popupDelay: value == null ? 0 : value })
              }
            />
          </FormField>

          <FormField
            label="Image URL"
            infoContent={
              premiumFieldsDisabled ? "Available on Medium plan." : undefined
            }
          >
            <Input
              value={config.imageUrl}
              disabled={premiumFieldsDisabled}
              onChange={(e) => updateConfig({ imageUrl: e.target.value })}
            />
          </FormField>

          <FormField
            label="Image click URL"
            infoContent={
              premiumFieldsDisabled ? "Available on Medium plan." : undefined
            }
          >
            <Input
              value={config.imageLink}
              disabled={premiumFieldsDisabled}
              onChange={(e) => updateConfig({ imageLink: e.target.value })}
            />
          </FormField>

          <FormField
            label="Visibility"
            infoContent={
              premiumFieldsDisabled ? "Available on Medium plan." : undefined
            }
          >
            <Dropdown
              selectedId={config.visibility}
              disabled={premiumFieldsDisabled}
              options={[
                { id: "ALL", value: "All devices" },
                { id: "DESKTOP", value: "Desktop only" },
                { id: "MOBILE", value: "Mobile only" },
              ]}
              onSelect={(option) =>
                updateConfig({
                  visibility: option.id as SaleBoostConfig["visibility"],
                })
              }
            />
          </FormField>
        </Box>
      </Card.Content>
    </Card>
  );
};

