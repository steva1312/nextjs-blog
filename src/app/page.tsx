import Header from "@/components/header";

export default async function Home() {
  return (
    <>
      <Header />

      <section className="flex flex-col items-center justify-center h-screen bg-gradient-to-b from-white to-red-200/60 gap-2 pb-20">
        <h1 className="text-5xl font-bold">What's on your mind?</h1>
        <h2 className="text-2xl font-medium i text-red-700">Share your daily life with other people</h2>
      </section>
    </>
  );
}
