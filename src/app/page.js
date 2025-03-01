import Image from "next/image";

export default function Home() {
  return (
    <main className="">
      <header className="text-center py-4">
        <section className="flex justify-center space-x-4">
          <a href="/">
            <Image
              src="/public/logo.webp"
              alt="Net Tools Calculator"
              width={50}
              height={50}
            />
          </a>
          <h1 className="text-center text-4xl font-bold">Net Tools Calculator</h1>
        </section>
      </header>



    </main>
  );
}
