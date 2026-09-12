import PayHero from "../components/pay/PayHero";
import Onboarding from "../components/pay/Onboarding";
import KycTiers from "../components/pay/KycTiers";
import UnifiedWallet from "../components/pay/UnifiedWallet";
import TopUp from "../components/pay/TopUp";
import ScanToPay from "../components/pay/ScanToPay";
import P2pCheckout from "../components/pay/P2pCheckout";
import Activity from "../components/pay/Activity";
import Offline from "../components/pay/Offline";
import PayCta from "../components/pay/PayCta";

export default function Pay() {
  return (
    <>
      <PayHero />
      <Onboarding />
      <KycTiers />
      <UnifiedWallet />
      <TopUp />
      <ScanToPay />
      <P2pCheckout />
      <Activity />
      <Offline />
      <PayCta />
    </>
  );
}
