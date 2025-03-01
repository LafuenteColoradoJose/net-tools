import Image from "next/image";

export default function Home() {
  return (
    <main className="">
      <header className="py-4 text-center">
        <section className="flex flex-col items-center justify-center space-x-4">
          <a href="/">
            <Image
              src="/logonettools.png"
              alt="Net Tools Calculator"
              width={100}
              height={100}
            />
          </a>
          <h1 className="text-4xl font-bold text-center">Net Tools Calculator</h1>
        </section>
      </header>



    </main>
  );
}
