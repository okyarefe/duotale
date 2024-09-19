import Link from "next/link";

function ContactPage() {
  return (
    <div className="w-full h-screen max-w-4xl mx-auto py-12 md:py-20 flex items-center">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-4 contact-div">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Get in Touch</h2>
            <p className="text-muted-foreground">
              Have a question or feedback? I&#39;d love to hear from you.
            </p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <MailIcon className="h-5 w-5" />
              <Link
                href="mailto:feokyar@gmail.com"
                className="text-primary text-white"
                prefetch={false}
              >
                feokyar@gmail.com
              </Link>
            </div>{" "}
            <Link
              href="/"
              className="inline-block px-6 py-3 border-2 border-primary text-primary bg-white rounded-md shadow-md transition-transform transform hover:scale-105 hover:border-secondary hover:text-secondary hover:bg-gray-100"
            >
              BACK TO HOME PAGE
            </Link>
          </div>
        </div>
        <div className="bg-gradient-to-br from-primary to-primary-foreground rounded-xl p-8 text-primary-foreground">
          <div className="space-y-4">
            <div>
              <h3 className="text-2xl font-bold">Contact Us</h3>
              <p>
                Happy to help you with any questions or feedback you may have.
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <MailIcon className="h-5 w-5" />
                <Link
                  href="mailto:feokyar@gmail.com"
                  className="text-primary-foreground text-blue-700 "
                  prefetch={false}
                >
                  feokyar@gmail.com
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MailIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

export default ContactPage;
