import MerchantHero from "../components/merchants/MerchantHero";
import ValueProps from "../components/merchants/ValueProps";
import PortalDeepDive from "../components/merchants/PortalDeepDive";
import Resto from "../components/merchants/Resto";
import CheckoutFlow from "../components/merchants/CheckoutFlow";
import DeveloperApi from "../components/merchants/DeveloperApi";
import OnboardingSupport from "../components/merchants/OnboardingSupport";
import MerchantsCta from "../components/merchants/MerchantsCta";

/**
 * For Merchants — `/merchants` (design: merchants.md)
 * RUKPI MERCHANT portal, RUKPI RESTO, Pay with RUKPI checkout, settlement, developer API.
 */
export default function Merchants() {
  return (
    <>
      <MerchantHero />
      <ValueProps />
      <PortalDeepDive />
      <Resto />
      <CheckoutFlow />
      <DeveloperApi />
      <OnboardingSupport />
      <MerchantsCta />
    </>
  );
}
