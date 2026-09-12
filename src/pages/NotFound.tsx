import PageStub from "../components/PageStub";

/** Route stub — full page is implemented by the page agent. */
export default function NotFound() {
  return (
    <PageStub
      eyebrow="404"
      title="404"
      description="This route has not settled yet."
    />
  );
}
