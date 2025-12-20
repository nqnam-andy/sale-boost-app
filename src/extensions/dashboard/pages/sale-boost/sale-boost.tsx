import type { FC } from "react";
import { useState } from "react";
import {
  Box,
  Cell,
  Layout,
  Page,
  WixDesignSystemProvider,
} from "@wix/design-system";
import "@wix/design-system/styles.global.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { SaleBoostProvider } from "./context/SaleBoostContext";
import {
  ModalContentCard,
  ModalPreviewCard,
  Notifications,
  PageHeader,
  PricingPlanCard,
  StyleBehaviorCard,
} from "./components";

/**
 * Root dashboard page entry. Provides design-system + react-query context.
 */
const DashboardPage: FC = () => {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <WixDesignSystemProvider features={{ newColorsBranding: true }}>
      <QueryClientProvider client={queryClient}>
        <SaleBoostProvider>
          <SaleBoostSettings />
        </SaleBoostProvider>
      </QueryClientProvider>
    </WixDesignSystemProvider>
  );
};

/**
 * Main settings layout – 7/5 columns on desktop, stacked on mobile.
 */
const SaleBoostSettings: FC = () => {
  return (
    <Page>
      <Page.Content>
        <PageHeader />

        <div style={{ width: "100%", paddingTop: "18px" }}>
          <Layout>
            {/* Settings column: span 7 on desktop, 12 on mobile */}
            <Cell span={7} rows={1}>
              <Box direction="vertical" gap="18px">
                <Notifications />
                <ModalContentCard />
                <StyleBehaviorCard />
              </Box>
            </Cell>

            {/* Preview column: span 5 on desktop, 12 on mobile */}
            <Cell span={5} rows={1}>
              <ModalPreviewCard />
            </Cell>
          </Layout>
        </div>
      </Page.Content>
    </Page>
  );
};

export default DashboardPage;
