import Footer from "~/components/Footer";
import Header from "~/components/Header";
import Meta from "~/components/Meta";

export default function Privacy(): JSX.Element {
  return (
    <>
      <Meta title="mCini - Privacy Policy" />
      <Header />
      <main className="mt-[150px] max-w-[800px] pb-10 m-auto px-5">
        <h1 className="text-2xl font-[500] mb-10 text-primary">
          Privacy Policy for mCini Video on Demand (VOD) in Ghana and African
          Market
        </h1>
        <p className="leading-[31px]">
          At mCini, we are committed to protecting the privacy and personal
          information of our users in Ghana and the African market. This Privacy
          Policy outlines how we collect, use, disclose, and safeguard your data
          when you access and use our video-on-demand (VOD) platform. By using
          mCini, you consent to the practices described in this policy.
        </p>
        <br />
        <ul className="gap-5 grid">
          <li className="grid gap-3 mb-5">
            <b>1.Information Collection and Use:</b>
            <p className="leading-[31px]">
              <b>1.1. Personal Information:</b>
              We may collect personal information, including but not limited to
              your name, email address, billing information, and other relevant
              details when you create an account and use our services. This
              information is necessary to provide a personalized and seamless
              experience on our platform.
            </p>
            <p className="leading-[31px]">
              <b>1.2. Usage Data:</b>
              We collect usage data, including your IP address, device
              information, browser type, and operating system, to analyze user
              behavior and improve our services. This data helps us understand
              how you interact with our platform and tailor it to your
              preferences.
            </p>
          </li>

          <li className="grid gap-3 mb-5">
            <b>2.Information Sharing and Disclosure:</b>
            <p className="leading-[31px]">
              <b>2.1. Third-Party Providers:</b>
              We may share your personal information with trusted third-party
              service providers who assist us in operating our platform,
              processing payments, analyzing data, and delivering personalized
              content. These providers are bound by strict confidentiality
              agreements and are only permitted to use your information for the
              designated purposes.
            </p>
            <p className="leading-[31px]">
              <b>2.2. Legal Compliance:</b>
              We may disclose your personal information if required by law or in
              response to a valid legal request. This may include sharing
              information with law enforcement agencies, government authorities,
              or other parties involved in legal proceedings.
            </p>
          </li>

          <li className="grid gap-3 mb-5">
            <b>3.Data Security:</b>
            <p className="leading-[31px]">
              3.1. We employ industry-standard security measures to protect your
              personal information from unauthorized access, disclosure,
              alteration, or destruction. However, please note that no method of
              transmission or storage is 100% secure, and we cannot guarantee
              absolute security.
            </p>
          </li>

          <li className="grid gap-3 mb-5">
            <b>4.Data Retention:</b>
            <p className="leading-[31px]">
              4.1. We will retain your personal information for as long as
              necessary to fulfill the purposes outlined in this Privacy Policy,
              unless a longer retention period is required or permitted by law.
              We will also retain and use your information as necessary to
              comply with our legal obligations, resolve disputes, and enforce
              our agreements.
            </p>
          </li>

          <li className="grid gap-3 mb-5">
            <b>5.User Rights and Choices:</b>
            <p className="leading-[31px]">
              5.1. You have the right to access, update, correct, or delete your
              personal information. You can manage your account settings or
              contact our support team for assistance.
            </p>
            <p className="leading-[31px]">
              5.2. You may choose to opt-out of receiving promotional
              communications from us by following the unsubscribe instructions
              provided in those communications.
            </p>
          </li>

          <li className="grid gap-3 mb-5">
            <b>6.Changes to this Privacy Policy:</b>
            <p className="leading-[31px]">
              6.1. We may update this Privacy Policy periodically to reflect
              changes in our practices or legal requirements. We encourage you
              to review this policy regularly for any updates.
            </p>
          </li>

          <li className="grid gap-3 mb-5">
            <b>7.Contact Us:</b>
            <p className="leading-[31px]">
              7.1. If you have any questions, concerns, or requests regarding
              this Privacy Policy or the privacy practices of mCini, please
              contact us through the provided channels.
            </p>
          </li>
        </ul>
      </main>
      <Footer />
    </>
  );
}
