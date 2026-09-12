import { useCallback, useRef, useState } from "react";
import RoutingCards from "../components/contact/RoutingCards";
import ContactForm from "../components/contact/ContactForm";
import EscalationLadder from "../components/contact/EscalationLadder";
import PresenceStrip from "../components/contact/PresenceStrip";
import FaqCta from "../components/contact/FaqCta";
import { topicFromQuery } from "../components/contact/topics";
import type { TopicKey } from "../components/contact/topics";

/**
 * Contact — `/contact` (contact.md).
 * Light-dominant routing hub + form, dark support-escalation band.
 * Routing cards pre-select the form topic and smooth-scroll to it.
 */
export default function Contact() {
  const [topic, setTopic] = useState<TopicKey>(
    () =>
      topicFromQuery(
        typeof window !== "undefined"
          ? new URLSearchParams(window.location.search).get("topic")
          : null,
      ) ?? "general",
  );
  const [flash, setFlash] = useState(0);
  const formRef = useRef<HTMLDivElement>(null);

  const selectFromCard = useCallback((t: TopicKey) => {
    setTopic(t);
    setFlash((f) => f + 1);
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  return (
    <>
      <RoutingCards onSelect={selectFromCard} />
      <ContactForm ref={formRef} topic={topic} onTopicChange={setTopic} flash={flash} />
      <EscalationLadder />
      <PresenceStrip />
      <FaqCta />
    </>
  );
}
