import { app } from "@wix/astro/builders";
import saleBoost from "./extensions/dashboard/pages/sale-boost/sale-boost.extension.ts";

import saleBoostModal from './extensions/site/embedded-scripts/sale-boost-modal/sale-boost-modal.extension.ts';

export default app().use(saleBoost).use(saleBoostModal);
