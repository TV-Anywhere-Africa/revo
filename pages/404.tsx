import Link from "next/link";
import Button from "~/components/Button";
import Header from "~/components/Header";
import ROUTES from "~/constants/routes.const";
import MainLayout from "~/layouts/main.layout";

export default function PageNotFound() {
  return (
    <>
      <Header />
      <MainLayout>
        <div className="flex items-center justify-center flex-col gap-7 mt-44">
          <h1 className="text-5xl font-bold">Oops! This page does not exist</h1>
          <Link href={ROUTES.index}>
            <Button>Go home</Button>
          </Link>
        </div>
      </MainLayout>
    </>
  );
}
