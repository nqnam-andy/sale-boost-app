import type { FC } from "react";
import {
  Badge,
  Box,
  Card,
  SegmentedToggle,
  Text,
} from "@wix/design-system";
import { useSaleBoost } from "../context/SaleBoostContext";
import type { Plan } from "../../../../../shared/saleBoostConfig";

export const PricingPlanCard: FC = () => {
  const { plan, setPlan, isPremium } = useSaleBoost();

  return (
    <Card>
      <Card.Header title="Pricing plan" />
      <Card.Content>
        <Box direction="vertical" gap="12px">
          <Box
            direction="horizontal"
            align="center"
            gap="12px"
            wrap="wrap"
          >
            <SegmentedToggle
              selected={plan}
              onClick={(_, value) => setPlan(value as Plan)}
              ariaLabel="Pricing plan"
            >
              <SegmentedToggle.Button value="FREE">Free</SegmentedToggle.Button>
              <SegmentedToggle.Button value="MEDIUM">
                Medium
              </SegmentedToggle.Button>
            </SegmentedToggle>
            <Badge skin={isPremium ? "premium" : "neutral"}>
              {isPremium ? "Premium features enabled" : "Free plan"}
            </Badge>
          </Box>

          <Text size="small" secondary>
            Medium plan unlocks: popup delay, image, image link and visibility
            targeting.
          </Text>
        </Box>
      </Card.Content>
    </Card>
  );};

