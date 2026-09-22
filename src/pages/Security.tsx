import SecurityHero from "../components/security/SecurityHero";
import Encryption from "../components/security/Encryption";
import Authentication from "../components/security/Authentication";
import LedgerIntegrity from "../components/security/LedgerIntegrity";
import KycAml from "../components/security/KycAml";
import DataRights from "../components/security/DataRights";
import Accessibility from "../components/security/Accessibility";
import SecurityCta from "../components/security/SecurityCta";

export default function Security() {
  return (
    <>
      <SecurityHero />
      <Encryption />
      <Authentication />
      <LedgerIntegrity />
      <KycAml />
      <DataRights />
      <Accessibility />
      <SecurityCta />
    </>
  );
}
